import React, { useState,useEffect } from 'react';
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
    // Prepare data to send
    const purchaseData = {
      purchaseOrderCode: generateRandomOrderCode(), // You need to provide a purchase order code
      staffId: userInfo.id, // Set to the staff ID you want to associate with the purchase
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      list: products.map(product => ({
        //name: product.goldType,
        // materialId: 0, // You need to provide a material ID
        //weight: parseFloat(product.weight),
        origin: product.origin, // You need to provide the origin
        color: product.color, // You need to provide the color
        clarity: product.clarity, // You need to provide the clarity
        cut: product.cut, // You need to provide the cut
        carat: product.carat, // You need to provide the carat
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
  
    // Send the purchase data to the server or do whatever you need to do with it
    console.log("Purchase data:", purchaseData);
  
    // Show modal
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    // Retrieve data from local storage
    const savedProducts = JSON.parse(localStorage.getItem('gemData')) || [];
    setProducts(savedProducts);
  }, []);

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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        style={pageStyles.modal}
      >
        <h2>Payment success</h2>
        <p>Thank you for your purchase!</p>
        <NavLink to="/buyProduct" exact>
          <button style={pageStyles.backButton}>Back</button>
        </NavLink>
      </Modal>
    </div>
  );
};

export default BillDiamond;
