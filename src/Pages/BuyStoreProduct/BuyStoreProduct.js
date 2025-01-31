import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { adornicaServ } from '../../service/adornicaServ';

const styles = {
  container: {
    background: '#f0f8ff',
    padding: '30px',
    maxWidth: '900px',
    margin: '50px auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    gridColumn: 'span 2',
    textAlign: 'center',
    opacity: 0.5,
    pointerEvents: 'none'
  },
  buttonEnabled: {
    opacity: 1,
    pointerEvents: 'auto'
  },
  buttonHover: {
    backgroundColor: '#000000'
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
  modalButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px'
  }
};

Modal.setAppElement('#root');

const StoreSelection = () => {
  const [phone, setPhone] = useState('');
  const [ordercode, setOrdercode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phone || ordercode) {
      handleSendOrder();
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      setPhoneError('Số điện thoại chỉ chứa số.');
    } else {
      setPhoneError('');
    }
    setPhone(value);
  };

  const handleSendOrder = () => {
    const orderData = {
      phone: phone,
      orderCode: ordercode
    };

    console.log("Order Data:", orderData);

    adornicaServ.postOrderCode(phone, ordercode)
      .then(response => {
        console.log("Order sent successfully:", response.data);
        setModalMessage('Gửi đơn thành công');
        setModalIsOpen(true);
        setTimeout(() => {
          setModalIsOpen(false);
          navigate(`/storeProductDetail/${ordercode}`);
        }, 1000);
      })
      .catch(error => {
        console.error("There was an error sending the order:", error);
        setModalMessage('Gửi đơn thất bại ! Vui lòng kiểm tra lại thông tin');
        setModalIsOpen(true);
      });
  };

  const isFormValid = phone || ordercode;

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Số điện thoại:</label>
          <input type="text" style={styles.input} value={phone} onChange={handlePhoneChange} />
          {phoneError && <span style={styles.errorMessage}>{phoneError}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mã đơn hàng:</label>
          <input style={styles.input} type="text" value={ordercode} onChange={e => setOrdercode(e.target.value)} />
        </div>
        <button type="submit"
          style={{
            ...styles.button,
            ...(isFormValid ? styles.buttonEnabled : {})
          }}
          onMouseEnter={e => e.target.style.backgroundColor = isFormValid ? styles.buttonHover.backgroundColor : styles.button.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
          disabled={!isFormValid}
        >Kiểm tra</button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={styles.modal}
      >
        <h2>{modalMessage}</h2>
        <button onClick={closeModal} style={styles.modalButton}>Đóng</button>
      </Modal>
    </div>
  );
};

export default StoreSelection;
