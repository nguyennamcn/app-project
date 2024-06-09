import React, { useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

// Define styles as objects
const styles = {
  container: {
    background: '#7FDBF8',
    padding: '20px 20px',
    maxWidth: '900px',
    margin: '20px auto',
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
    // transition: 'background-color 0.3s',
    gridColumn: 'span 2',
    textAlign: 'center'
  },
  buttonHover: { // This style needs to be applied dynamically on hover
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

const GoldSelection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [color, setColor] = useState('');
  const [cut, setCut] = useState('');
  const [clarity, setClarity] = useState('');
  const [caratWeight, setCaratWeight] = useState('');
  const [totalPrice, setTotalPrice] = useState('340,000,000');

  let userInfo = useSelector((state) => {
    return state.userReducer.userInfo;
  })
  console.log(userInfo);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      staffId: userInfo.id,
      customerName: name,
      phone: phone,
      list: [
        {
          name:'Diamond',
          origin: 'Unknown',
          color: color,
          clarity: clarity,
          cut: cut,
          carat: parseFloat(caratWeight),
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
          <label style={styles.label}>Color:</label>
          <select style={styles.input} value={color} onChange={e => setColor(e.target.value)}>
            <option value=''></option>
            <option value='D'>D</option>
            <option value='E'>E</option>
            <option value='F'>F</option>
            <option value='G'>G</option>
            <option value='H'>H</option>
            <option value='I'>I</option>
            <option value='J'>J</option>
            <option value='K'>K</option>
            <option value='L'>L</option>
            <option value='M'>M</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Cut:</label>
          <select style={styles.input} value={cut} onChange={e => setCut(e.target.value)}>
            <option value=""></option>
            <option value="EX">EX</option>
            <option value="G">G</option>
            <option value="F">F</option>
            <option value="P">P</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Clarity:</label>
          <select style={styles.input} value={clarity} onChange={e => setClarity(e.target.value)}>
            <option value=''></option>
            <option value='FL'>FL</option>
            <option value='IF'>IF</option>
            <option value='VVS1'>VVS1</option>
            <option value='VVS2'>VVS2</option>
            <option value='VS1'>VS1</option>
            <option value='VS2'>VS2</option>
            <option value='SI1'>SI1</option>
            <option value='SI2'>SI2</option>
            <option value='I1'>I1</option>
            <option value='I2'>I2</option>
            <option value='I3'>I3</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>CaratWeight:</label>
          <input type="number" style={styles.input} value={caratWeight} onChange={e => setCaratWeight(e.target.value)} />
        </div>
        <div style={styles.totalPrice}>
          Total price: {totalPrice}
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


