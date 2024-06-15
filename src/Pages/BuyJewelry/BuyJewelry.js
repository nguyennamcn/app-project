import React, { useState, useEffect, useRef } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

// Define styles as objects
const styles = {
  container: {
    maxHeight: '70vh', // Adjust this value as needed
    overflowY: 'auto', // Add this line to enable vertical scrolling
    background: '#AFBEF9',
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
    gap: '4px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '0px',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '17px'
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
    textDecoration: 'none',
  },
  buttonHover: {
    backgroundColor: '#000000'
  },
  addButtonJewelry: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    gridColumn: 'span 2',
    justifySelf: 'center',
    marginTop: '10px'
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '10px',
    textAlign: 'center',
    position: 'absolute',
    top: '5px',
    right: '5px'
  },
  totalPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    margin: '0px 0'
  },
  jewelryLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    marginTop: '2px',
    position: 'relative'
  }
};

const JewelrySelection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jewelryItems, setJewelryItems] = useState([{
    goldType: '',
    weight: '',
    diamond: '',
    carat: '',
    color: '',
    clarity: '',
    cut: ''
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);
  const newItemRef = useRef(null);

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
    const calculateTotalPrice = async () => {
      let total = 0;
      for (const item of jewelryItems) {
        const selectedGold = goldPrices.find(gold => gold.materialName === item.goldType);
        if (selectedGold) {
          total += selectedGold.materialBuyPrice * parseFloat(item.weight || 0);
        }

        if (item.diamond && item.carat && item.clarity && item.color && item.cut) {
          const caratValue = parseFloat(item.carat);
          if (!isNaN(caratValue)) {
            const res = await adornicaServ.getPurchaseDiamondPrice(item.cut, caratValue, item.clarity, item.color, item.diamond);
            if (res.data && res.data.metadata) {
              const priceData = res.data.metadata.find((data) => (
                data.cut === item.cut &&
                data.carat === caratValue &&
                data.clarity === item.clarity &&
                data.color === item.color &&
                data.origin === item.diamond
              ));
              if (priceData) {
                total += priceData.gemBuyPrice;
              }
            }
          }
        }
      }
      setTotalPrice(total.toFixed(2));
    };

    calculateTotalPrice();
  }, [jewelryItems, goldPrices]);

  const handleAddItem = () => {
    setJewelryItems([...jewelryItems, {
      goldType: '',
      weight: '',
      diamond: '',
      carat: '',
      color: '',
      clarity: '',
      cut: ''
    }]);
    setTimeout(() => {
      if (newItemRef.current) {
        newItemRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure the new element is rendered
  };

  const handleDeleteItem = (index) => {
    const updatedItems = jewelryItems.filter((_, i) => i !== index);
    setJewelryItems(updatedItems);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = jewelryItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setJewelryItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const list = jewelryItems.map(item => ({
      name: 'Jewelry',
      weight: parseFloat(item.weight),
      color: item.color,
      clarity: item.clarity,
      origin: item.diamond,
      cut: item.cut,
      carat: item.carat,
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
    } catch (error) {
      console.error('There was an error sending the order:', error);
      alert('Failed to send order. Please check your input data.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        {jewelryItems.map((item, index) => (
          <React.Fragment key={index}>
            <div style={styles.jewelryLabel}>
              Jewelry {index + 1}
              <button type="button" style={styles.deleteButton} onClick={() => handleDeleteItem(index)}>Delete</button>
            </div>
            <div style={styles.formGroup} ref={index === jewelryItems.length - 1 ? newItemRef : null}>
              <label style={styles.label}>Gold type:</label>
              <select style={styles.input} value={item.goldType} onChange={e => handleInputChange(index, 'goldType', e.target.value)}>
                <option value=""></option>
                <option value="None">None</option>
                {goldPrices.map((gold) => (
                  <option key={gold.materialId} value={gold.materialName}>{gold.materialName}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (gram):</label>
              <input 
                type="number" 
                style={styles.input} 
                value={item.weight} 
                onChange={e => handleInputChange(index, 'weight', e.target.value)} 
                disabled={item.goldType === 'None'} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Diamond:</label>
              <select style={styles.input} value={item.diamond} onChange={e => handleInputChange(index, 'diamond', e.target.value)}>
                <option value=""></option>
                <option value="None">None</option>
                <option value="NATURAL">Natural</option>
                <option value="Synthetic">Synthetic</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Carat Weight:</label>
              <input
                type="number"
                style={styles.input}
                value={item.carat}
                onChange={e => handleInputChange(index, 'carat', e.target.value)}
                disabled={item.diamond === 'None'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color:</label>
              <select
                style={styles.input}
                value={item.color}
                onChange={e => handleInputChange(index, 'color', e.target.value)}
                disabled={item.diamond === 'None'}
              >
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
              <label style={styles.label}>Clarity:</label>
              <select
                style={styles.input}
                value={item.clarity}
                onChange={e => handleInputChange(index, 'clarity', e.target.value)}
                disabled={item.diamond === 'None'}
              >
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
              <label style={styles.label}>Cut:</label>
              <select
                style={styles.input}
                value={item.cut}
                onChange={e => handleInputChange(index, 'cut', e.target.value)}
                disabled={item.diamond === 'None'}
              >
                <option value=""></option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
              </select>
            </div>
          </React.Fragment>
        ))}
        <button type="button" style={styles.addButtonJewelry} onClick={handleAddItem}>Add Jewelry</button>
        <div style={styles.totalPrice}>
          Total price: {totalPrice} $
        </div>
        <NavLink to="/billbuyng" style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          PURCHASE
        </NavLink>
      </form>
    </div>
  );
};

export default JewelrySelection;
