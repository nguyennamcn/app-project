import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

export default function GoldPrice() {
const [goldPrices, setGoldPrices] = useState([]);

useEffect(() => {
  adornicaServ. getPriceMaterial()
    .then((res) => {
      console.log(res.data.metadata);
      setGoldPrices(res.data.metadata);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  const currentDate = new Date().toLocaleDateString();

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>GOLD PRICE - {currentDate}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Purchase</th>
            <th style={styles.th}>Sell</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((price, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{price.materialName}</td>
              <td style={styles.td}>{price.materialBuyPrice}</td>
              <td style={styles.td}>{price.materialSellPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontSize: '16px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
};
