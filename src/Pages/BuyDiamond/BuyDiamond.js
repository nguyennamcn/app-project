import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxHeight: '70vh', // Adjust this value as needed
    overflowY: 'auto', // Add this line to enable vertical scrolling
    background: '#7FDBF8',
    padding: '20px 20px',
    maxWidth: '900px',
    margin: 'auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '5px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '20px',
  },
  button: {
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
  addButton: {
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
    marginTop: '2px',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    position: 'absolute',
    top: '5px',
    right: '5px',
  },
  buttonHover: {
    backgroundColor: '#000000',
  },
  totalPrice: {
    fontSize: '15px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
  productTitle: {
    gridColumn: 'span 2',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#333',
    position: 'relative',
  },
};

const DiamondSelection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [diamondItems, setDiamondItems] = useState([{ color: '', cut: '', clarity: '', carat: '', origin: '', gemBuyPrice: '0.00' }]);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    const calculateTotalPrice = () => {
      const calculatedTotalPrice = diamondItems.reduce((acc, item) => {
        const price = parseFloat(item.gemBuyPrice) || 0;
        return acc + price;
      }, 0);
      setTotalPrice(calculatedTotalPrice.toFixed(2));
    };

    calculateTotalPrice();
  }, [diamondItems]);

  const handleAddItem = () => {
    setDiamondItems([...diamondItems, { color: '', cut: '', clarity: '', carat: '', origin: '', gemBuyPrice: '0.00' }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = diamondItems.filter((_, i) => i !== index);
    setDiamondItems(updatedItems);
  };

  const fetchPrice = async (index) => {
    const item = diamondItems[index];
    const { color, cut, clarity, carat, origin } = item;

    if (cut && carat && clarity && color && origin) {
      const caratValue = parseFloat(carat);
      if (isNaN(caratValue)) {
        console.warn('Invalid carat value');
        return;
      }

      try {
        const res = await adornicaServ.getPurchaseDiamondPrice(cut, caratValue, clarity, color, origin);
        if (res.data && res.data.metadata) {
          const priceData = res.data.metadata.find((data) => (
            data.cut === cut &&
            data.carat === caratValue &&
            data.clarity === clarity &&
            data.color === color &&
            data.origin === origin
          ));

          if (priceData) {
            const updatedItems = [...diamondItems];
            updatedItems[index].gemBuyPrice = priceData.gemBuyPrice.toFixed(2);
            setDiamondItems(updatedItems);
          }
        } else {
          console.warn('Invalid response structure', res.data);
        }
      } catch (err) {
        console.error('Error fetching price:', err);
      }
    }
  };

  const handleDiamondItemChange = (index, field, value) => {
    const newDiamondItems = [...diamondItems];
    newDiamondItems[index][field] = value;
    setDiamondItems(newDiamondItems);
    fetchPrice(index);
  };

  const handleSubmit = () => {
    const diamondData = diamondItems.map(item => ({
      cut: item.cut,
      carat: item.carat,
      clarity: item.clarity,
      color: item.color,
      origin: item.origin,
      gemBuyPrice: 1 * item.gemBuyPrice,
    }));

    localStorage.setItem('gemData', JSON.stringify(diamondData));
    navigate('/bill-diamond');
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        {diamondItems.map((item, index) => (
          <React.Fragment key={index}>
            <div style={styles.productTitle}>
              Diamond {index + 1}
              <button type="button" style={styles.deleteButton} onClick={() => handleDeleteItem(index)}>Delete</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color:</label>
              <select style={styles.input} value={item.color} onChange={(e) => handleDiamondItemChange(index, 'color', e.target.value)}>
                <option value=""></option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cut:</label>
              <select style={styles.input} value={item.cut} onChange={(e) => handleDiamondItemChange(index, 'cut', e.target.value)}>
                <option value=""></option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Clarity:</label>
              <select style={styles.input} value={item.clarity} onChange={(e) => handleDiamondItemChange(index, 'clarity', e.target.value)}>
                <option value=""></option>
                <option value="FL">FL</option>
                <option value="IF">IF</option>
                <option value="VVS1">VVS1</option>
                <option value="VVS2">VVS2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
                <option value="SI1">SI1</option>
                <option value="SI2">SI2</option>
                <option value="I1">I1</option>
                <option value="I2">I2</option>
                <option value="I3">I3</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Carat Weight:</label>
              <input type="number" style={styles.input} value={item.carat} onChange={(e) => handleDiamondItemChange(index, 'carat', e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Origin:</label>
              <select style={styles.input} value={item.origin} onChange={(e) => handleDiamondItemChange(index, 'origin', e.target.value)}>
                <option value=""></option>
                <option value="NATURAL">NATURAL</option>
              </select>
            </div>
          </React.Fragment>
        ))}
        <button
          type="button"
          style={styles.addButton}
          onClick={handleAddItem}
        >
          ADD DIAMOND
        </button>
        <div style={styles.totalPrice}>Total price: {totalPrice} $</div>
        <NavLink to="/bill-diamond" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={handleSubmit}
        >
          PURCHASE
        </NavLink>
      </div>
    </div>
  );
};

export default DiamondSelection;
