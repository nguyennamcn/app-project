import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';

const CartPage = () => {
  const [dataSource, setDataSource] = useState([
    { key: '1', name: 'Item 1', quantity: 1, price: 10 },
    { key: '2', name: 'Item 2', quantity: 2, price: 15 },
  ]);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAllPrice, setTotalAllPrice] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleQuantityChange = (key, delta) => {
    const newDataSource = dataSource
      .map(item => {
        if (item.key === key) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
        }
        return item;
      })
      .filter(item => item !== null);

    setDataSource(newDataSource);
  };

  useEffect(() => {
    const totalQty = dataSource.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(totalQty);
    const totalAllPrice = dataSource.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotalAllPrice(totalAllPrice);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setDataSource([]);
    }, 3600000); // 1 tiếng là xóa hết sản phẩm

    setTimeoutId(newTimeoutId);

    return () => clearTimeout(newTimeoutId);
  }, [dataSource]);

  useEffect(() => {
    const initialData = dataSource.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price,
    }));
    setDataSource(initialData);
  }, []);

  const handleSendOrder = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.log("Order sent");
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <div>
          <Button onClick={() => handleQuantityChange(record.key, -1)}>-</Button>
          <span style={{ margin: '0 10px' }}>{record.quantity}</span>
          <Button onClick={() => handleQuantityChange(record.key, 1)}>+</Button>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'productPrice',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text, record) => <span>{record.totalPrice}</span>,
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <hr />
      <div>
        <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Order CODE: #1003</h1>
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          fontSize: '24px',
        }}>
          <div style={{
            marginTop: '4%'
          }}>
            <p>Quantity: {totalQuantity}</p>
            <p>TotalPrice: {totalAllPrice}</p>
          </div>
          <div style={{
            marginTop: '4%',
            width:'20%',
          }}>
            {/* <p>Phone Member: <input style={{ border: '1px solid black', borderRadius: '10px', background: '#C7CCD0', color: 'black' }} type="text" placeholder='Phone member' /></p> */}
            <p>Customer: <input style={{ border: '1px solid black', borderRadius: '10px', background: '#C7CCD0', color: 'black', marginLeft: '1%', marginTop: '10px' }} type="text" placeholder='Customer' /></p>
          </div>
        </div>
        <button onClick={handleSendOrder} style={{
          marginLeft: '45%',
          padding: '15px',
          background: '#15B83F',
          borderRadius: '10px',
          color: 'white'
        }}>Send order</button>
      </div>
    </div>
  );
};

export default CartPage;
