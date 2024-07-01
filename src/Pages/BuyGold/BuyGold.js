import React, { useState, useEffect, useRef } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const styles = {
  container: {
    maxHeight: '70vh',
    overflowY: 'auto',
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
    gap: '20px'
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
    width: '100%'
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
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center',
    gridColumn: 'span 2',
    justifySelf: 'center',
    marginTop: '20px'
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
    fontSize: '16px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    margin: '2px 0'
  },
  subPrice: {
    width:'100%',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
};

const GoldSelection = () => {
  const [goldItems, setGoldItems] = useState([{ goldType: '', weight: '' }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);
  const [buyBackPromotion, setBuyBackPromotion] = useState(0);
  const [formValid, setFormValid] = useState(false);
  const newItemRef = useRef(null);

  const navigate = useNavigate();

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
    adornicaServ.getAllCategoryBbp()
      .then((res) => {
        const goldCategory = res.data.metadata.find(category => category.id === 5);
        if (goldCategory) {
          setBuyBackPromotion(goldCategory.buyBackPromotion);
        }
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
        const buyPrice = selectedGold.materialBuyPrice * parseFloat(item.weight || 0);
        const sellPrice = selectedGold.materialSellPrice * parseFloat(item.weight || 0);
        const itemTotal = buyPrice + (sellPrice - buyPrice) * buyBackPromotion;
        calculatedTotalPrice += itemTotal;
      }
    });
    setTotalPrice(calculatedTotalPrice.toFixed(0));
    validateForm();
  }, [goldItems, goldPrices, buyBackPromotion]);

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
    validateForm();
  };

  const handleGoldTypeChange = (index, value) => {
    const newGoldItems = [...goldItems];
    const selectedGold = goldPrices.find(gold => gold.materialName === value);
    if (selectedGold) {
      newGoldItems[index] = {
        ...newGoldItems[index],
        goldType: value,
        materialBuyPrice: selectedGold.materialBuyPrice,
        materialSellPrice: selectedGold.materialSellPrice
      };
    } else {
      newGoldItems[index] = {
        ...newGoldItems[index],
        goldType: value,
        materialBuyPrice: null,
        materialSellPrice: null
      };
    }
    setGoldItems(newGoldItems);
    validateForm();
  };

  const handleWeightChange = (index, value) => {
    if(value <= 0){
      return;
    }
    const newGoldItems = [...goldItems];
    newGoldItems[index].weight = value;
    setGoldItems(newGoldItems);
    validateForm();
  };

  const validateForm = () => {
    const isFormValid = goldItems.every(item => item.goldType && item.weight);
    setFormValid(isFormValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValid) {
      alert('Please fill out all required fields.');
      return;
    }

    const goldData = goldItems.map(item => {
      const total = (item.materialBuyPrice + (item.materialSellPrice - item.materialBuyPrice) * buyBackPromotion) * item.weight;
      return {
        goldType: item.goldType,
        weight: item.weight,
        materialBuyPrice: total,
      };
    });

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
                <input type="number" style={styles.input} value={item.weight} onChange={e => handleWeightChange(index, e.target.value)} min={0}/>
                <button type="button" style={styles.deleteButton} onClick={() => handleDeleteItem(index)}>Delete</button>
              </div>
            </div>
            {item.goldType && (
              <>
                <div style={styles.totalPrice}>{item.goldType}: Buy price {item.materialBuyPrice} VND - Sell price {item.materialSellPrice} VND</div>
                
                <div style={styles.totalPrice}>Gold promotion: {buyBackPromotion}</div>

                <div style={styles.totalPrice}>
                  Material total: {((item.materialBuyPrice + (item.materialSellPrice - item.materialBuyPrice) * buyBackPromotion) * item.weight).toFixed(0)} VND
                </div>
              </>
            )}
          </React.Fragment>
        ))}
        <button type="button" style={styles.addButtonGold} onClick={handleAddItem}>ADD GOLD</button>
        
        <div style={styles.totalPrice}>
          Total price: {totalPrice > 0 ? totalPrice : 0.00} VND
        </div>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...((!formValid || totalPrice <= 0) ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {})
          }}
          disabled={!formValid || totalPrice <= 0}
        >
          PURCHASE
        </button>
      </form>
    </div>
  );
};

export default GoldSelection;
