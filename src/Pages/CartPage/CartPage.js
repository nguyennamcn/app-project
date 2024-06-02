import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';

const CartPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAllPrice, setTotalAllPrice] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setDataSource(cartItems);
    }, []);

    useEffect(() => {
        const totalQty = dataSource.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(totalQty);
        const totalPrice = dataSource.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
        setTotalAllPrice(totalPrice);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            setDataSource([]);
            localStorage.removeItem('cartItems');
        }, 3600000); // Clear cart after 1 hour

        setTimeoutId(newTimeoutId);

        return () => clearTimeout(newTimeoutId);
    }, [dataSource]);

    const handleQuantityChange = (productCode, size, delta) => {
        const newDataSource = dataSource
            .map(item => {
                if (item.productCode === productCode && item.size === size) {
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
        localStorage.setItem('cartItems', JSON.stringify(newDataSource));
    };

    const handleSendOrder = () => {
        const orderList = dataSource.map(item => ({
            productId: item.productCode,  // Assuming productCode is used as productId
            sizeId: item.size,            // Assuming size is used as sizeId
            quantity: item.quantity
        }));

        const orderData = {
            keyProOrder: "uniqueOrderKey", // Replace with actual order key if available
            staffId: 1,                    // Replace with actual staff ID if available
            phone,
            name: customerName,
            orderList,
            paymentMethod: "CASH",         // Replace with actual payment method if necessary
            discount: 0,                   // Replace with actual discount if available
            totalPrice: totalAllPrice
        };

        console.log("Order Data:", orderData);  // Log the order data

        adornicaServ.postOrder(orderData)
            .then(response => {
                console.log("Order sent successfully:", response.data);
                setDataSource([]);
                localStorage.removeItem('cartItems');
            })
            .catch(error => {
                console.error("There was an error sending the order:", error);
                console.error("Error Response:", error.response);  // Log the error response
                alert('Failed to send order. Please check your input data.');
            });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleQuantityChange(record.productCode, record.size, -1)}>-</Button>
                    <span style={{ margin: '0 10px' }}>{record.quantity}</span>
                    <Button onClick={() => handleQuantityChange(record.productCode, record.size, 1)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
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
            <Table dataSource={dataSource} columns={columns} rowKey="productCode" />
            <hr />
            <div>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Order CODE: #1003</h1>
                <div style={{ display: "flex", justifyContent: "space-around", fontSize: '24px' }}>
                    <div style={{ marginTop: '4%' }}>
                        <p>Quantity: {totalQuantity}</p>
                        <p>Total Price: {totalAllPrice}</p>
                    </div>
                    <div style={{ marginTop: '4%', width: '20%' }}>
                        <p>Customer: <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ border: '1px solid black', borderRadius: '10px', background: '#C7CCD0', color: 'black', marginLeft: '1%', marginTop: '10px' }} placeholder='Customer' /></p>
                        <p>Phone: <Input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ border: '1px solid black', borderRadius: '10px', background: '#C7CCD0', color: 'black', marginLeft: '1%', marginTop: '10px' }} placeholder='Phone' /></p>
                    </div>
                </div>
                <Button onClick={handleSendOrder} style={{ marginLeft: '45%', padding: '15px', background: '#15B83F', borderRadius: '10px', color: 'white' }}>
                    Send order
                </Button>
            </div>
        </div>
    );
};

export default CartPage;
