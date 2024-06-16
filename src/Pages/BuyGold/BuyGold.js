import React, { useState, useEffect, useRef } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  const [goldItems, setGoldItems] = useState([{ goldType: '', weight: '' }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);
  const [formValid, setFormValid] = useState(false); // Track form validation state
  const newItemRef = useRef(null);

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
    validateForm(); // Validate form whenever goldItems or goldPrices change
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
    validateForm(); // Validate form whenever an item is deleted
  };

  const handleGoldTypeChange = (index, value) => {
    const newGoldItems = [...goldItems];
    const selectedGold = goldPrices.find(gold => gold.materialName === value);
    if (selectedGold) {
      newGoldItems[index] = {
        ...newGoldItems[index],
        goldType: value,
        materialBuyPrice: selectedGold.materialBuyPrice // Add materialBuyPrice here
      };
    } else {
      newGoldItems[index] = {
        ...newGoldItems[index],
        goldType: value,
        materialBuyPrice: null
      };
    }
    setGoldItems(newGoldItems);
    validateForm(); // Validate form whenever a gold type is changed
  };

  const handleWeightChange = (index, value) => {
    const newGoldItems = [...goldItems];
    newGoldItems[index].weight = value;
    setGoldItems(newGoldItems);
    validateForm(); // Validate form whenever a weight is changed
  };

  const validateForm = () => {
    const isFormValid = goldItems.every(item => item.goldType && item.weight);
    setFormValid(isFormValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!formValid) {
      alert('Please fill out all required fields.');
      return;
    }

    // Extract gold type, weight, and materialBuyPrice from goldItems array
    const goldData = goldItems.map(item => ({
      goldType: item.goldType,
      weight: item.weight,
      materialBuyPrice: item.weight * item.materialBuyPrice // Include materialBuyPrice here
    }));

    // Save gold data to local storage
    localStorage.setItem('goldData', JSON.stringify(goldData));

    navigate('/bill-gold');
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
        <button
          type="submit"
          style={{ ...styles.button, ...(formValid ? {} : { backgroundColor: 'gray', cursor: 'not-allowed' }) }}
          disabled={!formValid}
        >
          PURCHASE
        </button>
      </form>
    </div>
  );
};

export default GoldSelection;
