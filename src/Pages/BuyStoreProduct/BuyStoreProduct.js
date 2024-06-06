import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import StoreProductDetail from './StoreProductDetail';

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
    textAlign: 'center'
  },
  buttonHover: {
    backgroundColor: '#000000'
  },
  totalPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    margin: '20px 0'
  }
};

const StoreSelection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ordercode, setOrdercode] = useState('');
  const [productcode, setProductcode] = useState('');
  const [product, setProduct] = useState(null);


  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendOrder();
  };

  const handleSendOrder = () => {
    const orderData = {
      phone : phone,
      orderId : ordercode
    };

    console.log("Order Data:", orderData); // Log the order data

    adornicaServ.postOrderCode(phone, ordercode)
      .then(response => {
        console.log("Order sent successfully:", response.data);
        setProduct([]);
        localStorage.removeItem('cartItems');
        alert('Order sent successfully');
      })
      .catch(error => {
        console.error("There was an error sending the order:", error);
        alert('Failed to send order. Please check your input data.');
      });
  };

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
        <button  type="submit" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        ><a href='/storeProductDetail'>Check</a></button>
      </form>
    </div>
  );
};

export default StoreSelection;
