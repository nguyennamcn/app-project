import React, { useState } from 'react';
import './History.css';
import { NavLink } from 'react-router-dom';

const BuyHistory = () => {
  const data = [
    { id: '#10001', date: '08/05/2024', customer: 'Hieu PC', category: 'Ring', quantity: 1 },
    { id: '#10002', date: '07/05/2024', customer: 'Thang Nguyen', category: 'Earrings', quantity: 2 },
    { id: '#10003', date: '06/05/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10004', date: '04/05/2024', customer: 'Nguyen Quoc Nam', category: 'Ring', quantity: 1 },
    { id: '#10005', date: '01/05/2024', customer: 'Nguyen Quoc Nam', category: 'Ring', quantity: 3 },
    { id: '#10006', date: '24/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10007', date: '23/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 4 },

    // Add more items here to increase the total count for pagination
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="buy-history">
      <table>
        <thead>
        
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>
              <select name='jewelry__category' id='category'>
                <option value='category'>Category</option>
                <option value='jewelry'>Jewelry</option>
                <option value='gold'>Gold</option>
                <option value='diamond'>Diamond</option>
                <option value='store-product'>Store's product</option>
              </select>
            </th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <NavLink style={{ textDecoration: 'none' }} to={`/detail`}>
              <td>{item.id}</td>
              </NavLink>
              <td>{item.date}</td>
              <td>{item.customer}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
             
            </tr>
          ))}    
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{'<'}</button>
        <span>{`Page ${currentPage} of ${pageCount}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount}>{'>'}</button>
      </div>
    </div>
  );
};

export default BuyHistory;
