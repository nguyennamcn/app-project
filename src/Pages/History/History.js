import React from 'react';
import './History.css';

const BuyHistory = () => {
  const data = [
    { id: '#10001', date: '08/05/2024', customer: 'Hieu PC', category: 'Ring', quantity: 1 },
    { id: '#10002', date: '07/05/2024', customer: 'Thang Ca Chep', category: 'Earrings', quantity: 2 },
    { id: '#10003', date: '06/05/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10004', date: '04/05/2024', customer: 'Nguyen Quoc Nam', category: 'Ring', quantity: 1 },
    { id: '#10005', date: '01/05/2024', customer: 'Nguyen Quoc Nam', category: 'Ring', quantity: 3 },
    { id: '#10006', date: '24/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10007', date: '23/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 1 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Necklace', quantity: 4 },
    { id: '#10008', date: '21/04/2024', customer: 'Nguyen Quoc Nam', category: 'Ring', quantity: 2 },
  ];

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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.date}</td>
              <td>{item.customer}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="pagination">
        <label>10</label>
       
        <button>{'<'}</button>
        <span>per page</span>
        <span>1 of 1 pages</span>
        <button>{'>'}</button>
      </div> */}

      
    </div>
  );
};

export default BuyHistory;
