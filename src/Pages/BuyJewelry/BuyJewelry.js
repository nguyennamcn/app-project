import React, { useState, useEffect, useRef } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

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
    fontSize: '16px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    margin: '2px 0'
  },
  jewelryLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    marginTop: '2px',
    position: 'relative'
  },
  subPrice: {
    width:'100%',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
};

const JewelrySelection = () => {
  const [jewelryItems, setJewelryItems] = useState([{
    name:'',
    goldType: '',
    weight: '',
    origin:'',
    carat: '',
    color: '',
    clarity: '',
    cut: ''
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [goldPromotion, setGoldPromotion] = useState(0);
  const [gemPromotion, setGemPromotion] = useState(0);
  const [goldPrices, setGoldPrices] = useState([]);
  const [gemPrices, setGemPrices] = useState([]);
  const [formValid, setFormValid] = useState(false); // Track form validation state
  const newItemRef = useRef(null);
  const navigate = useNavigate();
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
    adornicaServ.getPriceDiamond()
      .then((res) => {
        setGemPrices(res.data.metadata);
        console.log(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    adornicaServ.getAllCategoryBbp()
      .then((res) => {
        const diamondCategory = res.data.metadata.find(category => category.id === 6);
        if (diamondCategory) {
          setGemPromotion(diamondCategory.buyBackPromotion);
        }
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
          setGoldPromotion(goldCategory.buyBackPromotion);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const handleInputChange = async (index, field, value) => {
    const updatedItems = jewelryItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setJewelryItems(updatedItems);
    validateForm(updatedItems);
  
    // Handle goldType change
    if (field === 'goldType') {
      if (value === 'None') {
        // Clear and disable related fields
        updatedItems[index] = {
          ...updatedItems[index],
          weight: '',
        };
      } else {
        // Fetch and update gold price for the selected item
        const selectedGold = goldPrices.find(gold => gold.materialName === value);
        if (selectedGold) {
          updatedItems[index] = {
            ...updatedItems[index],
            materialBuyPrice: selectedGold.materialBuyPrice,
            materialSellPrice: selectedGold.materialSellPrice,
          };
        }
      }
    }
  
    // Handle diamond change
    if (field === 'origin' || field === 'cut' || field === 'carat' || field === 'clarity' || field === 'color') {
      if (value === 'None') {
        // Clear and disable related fields
        updatedItems[index] = {
          ...updatedItems[index],
          origin:'None',
          carat: 0,
          color: 'None',
          clarity: 'None',
          cut: 'None',
          gemBuyPrice: 0,
          gemSellPrice:0,
        };
      } else {
        const selectedGem = gemPrices.find(gem => 
          gem.origin === updatedItems[index].origin &&
          gem.color === updatedItems[index].color &&
          gem.clarity === updatedItems[index].clarity &&
          gem.cut === updatedItems[index].cut &&
          gem.carat === parseFloat(updatedItems[index].carat)
        );
        console.log(selectedGem);
        if (selectedGem) {
          updatedItems[index] = {
            ...updatedItems[index],
            gemBuyPrice: selectedGem.gemBuyPrice,
            gemSellPrice: selectedGem.gemSellPrice,
          };
        }
      }
    }
  
    setJewelryItems(updatedItems);
    validateForm(updatedItems);
  };  
  console.log(jewelryItems);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      let total = 0;
      let hasValidPrice = true;

      for (const item of jewelryItems) {
        const selectedGold = goldPrices.find(gold => gold.materialName === item.goldType);
        if (selectedGold) {
          const goldPrice = (selectedGold.materialBuyPrice + (selectedGold.materialSellPrice - selectedGold.materialBuyPrice) * goldPromotion )* parseFloat(item.weight || 0);
          if (goldPrice <= 0 && item.goldType !== 'None'){
            hasValidPrice = false;
            total += 0;
          } else {
            total += goldPrice;
          }
          
        }

        if (item.origin && item.carat && item.clarity && item.color && item.cut) {
          const caratValue = parseFloat(item.carat);
          if (!isNaN(caratValue)) {
            const res = await adornicaServ.getPurchaseDiamondPrice(item.cut, caratValue, item.clarity, item.color, item.origin);
            if (res.data && res.data.metadata) {
              const priceData = res.data.metadata.find((data) => (
                data.cut === item.cut &&
                data.carat === caratValue &&
                data.clarity === item.clarity &&
                data.color === item.color &&
                data.origin === item.origin
              ));
              if (priceData) {
                const diamondPrice = priceData.gemBuyPrice;
                if (diamondPrice === 0) hasValidPrice = false;
                total += diamondPrice;
              } else {
                notification.error({ message: "Gem was undefined" });
                hasValidPrice = false;
              }
            }
          }
        }
      }

      setTotalPrice(total); // Set total as a number
      setFormValid(hasValidPrice); // Set form valid based on price validity
    };

    calculateTotalPrice();
  }, [jewelryItems, goldPrices]);

  const handleAddItem = () => {
    setJewelryItems([...jewelryItems, {
      name: '',
      goldType: '',
      weight: '',
      carat: '',
      color: '',
      origin,
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
    validateForm(updatedItems);
  };

  const validateForm = (updatedItems) => {
    const isFormValid = updatedItems.every(item =>
      ((item.goldType && item.goldType !== 'None' && item.weight) ||
      (item.origin && item.origin !== 'None' && item.carat && item.color && item.clarity && item.cut)) &&
      !(item.goldType === 'None' && item.origin === 'None') // Check if both are "None"
    );
    setFormValid(isFormValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formValid || totalPrice === 0) {
      alert('Please fill out all required fields and ensure total price is greater than 0.');
      return;
    }
  
    const jewelryData = jewelryItems.map(item => {
      const totalMaterial = ((item.materialBuyPrice + (item.materialSellPrice - item.materialBuyPrice) * goldPromotion) * item.weight) || 0;
      const totalGem = ((parseFloat(item.gemBuyPrice) + (parseFloat(item.gemSellPrice) - parseFloat(item.gemBuyPrice)) * parseFloat(gemPromotion))) || 0;
  
      return {
        name: item.name,
        goldType: item.goldType,
        weight: item.weight,
        cut: item.cut,
        carat: item.carat,
        clarity: item.clarity,
        color: item.color,
        origin: item.origin,
        totalMaterial: totalMaterial,
        totalGem: totalGem,
        total: totalMaterial + totalGem,
      };
    });
  
    localStorage.setItem('jewelryData', JSON.stringify(jewelryData));
    navigate('/bill-jewelry');
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
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                style={styles.input}
                value={item.name}
                onChange={e => handleInputChange(index, 'name', e.target.value)}
                //disabled={item.goldType === 'None'}
                required
              />
            </div>
            <div></div>
            <div style={styles.formGroup} ref={index === jewelryItems.length - 1 ? newItemRef : null}>
              <label style={styles.label}>Gold type:</label>
              <select style={styles.input} value={item.goldType} onChange={e => handleInputChange(index, 'goldType', e.target.value)} required>
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
                required={item.goldType !== 'None'}
                
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Origin:</label>
              <select style={styles.input} value={item.origin} onChange={e => handleInputChange(index, 'origin', e.target.value)} required>
                <option value=""></option>
                <option value="None">None</option>
                <option value="NATURAL">NATURAL</option>
                <option value="LAB_GROWN">LAB_GROWN</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Carat Weight:</label>
              <input
                type="number"
                style={styles.input}
                value={item.carat}
                onChange={e => handleInputChange(index, 'carat', e.target.value)}
                disabled={item.origin === 'None'}
                required={item.origin !== 'None'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color:</label>
              <select
                style={styles.input}
                value={item.color}
                onChange={e => handleInputChange(index, 'color', e.target.value)}
                disabled={item.origin === 'None'}
                required={item.origin !== 'None'}
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
                disabled={item.origin === 'None'}
                required={item.origin !== 'None'}
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
                disabled={item.origin === 'None'}
                required={item.origin !== 'None'}
              >
                <option value=""></option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
              </select>
            </div>

            {item.goldType && item.weight && item.weight >0 && (
              <>
                <div style={styles.totalPrice}>
                    {item.goldType}: Buy price {item.materialBuyPrice.toLocaleString('vi-VN')} VND - Sell price {item.materialSellPrice.toLocaleString('vi-VN')} VND
                </div>

                
                <div style={styles.totalPrice}>Gold promotion: {goldPromotion}</div>

                <div style={styles.totalPrice}>
                    Material total: {((item.materialBuyPrice + (item.materialSellPrice - item.materialBuyPrice) * goldPromotion) * item.weight).toLocaleString('vi-VN')} VND
                </div>

              </>
            )}

            { item.clarity && item.color && item.cut && item.origin && (item.origin ==="NATURAL"|| item.origin ==="LAB_GROWN")  && formValid &&(
              <>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  gridColumn: 'span 2',
                  textAlign: 'center',
                  marginTop: '30px',
                }}>
                  Diamond: Buy price {parseFloat(item.gemBuyPrice).toLocaleString('vi-VN')} VND - Sell price {parseFloat(item.gemSellPrice).toLocaleString('vi-VN')} VND
                </div>

               
               <div style={styles.totalPrice}>Diamond promotion: {gemPromotion}</div>

               <div style={styles.totalPrice}>
                   Diamond total: {((parseFloat(item.gemBuyPrice) + (parseFloat(item.gemSellPrice) - parseFloat(item.gemBuyPrice)) * parseFloat(gemPromotion)).toLocaleString('vi-Vn'))} VND
                </div>

              </>
            )}        
            
          </React.Fragment>
        ))}
        <button type="button" style={styles.addButtonJewelry} onClick={handleAddItem}>Add Jewelry</button>
        <div style={styles.totalPrice}>
          Total price: {totalPrice.toLocaleString('vi-Vn')} VND
        </div>
        <button
          type="submit"
          style={{ ...styles.button, ...(formValid && totalPrice > 0 ? {} : { backgroundColor: 'gray', cursor: 'not-allowed' }) }}
          disabled={!formValid || totalPrice === 0}
        >
          PURCHASE
        </button>
      </form>
    </div>
  );
};

export default JewelrySelection;
