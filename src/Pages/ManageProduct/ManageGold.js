import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

export default function ManageGold() {
const [goldManage, setGoldManage] = useState([]);

useEffect(() => {
  adornicaServ. getPriceMaterial()
    .then((res) => {
      console.log(res.data.metadata);
      setGoldManage(res.data.metadata);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 
  const handleDelete = (productId) => {
    const updatedProducts = goldManage.filter(product => product.materialId !== productId);
    setGoldManage(updatedProducts);
  };
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentGold = goldManage.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(goldManage.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GOLD</h1>
        <button style={styles.addButton}>+ ADD PRODUCT</button>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Buy Price</th>
            <th style={styles.th}>Sell Price</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentGold.map((product) => (
            <tr key={product.id}>
              <td style={styles.td}>{product.materialId}</td>
              <td style={styles.td}>{product.materialName}</td>
              <td style={styles.td}>{product.materialBuyPrice}</td>
              <td style={styles.td}>${product.materialSellPrice}</td>
              <td style={styles.td}>{product.effectDate}</td>
              <td style={styles.td}>
                <button style={styles.updateButton}>Update</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(product.materialId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} style={styles.pageButton} onClick={() => changePage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingRight: '20px'
  },
  title: {
    margin: 0,
    fontSize: '25px'
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  },
  updateButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end', 
    padding: '10px 20px'
  },
  pageButton: {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#000000', 
    color: 'white', 
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};


