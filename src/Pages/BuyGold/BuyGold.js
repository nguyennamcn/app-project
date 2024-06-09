import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

// Define styles as objects
const styles = {
  container: {
    background: '#F7F0B6',
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

const GoldSelection = () => {
  const [name, setName] = useState('');
  const [goldType, setGoldType] = useState('');
  const [weight, setWeight] = useState('');
  const [phone, setPhone] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);

  const userInfo = useSelector((state) => state.userReducer.userInfo);

  useEffect(() => {
    adornicaServ.getPriceMaterial()
      .then((res) => {
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const selectedGold = goldPrices.find(gold => gold.materialName === goldType);
    if (selectedGold) {
      const calculatedPrice = selectedGold.materialBuyPrice * parseFloat(weight || 0);
      setTotalPrice(calculatedPrice.toFixed(2));
    }
  }, [goldType, weight, goldPrices]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      staffId: userInfo.id,
      customerName: name,
      phone: phone,
      list: [
        {
          name: goldType,
          weight: parseFloat(weight),
          origin: 'Unknown',
          price: totalPrice
        }
      ],
      totalPrice: totalPrice,
      productStore: true
    };

    try {
      const response = await adornicaServ.postPurchaseOrderCode(formData);
      console.log('Order sent successfully:', response.data);
      alert('Order sent successfully');
    } catch (error) {
      console.error('There was an error sending the order:', error);
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
          <label style={styles.label}>Gold type:</label>
          <select style={styles.input} value={goldType} onChange={e => setGoldType(e.target.value)}>
            <option value=""></option>
            {goldPrices.map((gold) => (
              <option key={gold.materialId} value={gold.materialName}>{gold.materialName}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Weight (gram):</label>
          <input type="number" style={styles.input} value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div style={styles.totalPrice}>
          Total price: {totalPrice} $
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
