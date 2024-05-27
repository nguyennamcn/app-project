import React, { useState } from 'react';

const GoldForm = () => {
  const [goldType, setGoldType] = useState('Vàng miếng SJC 999.9');
  const [weight, setWeight] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  const handleWeightChange = (event) => {
    const inputWeight = event.target.value;
    setWeight(inputWeight);
    updateTotalPrice(goldType, inputWeight);
  };

  const updateTotalPrice = (type, weight) => {
    const pricePerGram = 2372000; // Dummy price per gram
    setTotalPrice(pricePerGram * weight);
  };

  const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        margin: 'auto',
        backgroundColor: '#F7F0B6',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '80%',
        maxWidth: '800px',
        marginTop: '20px',
    },
    header: {
      color: '#333',
      fontSize: '50px',
      marginBottom: '40px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '500px',
    },
    label: {
      marginBottom: '10px',
      width: '100%',
      fontSize: '20px',
    },
    select: {
      padding: '8px',
      marginTop: '5px',
      width: '100%',
      fontSize: '20px',
      backgroundColor: '#F2F3F9',
    },
    input: {
      padding: '8px',
      marginTop: '10px',
      width: '100%',
      fontSize: '20px',
      backgroundColor: '#F2F3F9',
    },
    button: {
      marginTop: '20px',
      backgroundColor: 'black',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius: '20px',
      width: '200px',
      fontSize: '20px',
      alignSelf: 'center',
    },
    totalPrice: {
      textAlign: 'center',
      fontSize: '18px',
      margin: '20px 0',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select Gold Type</h1>
      <form style={styles.form}>
        <label style={styles.label}>
          Gold type:
          <select
            style={styles.select}
            value={goldType}
            onChange={e => setGoldType(e.target.value)}
          >
            <option value="Vàng miếng SJC 999.9">Vàng miếng SJC 999.9</option>
            <option value="Vàng miếng SJC 998.9">Vàng miếng SJC 998.9</option>
            <option value="Vàng miếng SJC 997.9">Vàng miếng SJC 997.9</option>
            <option value="Vàng miếng SJC 996.9">Vàng miếng SJC 996.9</option>
            <option value="Vàng miếng SJC 995.9">Vàng miếng SJC 995.9</option>
          </select>
        </label>
        <label style={styles.label}>
          Weight (gram):
          <input
            style={styles.input}
            type="number"
            value={weight}
            onChange={handleWeightChange}
          />
        </label>
        <div style={styles.totalPrice}>
          Total price: {totalPrice.toLocaleString('en-US')}
        </div>
        <button
          style={styles.button}
          type="button"
          onClick={() => alert('Added to cart')}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default GoldForm;
