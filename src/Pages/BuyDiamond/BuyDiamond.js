import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

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
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
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
  },
  buttonHover: {
    backgroundColor: '#000000',
  },
  totalPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    margin: '20px 0',
  },
};

const DiamondSelection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [color, setColor] = useState('');
  const [cut, setCut] = useState('');
  const [clarity, setClarity] = useState('');
  const [origin, setOrigin] = useState('');
  const [carat, setCaratWeight] = useState('');
  const [totalPrice, setTotalPrice] = useState('0.00');
  const userInfo = useSelector((state) => state.userReducer.userInfo);

  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        if (cut && carat && clarity && color && origin) {
          const caratValue = parseFloat(carat);
          if (isNaN(caratValue)) {
            console.warn('Invalid carat value');
            setTotalPrice('Invalid carat value');
            return;
          }

          const res = await adornicaServ.getPurchaseDiamondPrice(cut, caratValue, clarity, color, origin);
          console.log('API response:', res.data); // Debug log

          if (res.data && res.data.metadata) {
            const priceData = res.data.metadata.find((data) => (
              data.cut === cut &&
              data.carat === caratValue &&
              data.clarity === clarity &&
              data.color === color &&
              data.origin === origin
            ));

            console.log('Matching price data:', priceData); // Debug log

            if (priceData) {
              setTotalPrice(priceData.gemBuyPrice.toFixed(2).toString());
              console.log('Total price set to:', priceData.gemBuyPrice.toString()); // Debug log
            } else {
              console.warn('No matching price data found');
              setTotalPrice('0.00');
            }
          } else {
            console.warn('Invalid response structure', res.data);
            setTotalPrice('Invalid response structure');
          }
        }
      } catch (err) {
        console.error('Error fetching price:', err);
        setTotalPrice('Error fetching price');
      }
    };

    fetchPrice();
  }, [cut, carat, clarity, color, origin]);
  const handleSubmit = () => {
    if (!name || !phone || !color || !cut || !clarity || !origin ) {
      alert('Please fill in all the fields.');
      return;
    }

    const diamondData = {
      color: color,
      cut: cut,
      clarity: clarity,
      origin: origin,
      
    };
    const purchaseData = {
      staffId: userInfo.id,
      customer: name,
      phone: phone,
      diamondData,
      totalPrice: totalPrice,
    };

    console.log('Submitting purchase data:', purchaseData);

    adornicaServ
      .postPurchaseOrderCode(purchaseData)
      .then((res) => {
        console.log('Order submitted successfully:', res.data);
        alert('Order submitted successfully');
      })
      .catch((err) => {
        console.error('Error submitting order:', err.response);
        alert(`Error submitting order: ${err.response?.data?.message || 'Unknown error'}`);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input type="text" style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Color:</label>
          <select style={styles.input} value={color} onChange={(e) => setColor(e.target.value)}>
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
          <select style={styles.input} value={cut} onChange={(e) => setCut(e.target.value)}>
            <option value=""></option>
            <option value="EX">EX</option>
            <option value="G">G</option>
            <option value="F">F</option>
            <option value="P">P</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Clarity:</label>
          <select style={styles.input} value={clarity} onChange={(e) => setClarity(e.target.value)}>
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
          <input
            type="number"
            style={styles.input}
            value={carat}
            onChange={(e) => setCaratWeight(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Origin:</label>
          <select style={styles.input} value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option value=""></option>
            <option value="NATURAL">NATURAL</option>
          </select>
        </div>
        <div style={styles.totalPrice}>Total price: {totalPrice} $</div>
        <button
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          PURCHASE
        </button>
      </div>
    </div>
  );
};

export default DiamondSelection;
