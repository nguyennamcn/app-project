import React, { useState } from 'react';
import Modal from 'react-modal';
import { NavLink } from 'react-router-dom';

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
  },
};

const PurchasePage = () => {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    birthday: '',
    paymentMethod: 'Cash'
  });

  const [products] = useState([
    { name: 'Gold Bars', quantity: 1, price: 340 },
    { name: '24K Gold', quantity: 1, price: 290 },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalPrice = products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2);

  const handleMouseDown = (e) => {
    e.target.style.backgroundColor = '#888888';
  };

  const handleMouseUp = (e) => {
    e.target.style.backgroundColor = '';
  };

  const handleFinishClick = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        
        <label style={pageStyles.detailLabel}>Birthday:</label>
        <input type="text" style={pageStyles.detailInput} name="birthday" value={customerDetails.birthday} onChange={handleDetailChange} />
        
        <label style={pageStyles.detailLabel}>Payment methods:</label>
        <select style={pageStyles.paymentSelect} name="paymentMethod" value={customerDetails.paymentMethod} onChange={handleDetailChange}>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
      </div>
      
      <div>
        <div style={pageStyles.productTable}>
          <div style={pageStyles.tableHeader}>
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
          {products.map((product, index) => (
            <div key={index} style={pageStyles.tableRow}>
              <span>{product.name}</span>
              <span>{product.quantity}</span>
              <span>{(product.price * product.quantity).toFixed(2)}$</span>
            </div>
          ))}
          <div style={pageStyles.tableFooter}>
            <span>Total items:</span>
            <span>{totalItems}</span>
            <span>{totalPrice}$</span>
          </div>
        </div>
        <div style={pageStyles.footerInfo}>
          By staff: To Hoang Trung Hieu <br />
          Staff ID: 0001
        </div>
      </div>
      
      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between' }}>
        <NavLink
          to="/buyProduct"
          style={pageStyles.backButton}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          Back
        </NavLink>
        <button
          style={pageStyles.finishButton}
          onClick={handleFinishClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          Finish
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            textAlign: 'center',
          },
        }}
      >
        <h2>Finish Successfully</h2>
        <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Close</button>
      </Modal>
    </div>
  );
};

export default PurchasePage;
