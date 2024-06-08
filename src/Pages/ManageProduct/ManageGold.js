import React, { useState } from 'react';

const initialProducts = [
  { id: 1, name: "14K White Gold & Diamond Wedding Ring", gem: "Diamond", productionCost: "3250", gender: "Male", weight: "7g", material: "White gold", quantity: 20 },
  { id: 2, name: "18K White Gold Wedding Ring", gem: "None", productionCost: "2205", gender: "Unisex", weight: "5g", material: "White gold", quantity: 15 },
  { id: 3, name: "14K Yellow Gold Wedding Ring", gem: "None", productionCost: "1900", gender: "Female", weight: "4g", material: "Yellow gold", quantity: 10 },
  { id: 4, name: "Platinum & Diamond Wedding Band", gem: "Diamond", productionCost: "4500", gender: "Unisex", weight: "6g", material: "Platinum", quantity: 5 }
];

const InventoryPage = () => {
  const [gold, setGold] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hàm để xóa sản phẩm theo ID
  const handleDelete = (productId) => {
    const updatedProducts = gold.filter(product => product.id !== productId);
    setGold(updatedProducts);
  };
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentGold = gold.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(gold.length / itemsPerPage);

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
            <th style={styles.th}>Gem</th>
            <th style={styles.th}>Production Cost</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Weight</th>
            <th style={styles.th}>Material</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentGold.map((product) => (
            <tr key={product.id}>
              <td style={styles.td}>{product.id}</td>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>{product.gem}</td>
              <td style={styles.td}>${product.productionCost}</td>
              <td style={styles.td}>{product.gender}</td>
              <td style={styles.td}>{product.weight}</td>
              <td style={styles.td}>{product.material}</td>
              <td style={styles.td}>{product.quantity}</td>
              <td style={styles.td}>
                <button style={styles.updateButton}>Update</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(product.id)}>Delete</button>
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

// CSS-in-JS styles
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
    justifyContent: 'flex-end', // Căn phải các nút phân trang
    padding: '10px 20px'
  },
  pageButton: {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#000000', // Màu nền của nút là màu đen
    color: 'white', // Màu chữ là trắng
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default InventoryPage;
