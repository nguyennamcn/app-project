import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { NavLink, useParams } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import Spinner from '../../Components/Spinner/Spinner';

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
    maxHeight:'70vh',
    overflowY:'auto',
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
  const [loading, setLoading] = useState(true);

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Undefined';
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

  // const formatPrice = (price) => {
  //   return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A';
  // };

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
        console.log('Order Created :', data);
      })
      .catch((err) => {
        console.error('Error updating order:', err.response);
        console.log('Order Created :', data);
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
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, [orderCode]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div style={pageStyles.container}>
      <div style={pageStyles.header}>Đơn hàng mua lại</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Tên khách hàng:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="name"
          value={sp?.customerName}
          disabled
        />

        <label style={pageStyles.detailLabel}>Số điện thoại:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="phone"
          value={sp?.customerPhone}
          disabled
        />

        <label style={pageStyles.detailLabel}>Địa chỉ:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="address"
          value={sp?.customerAddress}
          disabled
        />

        <label style={pageStyles.detailLabel}>Hình thức thanh toán:</label>
        <select
          style={pageStyles.paymentSelect}
          name="paymentMethod"
          value={customerDetails.paymentMethod}
          onChange={handleDetailChange}
        >
          <option value="CASH">Tiền mặt</option>
        </select>
      </div>
      <div>
        <h1>Mã đơn hàng: {sp?.orderCode}</h1>
        <h1>Tổng số tiền: {formatPrice(sp?.totalAmount)}</h1>
      </div>

      <div style={pageStyles.footerInfo}>
        <div style={pageStyles.buttonWrapper}>
          <NavLink to="/historyOrder" style={{ ...pageStyles.button, ...pageStyles.backButton }}>Trở về</NavLink>
          <button
            onClick={handleFinishClick}
            style={{ backgroundColor: '#00ca4d',
              border: '1px solid purple',
              color: 'white',
              padding: '9px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight:'5px' }}
          >
            Hoàn thành
          </button>
        </div>
      </div>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={pageStyles.modal}
      >
        <h2>Hoàn thành đơn hàng!</h2>
        <p>Đơn hàng đã thanh toán thành công</p>
        <div style={pageStyles.modalButtonWrapper}>
          <NavLink to="/historyOrder" style={{ backgroundColor: 'gray',
              border: '1px solid purple',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight:'5px' }}>Trở về</NavLink>
          <button
            onClick={handleDownloadPDF}
            style={{ backgroundColor: '#00ca4d',
              border: '1px solid purple',
              color: 'white',
              padding: '0px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight:'5px' }}
          >
            In hóa đơn
          </button>
        </div>
      </Modal>
    </div>
      )
    }
</>
    
  );
};

export default PurchaseDetailHistory;