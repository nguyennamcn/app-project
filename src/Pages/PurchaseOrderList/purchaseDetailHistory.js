import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { NavLink, useParams } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';

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
  downloadButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: '2px solid black',
  },
  modal: {
    content: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      maxHeight: '200px',
      margin: 'auto',
      textAlign: 'center',
      color: 'black',
    },
  },
  modalButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};

const PurchaseDetailHistory = () => {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash',
  });
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { orderCode } = useParams();
  const [sp, setSp] = useState();

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDownloadPDF = () => {
    console.log(orderCode);
    adornicaServ.postPurchaseExport(orderCode)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${orderCode}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error('Error fetching PDF:', error));
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + product.price, 0).toFixed(2);
  };

  const handleFinishClick = () => {
    const data = {
      orderId: sp?.orderId,
      orderCode: sp?.orderCode,
      address: sp?.customerAddress,
      name: sp?.customerName,
      dateOfBirth: '',
      paymentMethod: 'CASH',
      amount: sp?.totalAmount,
      customerPhone: sp?.customerPhone,
    };
    adornicaServ.postPayment(data)
      .then((res) => {
        console.log('Order updated successfully:', res);
      })
      .catch((err) => {
        console.error('Error updating order:', err.response);
      });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    adornicaServ.getListOrderPurchase(orderCode)
      .then((res) => {
        console.log(res.data.metadata);
        setSp(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderCode]);

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>Purchase</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Name:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="name"
          value={sp?.customerName}
          disabled
        />

        <label style={pageStyles.detailLabel}>Phone:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="phone"
          value={sp?.customerPhone}
          disabled
        />

        <label style={pageStyles.detailLabel}>Address:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="address"
          value={sp?.customerAddress}
          disabled
        />

        <label style={pageStyles.detailLabel}>Payment methods:</label>
        <select
          style={pageStyles.paymentSelect}
          name="paymentMethod"
          value={customerDetails.paymentMethod}
          onChange={handleDetailChange}
        >
          <option value="CASH">Cash</option>

        </select>
      </div>
      <div>
        <h1>Order Code : {sp?.orderCode}</h1>
        {/* <h1>Order ID : {sp?.orderId}</h1> */}
        <h1>Total Amount : {sp?.totalAmount}</h1>
      </div>

      <div style={pageStyles.footerInfo}>
        <div style={pageStyles.buttonWrapper}>
          <NavLink to="/historyOrder" style={{ ...pageStyles.button, ...pageStyles.backButton }}>Back</NavLink>
          <button
            onClick={handleFinishClick}
            style={{ ...pageStyles.button, ...pageStyles.finishButton }}
          >
            Finish
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
          <NavLink to="/historyOrder" style={{ ...pageStyles.button, ...pageStyles.backButton }}>Back</NavLink>
          <button
            onClick={handleDownloadPDF}
            style={{ ...pageStyles.button, ...pageStyles.downloadButton }}
          >
            Download PDF
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseDetailHistory;
