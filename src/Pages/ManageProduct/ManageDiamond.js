import React, { useState } from 'react';

const initialDiamonds = [
  { id: 1, name: "Round Brilliant Cut", carat: 1.2, clarity: "VS1", color: "E", cut: "Excellent", price: 12000 },
  { id: 2, name: "Princess Cut", carat: 1.5, clarity: "SI1", color: "G", cut: "Very Good", price: 10000 },
  { id: 3, name: "Cushion Cut", carat: 2.0, clarity: "VVS2", color: "H", cut: "Good", price: 18000 },
  { id: 4, name: "Emerald Cut", carat: 2.5, clarity: "VS2", color: "F", cut: "Excellent", price: 25000 }
];

const ManageDiamond = () => {
  const [diamonds, setDiamonds] = useState(initialDiamonds);

  const handleDelete = (diamondId) => {
    const updatedDiamonds = diamonds.filter(diamond => diamond.id !== diamondId);
    setDiamonds(updatedDiamonds);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Diamond Inventory</h1>
        <button style={styles.addButton}>+ ADD PRODUCT</button>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Carat</th>
            <th style={styles.th}>Clarity</th>
            <th style={styles.th}>Color</th>
            <th style={styles.th}>Cut</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {diamonds.map((diamond) => (
            <tr key={diamond.id}>
              <td style={styles.td}>{diamond.id}</td>
              <td style={styles.td}>{diamond.name}</td>
              <td style={styles.td}>{diamond.carat}</td>
              <td style={styles.td}>{diamond.clarity}</td>
              <td style={styles.td}>{diamond.color}</td>
              <td style={styles.td}>{diamond.cut}</td>
              <td style={styles.td}>${diamond.price}</td>
              <td style={styles.td}>
                <button style={styles.editButton}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(diamond.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    fontSize: '24px'
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
  editButton: {
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
  }
};

export default ManageDiamond;
