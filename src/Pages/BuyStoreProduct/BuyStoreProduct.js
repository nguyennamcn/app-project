import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';

// Define styles as objects
const styles = {
  container: {
    background: '#A2F4EF',
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
  }
};

const StoreSelection = () => {
  const [phone, setPhone] = useState('');
  const [ordercode, setOrdercode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phone || ordercode) {
      handleSendOrder();
    }
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
        alert('Order sent successfully');
        navigate(`/storeProductDetail/${ordercode}`);
      })
      .catch(error => {
        console.error("There was an error sending the order:", error);
        alert('Failed to send order. Please check your input data.');
      });
  };

  const isFormValid = phone || ordercode;

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input type="text" style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Order code:</label>
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
        >Check</button>
      </form>
    </div>
  );
};

export default StoreSelection;
