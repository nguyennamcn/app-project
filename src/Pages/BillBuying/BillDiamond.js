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
    gridTemplateColumns: 'repeat(6, 1fr)',
    fontWeight: 'bold',
    borderBottom: '1px solid #333',
    paddingBottom: '5px',
    textAlign: 'center',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'center',
  },
  tableFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
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
  finishButton: {
    backgroundColor: '#4CAF50',
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
    marginTop:'20px',
  },
  printButton: {
    backgroundColor: '#ADD8E6',
    color: 'black',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
    // marginLeft: '10px',
  },
  modal: {
    content: {
      backgroundColor: '#4CAF50',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      maxHeight: '200px',
      margin: 'auto',
      textAlign: 'center',
      color: 'white',
    },
  },
};

const BillDiamond = () => {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve the state data

  const [customerDetails, setCustomerDetails] = useState({
    name: formData?.customerName || '',
    phone: formData?.phone || '',
    address: '',
    paymentMethod: 'Cash'
  });

  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const totalItems = products.reduce((sum, product) => sum + 1, 0);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach(product => {
      totalPrice  += product.gemBuyPrice;
    });
    return parseFloat(totalPrice).toFixed(2);
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
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      list: products.map(product => ({
        origin: product.origin,
        color: product.color,
        clarity: product.clarity,
        cut: product.cut,
        carat: product.carat,
        price: parseFloat(product.gemBuyPrice)
      })),
      totalPrice: parseFloat(calculateTotalPrice()),
      productStore: false
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

    console.log("Purchase data:", purchaseData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('gemData')) || [];
    setProducts(savedProducts);
  }, []);

  const handlePrintClick = () => {
    window.print();
  };

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>Purchase</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Name:</label>
        <input type="text" style={pageStyles.detailInput} name="name" value={customerDetails.name} onChange={handleDetailChange} />

        <label style={pageStyles.detailLabel}>Phone:</label>
        <input type="text" style={pageStyles.detailInput} name="phone" value={customerDetails.phone} onChange={handleDetailChange} />

        <label style={pageStyles.detailLabel}>Address:</label>
        <input type="text" style={pageStyles.detailInput} name="address" value={customerDetails.address} onChange={handleDetailChange} />

        <label style={pageStyles.detailLabel}>Payment methods:</label>
        <select style={pageStyles.paymentSelect} name="paymentMethod" value={customerDetails.paymentMethod} onChange={handleDetailChange}>
          <option value="Cash">Cash</option>
          <option value="Card">Banking</option>
        </select>
      </div>

      <div>
        <div style={pageStyles.productTable}>
          <div style={pageStyles.tableHeader}>
            <span>Cut</span>
            <span>Carat</span>
            <span>Color</span>
            <span>Clarity</span>
            <span>Origin</span>
            <span>Price</span>
          </div>
          {products.map((product, index) => (
            <div key={index} style={pageStyles.tableRow}>
              <span>{product.cut}</span>
              <span>{product.carat}</span>
              <span>{product.color}</span>
              <span>{product.clarity}</span>
              <span>{product.origin}</span>
              <span>{product.gemBuyPrice + '$'}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={pageStyles.summary}>
        <div style={pageStyles.totalItems}>Total items: {totalItems}</div>
        <div style={pageStyles.totalPrice}>Total price: {calculateTotalPrice()}$</div>
      </div>

      <button
        style={pageStyles.finishButton}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleFinishClick}
      >
        FINISH
      </button>
      
      <NavLink to="/buyProduct" exact>
        <button style={pageStyles.backButton}>BACK</button>
      </NavLink>
      
      <button
        style={pageStyles.printButton}
        onClick={handlePrintClick}
      >
        PRINT
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        style={pageStyles.modal}
      >
        <h2>Successfully</h2>
        <p>Thank you for your purchase!</p>
        <NavLink to="/buyProduct" exact>
          <button style={pageStyles.backButton}>BACK</button>
        </NavLink>
      </Modal>
    </div>
  );
};

export default BillDiamond;
