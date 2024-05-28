import React, { useState } from 'react';

const GemForm = () => {
  const [color, setColor] = useState('D');
  const [clarity, setClarity] = useState('VS2');
  const [caratWeight, setCaratWeight] = useState(0.46);
  const [cut, setCut] = useState('Excellent');
  const [totalPrice, setTotalPrice] = useState('60,163,000'); // This will need to be dynamically calculated based on selections

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      margin: 'auto',
      backgroundColor: '#E0F7FA',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      width: '80%',
      maxWidth: '800px',
      marginTop: '20px',
    },
    header: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    inputRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      width: '100%',
    },
    label: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
      marginRight: '10px',
    },
    input: {
      padding: '8px',
      marginTop: '5px',
      width: '100%',
    },
    button: {
      marginTop: '20px',
      backgroundColor: 'black',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius: '5px',
      alignSelf: 'center',
    },
    totalPrice: {
      textAlign: 'center',
      fontSize: '18px',
      margin: '20px 0',
      fontWeight: 'bold',
    }
  };

  const handleAddToCart = () => {
    alert('Added to cart');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select GEM Type</h1>
      <form style={styles.form}>
        <div style={styles.inputRow}>
          <label style={styles.label}>
            Color:
            <select style={styles.input} value={color} onChange={e => setColor(e.target.value)}>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label style={styles.label}>
            Clarity:
            <select style={styles.input} value={clarity} onChange={e => setClarity(e.target.value)}>
              <option value="IF">IF</option>
              <option value="VVS1">VVS1</option>
              <option value="VVS2">VVS2</option>
              <option value="VS1">VS1</option>
              <option value="VS2">VS2</option>
              {/* Add more options as needed */}
            </select>
          </label>
        </div>
        <div style={styles.inputRow}>
          <label style={styles.label}>
            Carat weight:
            <select style={styles.input} value={caratWeight} onChange={e => setCaratWeight(parseFloat(e.target.value))}>
              <option value={0.46}>0.46 ct</option>
              <option value={1}>1 ct</option>
              <option value={0.62}>0.62 ct</option>
              <option value={0.36}>0.36 ct</option>
              <option value={1.03}>1.03 ct</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label style={styles.label}>
            Cut:
            <select style={styles.input} value={cut} onChange={e => setCut(e.target.value)}>
              <option value="Excellent">Excellent</option>
              {/* Add more options as needed */}
            </select>
          </label>
        </div>
        <div style={styles.totalPrice}>
          Total price: {totalPrice}
          {/* This should be dynamically calculated */}
        </div>
        <button style={styles.button} type="button" onClick={handleAddToCart}>Add</button>
      </form>
    </div>
  );
};

export default GemForm;
