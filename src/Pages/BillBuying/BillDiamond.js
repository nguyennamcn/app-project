import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { NavLink, useLocation , useNavigate} from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

Modal.setAppElement('#root');

const pageStyles = {
  container: {
    maxHeight: '70vh',
    overflowY: 'auto',
    background: '#e0f7fa', 
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
    color: '#2e7d32', 
  },
  customerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#2e7d32',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  detailInput: {
    padding: '10px',
    border: '2px solid #388e3c', 
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
    border: '2px solid #388e3c', 
    borderRadius: '5px',
    fontSize: '12px',
  },
  productTable: {
    width: '200%',
    border: '2px solid #388e3c', 
    borderRadius: '5px',
    padding: '10px',
    marginTop: '21px',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '10px',
  },
  tableHeader: {
    fontWeight: 'bold',
    borderBottom: '1px solid #4682b4', 
    paddingBottom: '5px',
    textAlign: 'center',
    color: '#2e7d32', 
    display: 'contents', 
  },
  tableRow: {
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'center',
    color: '#333',
    display: 'contents', 
  },
  tableFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    fontWeight: 'bold',
    borderTop: '1px solid #388e3c',
    paddingTop: '5px',
    textAlign: 'center',
    marginTop: '10px',
    color: '#2e7d32',
  },
  footerInfo: {
    gridColumn: 'span 2',
    textAlign: 'right',
    fontSize: '14px',
    marginTop: '70px',
    color: '#2e7d32', 
  },
  totalSummary: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32',
  },
  buttonWrapper: {
    gridColumn: 'span 2',
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
  },
  printButton: {
    backgroundColor: '#ADD8E6',
    color: 'black',
  },
  modal: {
    content: {
      backgroundColor: '#388e3c', 
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
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  successIcon: {
    fontSize: '50px',
    marginBottom: '10px',
  },
};

const BillDiamond = () => {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve the state data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [address, setAddress] = useState('');

  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false); // Trạng thái đã tạo hóa đơn
  const navigate = useNavigate();
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
            setAddress('');
          }
        })
        .catch(error => {
          console.error("Error fetching customer data:", error);
          setCustomerName('');
          setAddress('');
        });
    }
  }, [customerPhone]);

  const handleInputChange = (setter) => (event) => {
    const { value } = event.target;
    if (setter === setCustomerPhone) {
      if (!/^\d*$/.test(value)) {
        setPhoneError('Phone number must be digits only!');
        return;
      } else if (value.length > 10) {
        return;
      } else {
        setPhoneError('');
      }
    }
    setter(value);
  };

  const totalItems = products.length;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach((product) => {
      totalPrice += parseFloat(product.gemBuyPrice);
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
    const purchaseData = {
      purchaseOrderCode: generateRandomOrderCode(),
      staffId: userInfo.id,
      customerName: customerName,
      phone: customerPhone,
      address: address,
      list: products.map((product) => ({
        name: "NONE",
        materialId: "",
        weight: 0,
        origin: product.origin,
        color: product.color,
        clarity: product.clarity,
        cut: product.cut,
        carat: product.carat,
        price: parseFloat(product.gemBuyPrice),
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

    console.log('Purchase data:', purchaseData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (isCreated) {
      navigate('/buyProduct');
    }
  };

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('gemData')) || [];
    setProducts(savedProducts);
  }, []);

  const handlePrintClick = () => {
    // window.print();
  };

  const isFinishButtonDisabled = !customerName || !customerPhone || !address || isCreated;

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>Thu mua</div>
      <div style={pageStyles.customerDetails}>
        <label style={pageStyles.detailLabel}>Số điện thoại:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="phone"
          value={customerPhone}
          onChange={handleInputChange(setCustomerPhone)}
          maxLength={10}
        />
        {phoneError && <div style={pageStyles.errorText}>{phoneError}</div>}

        <label style={pageStyles.detailLabel}>Tên:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="name"
          value={customerName}
          onChange={handleInputChange(setCustomerName)}
        />

        <div style={pageStyles.productTable}>
          <div style={pageStyles.tableHeader}>
            <span>Vết cắt</span>
            <span>Khối lượng</span>
            <span>Màu sắc</span>
            <span>Độ tinh khiết</span>
            <span>Nguồn gốc</span>
            <span>Giá</span>
          </div>
          {products.map((product, index) => (
            <div key={index} style={pageStyles.tableRow}>
              <span>{product.cut}</span>
              <span>{product.carat}</span>
              <span>{product.color}</span>
              <span>{product.clarity}</span>
              <span>{product.origin}</span>
              <span>{formatPrice(product.gemBuyPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={pageStyles.customerDetails}>
      <label style={pageStyles.detailLabel}>Địa chỉ:</label>
        <input
          type="text"
          style={pageStyles.detailInput}
          name="address"
          value={address}
          onChange={handleInputChange(setAddress)}
        />
      </div>

      <div style={pageStyles.summary}>
        <div style={pageStyles.totalItems}>Tổng sản phẩm: {totalItems}</div>
        <div style={pageStyles.totalPrice}>Tổng tiền: {formatPrice(calculateTotalPrice())}</div>
      </div>

      <div style={pageStyles.buttonWrapper}>
        <NavLink to="/buyProduct" exact>
          <button style={{ ...pageStyles.button, ...pageStyles.backButton }}>Trở về</button>
        </NavLink>

        <button
          style={{ ...pageStyles.button, ...pageStyles.finishButton, ...(isFinishButtonDisabled ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}) }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleFinishClick}
          disabled={isFinishButtonDisabled}
        >
          Tạo đơn
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        style={pageStyles.modal}
      >
        <div style={pageStyles.successIcon}>✔</div>
        <h2>Thành công</h2>
      </Modal>
    </div>
  );
};

export default BillDiamond;