import React, { useState, useEffect, useRef, useContext } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext'; // Cập nhật đường dẫn đúng
import { NavLink } from 'react-router-dom';

// Define styles as objects
const styles = {
  container: {
    background: '#F7F0B6',
    padding: '30px',
    maxWidth: '900px',
    margin: '10px auto',
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
    textDecoration: 'none',
  },
  buttonHover: {
    backgroundColor: '#000000'
  },
  addButtonGold: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
    gridColumn: 'span 2',
    justifySelf: 'center',
    marginTop: '2px'
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
  const navigate = useNavigate();
  const { addProduct } = useContext(ProductContext);

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
    if (goldItems.length >= 2) {
      navigate('/addMoreGold'); 
    } else {
      setGoldItems([...goldItems, { goldType: '', weight: '' }]);
      setTimeout(() => {
        if (newItemRef.current) {
          newItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); 
    }
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
    goldItems.forEach(item => addProduct(item));
    navigate('/addMoreGold');
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
              <input type="number" style={styles.input} value={item.weight} onChange={e => handleWeightChange(index, e.target.value)} />
            </div>
          </React.Fragment>
        ))}
        <button type="button" style={styles.addButtonGold} onClick={handleAddItem}>ADD GOLD</button>
        <div style={styles.totalPrice}>
          Total price: {totalPrice} $
        </div>
        {/* <button type="submit" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          NEXT 
        </button> */}
        <NavLink to="/billbuyng" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          PURCHASE
        </NavLink>
      </form>
    </div>
  );
};

export default GoldSelection;
