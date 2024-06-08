import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

const styles = {
  container: {
    background: '#AFBEF9',
    padding: '10px',
    maxWidth: '900px',
    margin: '30px auto',
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
    padding: '0px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    padding: '0px 20px',
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
  }
};

const GoldSelection = () => {
  const location = useLocation();
  const { customerData } = location.state || {};

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [productId, setProductId] = useState('None');
  const [totalPrice, setTotalPrice] = useState(340000000);


  let userInfo = useSelector((state) => {
    return state.userReducer.userInfo;
  })
  console.log(userInfo);

  useEffect(() => {
    if (customerData) {
      setName(customerData.customerName);
      setPhone(customerData.phone);
      // Set other fields as needed from customerData
      console.log(customerData)
    }
  }, [customerData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      staffId: userInfo.id,
      customerName: name,
      phone: phone,
      list: [
        {
          name: 'Jewelry' ,
          productId: productId,
          weight: parseFloat(weight),
          origin: 'Unknown',
          price: totalPrice
        }
      ],
      totalPrice: totalPrice,
      productStore: true
    };

    console.log('Form Data Submitted:', formData);

    try {
      const response = await adornicaServ.postPurchaseOrderCode(formData);
      console.log('Order sent successfully:', response.data);
      alert('Order sent successfully');
    } catch (error) {
      console.error('There was an error sending the order:', error);
      if (error.response) {
        console.error('Response data:', error.response);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert('Failed to send order. Please check your input data.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input type="text" style={styles.input} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input type="text" style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>ProductId:</label>
          <input type="text" style={styles.input} value={productId} onChange={e => setProductId(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Weight (gram):</label>
          <input type="number" style={styles.input} value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        
        
        <div style={styles.totalPrice}>
          Total price: {totalPrice.toLocaleString()}
        </div>
        <button type="submit" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        >PURCHASE</button>
      </form>
    </div>
  );
};

export default GoldSelection;
