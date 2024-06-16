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
    height: '40px',
    width: '100px',
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
      maxHeight: '200px',
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

const PurchaseDetail = () => {
    const [customerDetails, setCustomerDetails] = useState({
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'Cash',
    });
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isFinishButtonDisabled, setIsFinishButtonDisabled] = useState(false);
    const location = useLocation();
  
    const handleDetailChange = (event) => {
      const { name, value } = event.target;
      setCustomerDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };
  
    const calculateTotalPrice = () => {
      return products.reduce((total, product) => total + product.price, 0).toFixed(2);
    };
  
    const handleFinishClick = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };
  
    const handlePrintClick = () => {
      window.print();
    };
  
    const handleMouseDown = () => {
      setIsFinishButtonDisabled(true);
    };
  
    const handleMouseUp = () => {
      setIsFinishButtonDisabled(false);
    };
  
    useEffect(() => {
      const orderCode = new URLSearchParams(location.search).get('orderCode');
      if (orderCode) {
        adornicaServ.getDetailPurchase(orderCode).then((response) => {
          const data = response.data.metadata;
          setCustomerDetails({
            name: data.customerName,
            phone: data.customerPhone,
            address: '', // Assuming address is not available in metadata
            paymentMethod: data.paymentMethod,
          });
          setProducts(data.list);
          setTotalItems(data.list.length);
        });
      }
    }, [location]);
  
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
          />
  
          <label style={pageStyles.detailLabel}>Address:</label>
          <input
            type="text"
            style={pageStyles.detailInput}
            name="address"
            value={customerDetails.address}
            onChange={handleDetailChange}
          />
  
          <label style={pageStyles.detailLabel}>Payment methods:</label>
          <select
            style={pageStyles.paymentSelect}
            name="paymentMethod"
            value={customerDetails.paymentMethod}
            onChange={handleDetailChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Banking</option>
          </select>
        </div>
  
        <div>
          <div style={pageStyles.productTable}>
            <div style={pageStyles.tableHeader}>
              <span>Product ID</span>
              <span>Product Code</span>
              <span>Price</span>
            </div>
            {products.map((product, index) => (
              <div key={index} style={pageStyles.tableRow}>
                <span>{product.productId}</span>
                <span>{product.productCode}</span>
                <span>${product.price}</span>
              </div>
            ))}
            <div style={pageStyles.tableFooter}>
              <span>Total</span>
              <span>{totalItems} items</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
  
        <div style={pageStyles.footerInfo}>
          <div style={pageStyles.buttonWrapper}>
            <NavLink to="/previous-page" style={{ ...pageStyles.button, ...pageStyles.backButton }}>Back</NavLink>
            <button
              onClick={handleFinishClick}
              style={{ ...pageStyles.button, ...pageStyles.finishButton }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              disabled={isFinishButtonDisabled}
            >
              Finish
            </button>
            <button
              onClick={handlePrintClick}
              style={{ ...pageStyles.button, ...pageStyles.printButton }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              Print
            </button>
          </div>
        </div>
  
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={pageStyles.modal}
        >
          <h2>Order Completed!</h2>
          <p>Your order has been successfully submitted.</p>
          <div style={pageStyles.modalButtonWrapper}>
            <button
              onClick={closeModal}
              style={{ ...pageStyles.button, ...pageStyles.finishButton }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              OK
            </button>
          </div>
        </Modal>
      </div>
    );
  };
  
  export default PurchaseDetail;
