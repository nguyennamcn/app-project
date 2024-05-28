import React, { useState } from 'react';

const Cart = () => {
  const [items, setItems] = useState([
    { id: '10003', name: 'Italy Ring', quantity: 1, price: 2643235, size: 12 },
    { id: '13043', name: '18K Gold Necklace', quantity: 1, price: 4442505, size: 13 },
    { id: '00133', name: 'Disney 14K Gold Bracelet', quantity: 2, price: 2990200, size: 14 },
    { id: '10128', name: '14K White Gold Ring Diamond', quantity: 1, price: 6232115, size: 15 },
    { id: '10568', name: '14K White Gold Ring with Topaz', quantity: 1, price: 5983525, size: 17 },
  ]);
  const [customer, setCustomer] = useState({ name: '', phone: '', discount: 10 });

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      // padding: '20px',
      backgroundColor: '#f5f5f5',
      maxWidth: '900px',
      margin: 'auto'
    },
    table: {
      width: '100%',
      marginBottom: '20px',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ddd',
      padding: '10px',
    },
    buttonDelete: {
      padding: '5px 10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    buttonSend: {
      padding: '10px 20px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    input: {
      padding: '5px',
      margin: '5px 0',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderTop: '1px solid #ccc',
    },
    orderDetails: {
      textAlign: 'right',
    },
    orderSummary: {
      marginTop: '20px',
      fontWeight: 'bold',
    },
    discount: {
      textDecoration: 'line-through',
      color: '#e74c3c',
    },
    finalPrice: {
      color: '#27ae60',
      fontWeight: 'bold',
      fontSize: '18px',
    },
  };

  const handleQuantityChange = (id, quantity) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleCustomerChange = (field, value) => {
    setCustomer({ ...customer, [field]: value });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = calculateTotal();
  const discountedPrice = totalPrice - (totalPrice * customer.discount / 100);

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Size</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>{(item.price * item.quantity).toLocaleString()}$</td>
              <td style={styles.td}>{item.id}</td>
              <td style={styles.td}>{item.size}</td>
              <td style={styles.td}>
                <button
                  style={styles.buttonDelete}
                  onClick={() => setItems(items.filter(i => i.id !== item.id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>
        <div>
          <div>Order CODE: #10003</div>
          <div>Quantity: {totalItems} Items</div>
          <div>Total discount: {customer.discount}%</div>
          <div style={styles.orderSummary}>
            <span style={styles.discount}>{totalPrice.toLocaleString()}$</span>
            <span style={styles.finalPrice}> {discountedPrice.toLocaleString()}$</span>
          </div>
        </div>
        <div style={styles.orderDetails}>
          <div>
            Customer:
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              style={styles.input}
              placeholder="Customer's name"
            />
          </div>
          <div>
            Member discount:
            <input
              type="number"
              value={customer.discount}
              onChange={(e) => handleCustomerChange('discount', parseInt(e.target.value, 10))}
              style={styles.input}
              placeholder="Discount"
            />
          </div>
          <div>
            Phone number:
            <input
              type="text"
              value={customer.phone}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
              style={styles.input}
              placeholder="Phone number"
            />
          </div>
        </div>
        <button style={styles.buttonSend} onClick={() => alert('Order sent')}>Send order</button>
      </div>
    </div>
  );
};

export default Cart;
