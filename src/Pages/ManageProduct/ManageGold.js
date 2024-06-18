import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';

export default function ManageGold() {
  const [goldManage, setGoldManage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    adornicaServ.getPriceMaterial()
      .then((res) => {
        console.log(res.data.metadata);
        setGoldManage(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (materialId) => {
    const updatedProducts = goldManage.filter(product => product.materialId !== materialId);
    setGoldManage(updatedProducts);
  };

  const handleInputChange = (e, productId) => {
    const { name, value } = e.target;
    setGoldManage(prevState =>
      prevState.map(product =>
        product.materialId === productId ? { ...product, [name]: value } : product
      )
    );
  };

  const handleUpdate = (productId) => {
    const updatedProduct = goldManage.find(product => product.materialId === productId);
    console.log('Updated Product:', updatedProduct);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentGold = goldManage.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(goldManage.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GOLD</h1>
        <NavLink to="/add-gold" style={styles.addButton}>ADD GOLD</NavLink>
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
            <tr key={product.materialId}>
              <td style={styles.td}>{product.materialId}</td>
              <td style={styles.td}>{product.materialName}</td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="materialBuyPrice"
                  value={product.materialBuyPrice}
                  onChange={(e) => handleInputChange(e, product.materialId)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="materialSellPrice"
                  value={product.materialSellPrice}
                  onChange={(e) => handleInputChange(e, product.materialId)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>{formatDate(product.effectDate)}</td>
              <td style={styles.td}>
                <button
                  style={styles.updateButton}
                  onClick={() => handleUpdate(product.materialId)}
                >
                  Update
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(product.materialId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>
        <NavLink to="/inventory" style={styles.backButton}>BACK</NavLink>
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} style={styles.pageButton} onClick={() => changePage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
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
  input: {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px'
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
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  backButtonHover: {
    backgroundColor: '#e0e0e0'
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
