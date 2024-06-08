import React, { useState } from 'react';

// Dữ liệu mẫu cho kim cương
const initialDiamonds = [
  { id: 1, name: "Round Brilliant Cut", carat: 1.2, clarity: "VS1", color: "E", cut: "Excellent", price: 12000 },
  { id: 2, name: "Princess Cut", carat: 1.5, clarity: "SI1", color: "G", cut: "Very Good", price: 10000 },
  { id: 3, name: "Cushion Cut", carat: 2.0, clarity: "VVS2", color: "H", cut: "Good", price: 18000 },
  { id: 4, name: "Emerald Cut", carat: 2.5, clarity: "VS2", color: "F", cut: "Excellent", price: 25000 },
  // Giả sử có thêm nhiều mục để phù hợp với phân trang
  { id: 5, name: "Marquise Cut", carat: 1.8, clarity: "SI2", color: "I", cut: "Fair", price: 9700 },
  { id: 6, name: "Oval Cut", carat: 1.3, clarity: "VVS1", color: "J", cut: "Very Good", price: 11000 },
  { id: 7, name: "Pear Cut", carat: 2.1, clarity: "VS1", color: "H", cut: "Good", price: 21000 },
  { id: 8, name: "Heart Cut", carat: 2.2, clarity: "SI1", color: "E", cut: "Excellent", price: 18000 }
  
]; // data ảo

const ManageDiamond = () => {
  const [diamonds, setDiamonds] = useState(initialDiamonds);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng mục trên mỗi trang đã được cập nhật

  const handleDelete = (diamondId) => {
    const updatedDiamonds = diamonds.filter(diamond => diamond.id !== diamondId);
    setDiamonds(updatedDiamonds);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentDiamonds = diamonds.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(diamonds.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          {currentDiamonds.map((diamond) => (
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


export default ManageDiamond;
