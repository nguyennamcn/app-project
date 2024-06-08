import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const BuyHistory = () => {
  const data = [
    { id: '#10001', date: '08/05/2024', customer: 'Hieu PC', category: 'Ring', quantity: 1 },
    { id: '#10002', date: '07/05/2024', customer: 'Thang Nguyen', category: 'Gold', quantity: 2 },
    { id: '#10003', date: '06/05/2024', customer: 'Nguyen Quoc Nam', category: 'Diamond', quantity: 1 },
    { id: '#10004', date: '04/05/2024', customer: 'Nguyen Quoc Nam', category: 'Diamond', quantity: 1 },
    { id: '#10005', date: '01/05/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 3 },
    { id: '#10006', date: '24/04/2024', customer: 'Nguyen Quoc Nam', category: 'Store product', quantity: 1 },
    { id: '#10007', date: '23/04/2024', customer: 'Nguyen Quoc Nam', category: 'Store product', quantity: 1 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 4 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 4 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 4 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 4 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Gold', quantity: 4 },

    // Add more items here to increase the total count for pagination
  ];

  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  const styles = {
    buyHistory: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      margin: '0px',
      width: '100%',
      height: '100%',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '0px',
    },
    tableHeader: {
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    tableData: {
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    navLink: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      width: '100%',
      height: '100%',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
    },
    button: {
      padding: '5px 10px',
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    select: {
      padding: '5px',
    },
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={styles.buyHistory}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Customer</th>
            <th style={styles.tableHeader}>
              <select name='jewelry__category' id='category' style={styles.select}>
                <option value='category'>Category</option>
                <option value='jewelry'>Jewelry</option>
                <option value='gold'>Gold</option>
                <option value='diamond'>Diamond</option>
                <option value='store-product'>Store's product</option>
              </select>
            </th>
            <th style={styles.tableHeader}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td style={styles.tableData}>
                <NavLink style={styles.navLink} to={`/detail`}>
                  {item.id}
                </NavLink>
              </td>
              <td style={styles.tableData}>{item.date}</td>
              <td style={styles.tableData}>{item.customer}</td>
              <td style={styles.tableData}>{item.category}</td>
              <td style={styles.tableData}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{...styles.button, ...(currentPage === 1 && styles.buttonDisabled)}}>{'<'}</button>
        <span>{`Page ${currentPage} of ${pageCount}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount} style={{...styles.button, ...(currentPage === pageCount && styles.buttonDisabled)}}>{'>'}</button>
      </div>
    </div>
  );
};

export default BuyHistory;
