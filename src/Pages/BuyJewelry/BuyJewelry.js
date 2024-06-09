import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adornicaServ } from '../../service/adornicaServ';

const styles = {
  container: {
    background: '#AFBEF9',
    padding: '15px',
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
    padding: '3px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    padding: '5px 15px',
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

const JewelrySelection = () => {
  const location = useLocation();
  const { customerData } = location.state || {};

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [goldType, setGoldType] = useState('');
  const [diamond, setDiamond] = useState('');
  const [color, setColor] = useState('');
  const [cut, setCut] = useState('');
  const [clarity, setClarity] = useState('');
  const [carat, setCaratWeight] = useState('');
  const [totalGoldPrice, setTotalGoldPrice] = useState('0.00');
  const [totalDiamondPrice, setTotalDiamondPrice] = useState('0.00');
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [goldPrices, setGoldPrices] = useState([]);

  let userInfo = useSelector((state) => state.userReducer.userInfo);

  useEffect(() => {
    if (customerData) {
      setName(customerData.customerName);
      setPhone(customerData.phone);
      console.log(customerData);
    }
  }, [customerData]);

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
      setTotalGoldPrice(calculatedPrice.toFixed(2));
    }
  }, [goldType, weight, goldPrices]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        if (cut && carat && clarity && color && diamond) {
          const caratValue = parseFloat(carat);
          if (isNaN(caratValue)) {
            console.warn('Invalid carat value');
            setTotalDiamondPrice('0.00');
            return;
          }

          const res = await adornicaServ.getPurchaseDiamondPrice(cut, caratValue, clarity, color, diamond);
          console.log('API response:', res.data); // Debug log

          if (res.data && res.data.metadata) {
            const priceData = res.data.metadata.find((data) => (
              data.cut === cut &&
              data.carat === caratValue &&
              data.clarity === clarity &&
              data.color === color &&
              data.origin === diamond
            ));

            console.log('Matching price data:', priceData); // Debug log

            if (priceData) {
              setTotalDiamondPrice(priceData.gemBuyPrice.toFixed(2).toString());
              console.log('Total price set to:', priceData.gemBuyPrice.toString()); // Debug log
            } else {
              console.warn('No matching price data found');
              setTotalDiamondPrice('0.00');
            }
          } else {
            console.warn('Invalid response structure', res.data);
            setTotalDiamondPrice('0.00');
          }
        }
      } catch (err) {
        console.error('Error fetching price:', err);
        setTotalDiamondPrice('0.00');
      }
    };

    fetchPrice();
  }, [cut, carat, clarity, color, diamond]);

  useEffect(() => {
    setTotalPrice((parseFloat(totalGoldPrice) || 0) + (parseFloat(totalDiamondPrice) || 0));
  }, [totalGoldPrice, totalDiamondPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      staffId: userInfo.id,
      customerName: name,
      phone: phone,
      list: [
        {
          name: 'Jewelry',
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
          <label style={styles.label}>Gold type:</label>
          <select style={styles.input} value={goldType} onChange={e => setGoldType(e.target.value)}>
            <option value=""></option>
            <option value="None">None</option>
            <option value="Gold Bars">Gold Bars</option>
            <option value="24K Gold (990)">24K Gold (990)</option>
            <option value="18K Gold (750)">18K Gold (750)</option>
            <option value="White Gold Au750">White Gold Au750</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Weight (gram):</label>
          <input
            type="number"
            style={styles.input}
            value={weight}
            onChange={e => setWeight(e.target.value)}
            disabled={goldType === 'None'}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Diamond:</label>
          <select style={styles.input} value={diamond} onChange={e => setDiamond(e.target.value)}>
            <option value=""></option>
            <option value="None">None</option>
            <option value="NATURAL">Natural</option>
            <option value="Synthetic">Synthetic</option>
          </select>
        </div>
        <div></div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Carat Weight:</label>
          <input
            type="number"
            style={styles.input}
            value={carat}
            onChange={e => setCaratWeight(e.target.value)}
            disabled={diamond === 'None'}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Color:</label>
          <select
            style={styles.input}
            value={color}
            onChange={e => setColor(e.target.value)}
            disabled={diamond === 'None'}
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
            value={clarity}
            onChange={e => setClarity(e.target.value)}
            disabled={diamond === 'None'}
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
            value={cut}
            onChange={e => setCut(e.target.value)}
            disabled={diamond === 'None'}
          >
            <option value=""></option>
            <option value="EX">EX</option>
            <option value="G">G</option>
            <option value="F">F</option>
            <option value="P">P</option>
          </select>
        </div>
        <div style={styles.totalPrice}>
          Total price: {totalPrice.toLocaleString()} $
        </div>
        <button type="submit" style={styles.button}
          onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
        >PURCHASE</button>
      </form>
    </div>
  );
};

export default JewelrySelection;
