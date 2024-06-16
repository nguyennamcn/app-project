import React, { useState, useEffect, useRef } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

// Define styles as objects
const styles = {
  container: {
    maxHeight: '70vh', // Adjust this value as needed
    overflowY: 'auto', // Add this line to enable vertical scrolling
    background: '#F7F0B6',
    padding: '20px',
    maxWidth: '900px',
    margin: '0px auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px' // Increased gap for better spacing
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
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
    fontSize: '16px',
    width: '100%' // Ensure input takes full width
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
    textDecoration: 'none',
  },
  buttonHover: {
    backgroundColor: '#000000'
  },
  addButtonGold: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px', // Increased padding for better look
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px', // Increased font size for better readability
    textAlign: 'center',
    gridColumn: 'span 2',
    justifySelf: 'center',
    marginTop: '20px' // Increased margin for better spacing
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
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
  const [goldItems, setGoldItems] = useState([{ goldType: '', weight: '' }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);
  const newItemRef = useRef(null);

  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const navigate = useNavigate(); // Get the navigate function

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
    let calculatedTotalPrice = 0;
    goldItems.forEach(item => {
      const selectedGold = goldPrices.find(gold => gold.materialName === item.goldType);
      if (selectedGold) {
        calculatedTotalPrice += selectedGold.materialBuyPrice * parseFloat(item.weight || 0);
      }
    });
    setTotalPrice(calculatedTotalPrice.toFixed(2));
  }, [goldItems, goldPrices]);

  const handleAddItem = () => {
    setGoldItems([...goldItems, { goldType: '', weight: '' }]);
    setTimeout(() => {
      if (newItemRef.current) {
        newItemRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = goldItems.filter((_, i) => i !== index);
    setGoldItems(updatedItems);
  };

  const handleGoldTypeChange = (index, value) => {
    const newGoldItems = [...goldItems];
    newGoldItems[index].goldType = value;
    setGoldItems(newGoldItems);
  };

  const handleWeightChange = (index, value) => {
    const newGoldItems = [...goldItems];
    newGoldItems[index].weight = value;
    setGoldItems(newGoldItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const list = goldItems.map(item => ({
      name: item.goldType,
      weight: parseFloat(item.weight),
      origin: 'Unknown',
      price: goldPrices.find(gold => gold.materialName === item.goldType)?.materialBuyPrice * parseFloat(item.weight) || 0
    }));

    const formData = {
      staffId: userInfo.id,
      customerName: name,
      phone: phone,
      list,
      totalPrice: totalPrice,
      productStore: true
    };

    try {
      const response = await adornicaServ.postPurchaseOrderCode(formData);
      console.log('Order sent successfully:', response.data);
      alert('Order sent successfully');
      navigate('/purchasePage', { state: { formData } }); // Navigate to PurchasePage with state
    } catch (error) {
      console.error('There was an error sending the order:', error);
      alert('Failed to send order. Please check your input data.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        {goldItems.map((item, index) => (
          <React.Fragment key={index}>
            <div style={styles.formGroup} ref={index === goldItems.length - 1 ? newItemRef : null}>
              <label style={styles.label}>Gold type:</label>
              <select style={styles.input} value={item.goldType} onChange={e => handleGoldTypeChange(index, e.target.value)}>
                <option value=""></option>
                {goldPrices.map((gold) => (
                  <option key={gold.materialId} value={gold.materialName}>{gold.materialName}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (gram):</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" style={styles.input} value={item.weight} onChange={e => handleWeightChange(index, e.target.value)} />
                <button type="button" style={styles.deleteButton} onClick={() => handleDeleteItem(index)}>Delete</button>
              </div>
            </div>
          </React.Fragment>
        ))}
        <button type="button" style={styles.addButtonGold} onClick={handleAddItem}>ADD GOLD</button>
        <div style={styles.totalPrice}>
          Total price: {totalPrice} $
        </div>
        <button type="submit" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          PURCHASE
        </button>
      </form>
    </div>
  );
};

export default GoldSelection;