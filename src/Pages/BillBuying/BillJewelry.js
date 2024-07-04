import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { NavLink, useLocation } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

Modal.setAppElement('#root');

const pageStyles = {
  container: {
    background: '#e0f7fa', // Màu nền lam nhạt
    padding: '20px',
    maxWidth: '1000px',
    margin: '20px auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  header: {
    gridColumn: 'span 2',
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    color: '#2e7d32', // Màu chữ lục đậm
  },
  customerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#2e7d32', // Màu chữ lục đậm
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  detailInput: {
    padding: '10px',
    border: '2px solid #388e3c', // Viền lục
    borderRadius: '5px',
    fontSize: '12px',
    marginBottom: '5px',
  },
  errorText: {
    color: 'red',
    marginBottom: '5px',
  },
  paymentSelect: {
    padding: '10px',
    border: '2px solid #388e3c', // Viền lục
    borderRadius: '5px',
    fontSize: '12px',
  },
  productTable: {
    width: '200%',
    border: '2px solid #388e3c', // Viền lục
    borderRadius: '5px',
    padding: '10px',
    marginTop: '21px',
  },
  buttonWrapper: {
    gridColumn: 'span 2',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    width: '100%',
  },
  tableHeader: {
    fontSize: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    fontWeight: 'bold',
    borderBottom: '1px solid #388e3c', // Viền lục
    paddingBottom: '5px',
    textAlign: 'center',
    color: '#2e7d32', // Màu chữ lục đậm
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'center',
    color: '#333',
    fontSize: '15px',
  },
  tableFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    fontWeight: 'bold',
    borderTop: '1px solid #388e3c', // Viền lục
    paddingTop: '5px',
    textAlign: 'center',
    marginTop: '10px',
    color: '#2e7d32', // Màu chữ lục đậm
  },
  footerInfo: {
    gridColumn: 'span 2',
    textAlign: 'right',
    fontSize: '14px',
    marginTop: '70px',
    color: '#2e7d32', // Màu chữ lục đậm
  },
  totalSummary: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32', // Màu chữ lục đậm
  },
  finishButton: {
    backgroundColor: '#388e3c', // Màu nền lục
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#cccccc',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
  },
  printButton: {
    backgroundColor: '#c8e6c9',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
  },
  modal: {
    content: {
      backgroundColor: '#388e3c', // Màu nền lục
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      maxHeight: '200px',
      margin: 'auto',
      textAlign: 'center',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  },
  modalButtonWrapper: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  successIcon: {
    fontSize: '50px',
    marginBottom: '10px',
  },
  // Media queries for responsive design
  '@media (max-width: 1024px)': {
    container: {
      gridTemplateColumns: '1fr',
      padding: '10px',
    },
    header: {
      fontSize: '20px',
    },
    detailInput: {
      fontSize: '10px',
      padding: '8px',
    },
    detailLabel: {
      fontSize: '10px',
    },
    productTable: {
      width: '100%',
      padding: '5px',
    },
    tableHeader: {
      fontSize: '10px',
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    tableRow: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    tableFooter: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    footerInfo: {
      fontSize: '12px',
    },
    finishButton: {
      fontSize: '12px',
      padding: '8px 16px',
    },
    backButton: {
      fontSize: '12px',
      padding: '8px 16px',
    },
    printButton: {
      fontSize: '12px',
      padding: '8px 16px',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      gridTemplateColumns: '1fr',
      padding: '5px',
    },
    header: {
      fontSize: '18px',
    },
    detailInput: {
      fontSize: '8px',
      padding: '6px',
    },
    detailLabel: {
      fontSize: '8px',
    },
    productTable: {
      width: '100%',
      padding: '3px',
    },
    tableHeader: {
      fontSize: '8px',
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    tableRow: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    tableFooter: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    footerInfo: {
      fontSize: '10px',
    },
    finishButton: {
      fontSize: '10px',
      padding: '6px 12px',
    },
    backButton: {
      fontSize: '10px',
      padding: '6px 12px',
    },
    printButton: {
      fontSize: '10px',
      padding: '6px 12px',
    },
  },
};

const BillJewelry = () => {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve the state data

  const [customerDetails, setCustomerDetails] = useState({
    name: formData?.customerName || '',
    phone: formData?.phone || '',
    address: formData?.address || '',
    paymentMethod: 'Cash',
  });

  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isCreated, setIsCreated] = useState(false); // Trạng thái đã tạo hóa đơn

  useEffect(() => {
    if (customerDetails.phone) {
      adornicaServ
        .getPhoneCustomer(customerDetails.phone)
        .then((response) => {
          if (response.data) {
            setCustomerDetails((prevDetails) => ({
              ...prevDetails,
              name: response.data.metadata.name,
              address: response.data.metadata.address,
            }));
          } else {
            setCustomerDetails((prevDetails) => ({
              ...prevDetails,
              name: '',
              address: '',
            }));
          }
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
          setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            name: '',
            address: '',
          }));
        });
    }
  }, [customerDetails.phone]);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) {
        setPhoneError('Phone number must be digits only!');
        return;
      } else if (value.length > 10) {
        return;
      } else {
        setPhoneError('');
      }
    }
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const totalItems = products.length;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach((product) => {
      totalPrice += product.total;
    });
    return totalPrice;

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
    // Prepare data to send
    const purchaseData = {
      purchaseOrderCode: generateRandomOrderCode(), // You need to provide a purchase order code
      staffId: userInfo.id, // Set to the staff ID you want to associate with the purchase
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,

      list: products.map((product) => ({
        name: product.goldType,
        materialId: product.materialId ? product.materialId : "",
        weight: parseFloat(product.weight),
        color: product.color, // You need to provide the color
        clarity: product.clarity, // You need to provide the clarity
        cut: product.cut, // You need to provide the cut
        origin: product.origin,

        carat: parseFloat(product.carat), // You need to provide the carat
        price: parseFloat(product.total),
      })),
      totalPrice: parseFloat(calculateTotalPrice()),
      productStore: false,
    };

    adornicaServ
      .postPurchaseOrderCode(purchaseData)
      .then((res) => {
        console.log('Order submitted successfully:', res.data);
        setIsCreated(true); // Đặt trạng thái đã tạo hóa đơn thành true
      })
      .catch((err) => {
        console.error('Error submitting order:', err.response);
        alert(`Error submitting order: ${err.response?.data?.message || 'Unknown error'}`);
      });

    // Send the purchase data to the server or do whatever you need to do with it
    console.log('Purchase data:', purchaseData);

    // Show modal
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    // Retrieve data from local storage
    const savedProducts = JSON.parse(localStorage.getItem('jewelryData')) || [];
    setProducts(savedProducts);
    console.log('Product from cart', savedProducts);
  }, []);

  const handlePrintClick = () => {
    // window.print();
  };

  const isFinishButtonDisabled = !customerDetails.name || !customerDetails.phone || !customerDetails.address || isCreated;

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>Purchase</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Name:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="name"
          value={customerDetails.name}
          onChange={handleDetailChange}
        />

        <label style={pageStyles.detailLabel}>Phone:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="phone"
          value={customerDetails.phone}
          onChange={handleDetailChange}
          maxLength={10}
        />
        {phoneError && <div style={pageStyles.errorText}>{phoneError}</div>}

        <div style={pageStyles.productTable}>
          <div style={pageStyles.tableHeader}>
            <span>Name</span>
            <span>Gold type</span>
            <span>Weight</span>
            <span>Cut</span>
            <span>Carat</span>
            <span>Color</span>
            <span>Clarity</span>
            <span>Origin</span>
            <span>Total</span>
          </div>
          {products.map((product, index) => (
            <div key={index} style={pageStyles.tableRow}>
              <span>{product.name}</span>
              <span>{product.goldType}</span>
              <span>{product.weight}</span>
              <span>{product.cut}</span>
              <span>{product.carat}</span>
              <span>{product.color}</span>
              <span>{product.clarity}</span>
              <span>{product.origin}</span>
              <span>{formatPrice(product.total)}</span>
              {/* formatPrice */}
            </div>
          ))}
        </div>
      </div>

      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Address:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="address"
          value={customerDetails.address}
          onChange={handleDetailChange}
        />

        {/* <label style={pageStyles.detailLabel}>Payment methods:</label>
        <select
          style={pageStyles.paymentSelect}
          name="paymentMethod"
          value={customerDetails.paymentMethod}
          onChange={handleDetailChange}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Banking</option>
        </select> */}
      </div>

      <div style={pageStyles.summary}>
        <div style={pageStyles.totalItems}>Total items: {totalItems}</div>
        <div style={pageStyles.totalPrice}>Total price: {formatPrice(calculateTotalPrice())}</div>
      </div>

      <div style={pageStyles.buttonWrapper}>
        <NavLink to="/buyProduct" exact>
          <button style={pageStyles.backButton}>BACK</button>
        </NavLink>

        <button
          style={{ ...pageStyles.finishButton, ...(isFinishButtonDisabled ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}) }}
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
        <div style={pageStyles.successIcon}>✔</div>
        <h2>Successfully</h2>
      </Modal>
    </div>
  );
};

export default BillJewelry;