import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { NavLink, useLocation } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

Modal.setAppElement('#root');

const pageStyles = {
  container: {
    background: '#FFFFFF',
    padding: '20px',
    maxWidth: '1000px',
    margin: '20px auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  header: {
    gridColumn: 'span 2',
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
  },
  customerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  detailInput: {
    padding: '10px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '12px',
    marginBottom: '5px',
  },
  paymentSelect: {
    padding: '10px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '12px',
  },
  productTable: {
    width: '100%',
    border: '1px solid #333',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '21px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    fontWeight: 'bold',
    borderBottom: '1px solid #333',
    paddingBottom: '5px',
    textAlign: 'center',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'center',
  },
  tableFooter: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    fontWeight: 'bold',
    borderTop: '1px solid #333',
    paddingTop: '5px',
    textAlign: 'center',
    marginTop: '10px',
  },
  footerInfo: {
    gridColumn: 'span 2',
    textAlign: 'right',
    fontSize: '14px',
    marginTop: '70px',
  },
  totalSummary: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    width: '100%',
  },
  button: {
    height: '40px', // Set a fixed height
    width: '100px', // Set a fixed width
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
    border: 'none',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  backButton: {
    backgroundColor: '#cccccc',
    color: 'black',
    marginRight: '0px',
  },
  printButton: {
    backgroundColor: '#ADD8E6',
    color: 'black',
  },
  modal: {
    content: {
      backgroundColor: '#4CAF50',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      maxHeight: '100px',
      margin: 'auto',
      textAlign: 'center',
      color: 'white',
    },
  },
  modalButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};

const BillGold = () => {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve the state data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [address, setAddress] = useState('');
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (customerPhone) {
      adornicaServ.getPhoneCustomer(customerPhone)
        .then(response => {
          if (response.data) {
            setCustomerName(response.data.metadata.name);
            setAddress(response.data.metadata.address);
            console.log(response)
          } else {
            setCustomerName('');
          }
        })
        .catch(error => {
          console.error("Error fetching customer data:", error);
          setCustomerName(''); // Clear the customer name if there's an error
        });
    }
  }, [customerPhone]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('goldData')) || [];
    setProducts(savedProducts);
  }, []);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const totalItems = products.reduce((sum, product) => sum + 1, 0);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach((product) => {
      totalPrice += product.materialBuyPrice;
    });
    return totalPrice.toFixed(2);
  };

  const handleMouseDown = (e) => {
    e.target.style.backgroundColor = '#888888';
  };

  const handleMouseUp = (e) => {
    e.target.style.backgroundColor = '#4CAF50';
  };

  const generateRandomOrderCode = () => {
    return 'PO' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleFinishClick = () => {
    const purchaseData = {
      purchaseOrderCode: generateRandomOrderCode(),
      staffId: userInfo.id,
      customerName: customerName,
      phone: customerPhone,
      address: address,
      list: products.map((product) => ({
        name: product.goldType,
        weight: parseFloat(product.weight),
        price: parseFloat(product.materialBuyPrice),
      })),
      totalPrice: parseFloat(calculateTotalPrice()),
      productStore: false,
    };

    adornicaServ
      .postPurchaseOrderCode(purchaseData)
      .then((res) => {
        console.log('Order submitted successfully:', res.data);
      })
      .catch((err) => {
        console.error('Error submitting order:', err.response);
        alert(`Error submitting order: ${err.response?.data?.message || 'Unknown error'}`);
      });

    console.log('Purchase data:', purchaseData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePrintClick = () => {
    // window.print();
  };

  const isFinishButtonDisabled = !customerName || !customerPhone || !address;

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>Purchase</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Name:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="name"
          value={customerName}
          onChange={handleInputChange(setCustomerName)}
        />

        <label style={pageStyles.detailLabel}>Phone:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="phone"
          value={customerPhone}
          onChange={handleInputChange(setCustomerPhone)}
        />

        <label style={pageStyles.detailLabel}>Address:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="address"
          value={address}
          onChange={handleInputChange(setAddress)}
        />

        <label style={pageStyles.detailLabel}>Payment methods:</label>
        <select
          style={pageStyles.paymentSelect}
          name="paymentMethod"
          value={paymentMethod}
          onChange={handleInputChange(setPaymentMethod)}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Banking</option>
        </select>
      </div>

      <div>
        <div style={pageStyles.productTable}>
          <div style={pageStyles.tableHeader}>
            <span>Product</span>
            <span>Weight</span>
            <span>Price</span>
          </div>
          {products.map((product, index) => (
            <div key={index} style={pageStyles.tableRow}>
              <span>{product.goldType}</span>
              <span>{product.weight}</span>
              <span>{product.materialBuyPrice.toFixed(2)}$</span>
            </div>
          ))}
        </div>
      </div>

      <div style={pageStyles.summary}>
        <div style={pageStyles.totalItems}>Total items: {totalItems}</div>
        <div style={pageStyles.totalPrice}>Total price: {calculateTotalPrice()}$</div>
      </div>
      <div style={pageStyles.buttonWrapper}>
        <NavLink to="/buyProduct" exact>
          <button style={{ ...pageStyles.button, ...pageStyles.backButton }}>BACK</button>
        </NavLink>

        <button
          style={{ ...pageStyles.button, ...pageStyles.finishButton, ...(isFinishButtonDisabled ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}) }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleFinishClick}
          disabled={isFinishButtonDisabled}
        >
          CREATE
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        style={pageStyles.modal}
      >
        <h2>Successfully</h2>
      </Modal>
    </div>
  );
};

export default BillGold;
