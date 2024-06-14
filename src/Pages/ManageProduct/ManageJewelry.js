import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const initialJewelry = [
  { id: 1, name: "Gold Necklace", type: "Necklace", material: "Gold", carat: 18, buyPrice: 1400, sellPrice: 1500 },
  { id: 2, name: "Diamond Earrings", type: "Earrings", material: "Diamond", carat: 22, buyPrice: 2900, sellPrice: 3000 },
  { id: 3, name: "Silver Bracelet", type: "Bracelet", material: "Silver", carat: 14, buyPrice: 800, sellPrice: 850 },
  { id: 4, name: "Platinum Ring", type: "Ring", material: "Platinum", carat: 24, buyPrice: 4900, sellPrice: 5000 }
];

const JewelryInventoryPage = () => {
  const [jewelry, setJewelry] = useState(initialJewelry);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = (jewelryId) => {
    const updatedJewelry = jewelry.filter(item => item.id !== jewelryId);
    setJewelry(updatedJewelry);
  };

  const handleInputChange = (e, jewelryId) => {
    const { name, value } = e.target;
    setJewelry(prevState =>
      prevState.map(item =>
        item.id === jewelryId ? { ...item, [name]: value } : item
      )
    );
  };

  const handleUpdate = (jewelryId) => {
    const updatedItem = jewelry.find(item => item.id === jewelryId);
    // Cập nhật thông tin sản phẩm trong cơ sở dữ liệu nếu cần
    console.log('Updated Jewelry:', updatedItem);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentJewelry = jewelry.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(jewelry.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>JEWELRY INVENTORY</h1>
        <NavLink to="/addjewelry" style={styles.addButton}>ADD PRODUCT</NavLink>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Material</th>
            <th style={styles.th}>Carat</th>
            <th style={styles.th}>Buy Price</th>
            <th style={styles.th}>Sell Price</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentJewelry.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.id}</td>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.type}</td>
              <td style={styles.td}>{item.material}</td>
              <td style={styles.td}>{item.carat}</td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="buyPrice"
                  value={item.buyPrice}
                  onChange={(e) => handleInputChange(e, item.id)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="sellPrice"
                  value={item.sellPrice}
                  onChange={(e) => handleInputChange(e, item.id)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <button
                  style={styles.updateButton}
                  onClick={() => handleUpdate(item.id)}
                >
                  Update
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(item.id)}
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
    marginBottom: '20px'
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
    cursor: 'pointer'
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
    borderRadius: '3px',
    textDecoration: 'none',
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

export default JewelryInventoryPage;


