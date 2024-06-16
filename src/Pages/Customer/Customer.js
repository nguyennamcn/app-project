import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState([]);

  useEffect(() => {
    adornicaServ.getCustomerDetails() // Assuming this endpoint returns customer details
      .then((res) => {
        console.log(res.data.metadata);
        setCustomerDetails(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const currentDate = new Date().toLocaleDateString();

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>CUSTOMER INFORMATION - {currentDate}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>CustomerID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Birthday</th>
            <th style={styles.th}>Discount</th>
            <th style={styles.th}>Purchased</th>
          </tr>
        </thead>
        <tbody>
          {customerDetails.map((detail, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{detail.customerId}</td>
              <td style={styles.td}>{detail.name}</td>
              <td style={styles.td}>{detail.phone}</td>
              <td style={styles.td}>{detail.address}</td>
              <td style={styles.td}>{detail.dateOfBirth}</td>
              <td style={styles.td}>{detail.percentDiscount}</td>
              <td style={styles.td}>{detail.totalAmountPurchased}</td>
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
    backgroundColor: '#E46A25',
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
