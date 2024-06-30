import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

export default function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState([]);

  useEffect(() => {
    adornicaServ.getPriceDiamond()
      .then((res) => {
        console.log(res.data.metadata);
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const currentDate = new Date().toLocaleDateString('vi-VN');

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>DIAMOND PRICE - {currentDate}</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Origin</th>
              <th style={styles.th}>Color</th>
              <th style={styles.th}>Clarity</th>
              <th style={styles.th}>Cut</th>
              <th style={styles.th}>Carat</th>
              <th style={styles.th}>Purchase</th>
              <th style={styles.th}>Sell</th>
              <th style={styles.th}>Date Update</th>
            </tr>
          </thead>
          <tbody>
            {goldPrices.map((price, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{price.origin}</td>
                <td style={styles.td}>{price.color}</td>
                <td style={styles.td}>{price.clarity}</td>
                <td style={styles.td}>{price.cut}</td>
                <td style={styles.td}>{price.carat}</td>
                <td style={styles.td}>{price.gemBuyPrice}</td>
                <td style={styles.td}>{price.gemSellPrice}</td>
                <td style={styles.td}>{formatDate(price.effectDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxHeight: '70vh',
    overflowY: 'auto',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: '#6993FE',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
  },
  tableContainer: {
    overflowX: 'auto',
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
  '@media (max-width: 768px)': {
    header: {
      fontSize: '20px',
      padding: '8px',
    },
    th: {
      fontSize: '14px',
      padding: '10px',
    },
    td: {
      fontSize: '14px',
      padding: '10px',
    },
  },
  '@media (max-width: 480px)': {
    header: {
      fontSize: '18px',
      padding: '6px',
    },
    th: {
      fontSize: '12px',
      padding: '8px',
    },
    td: {
      fontSize: '12px',
      padding: '8px',
    },
  },
};

