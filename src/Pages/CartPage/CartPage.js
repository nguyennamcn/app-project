import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';

const CartPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAllPrice, setTotalAllPrice] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    console.log(dataSource)
    // Handle input change for customer name
    const handleInputChange = (event) => {
        setCustomerName(event.target.value);
    };

    // Load cart items from localStorage when component mounts
    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setDataSource(cartItems);
    }, []);

    // Calculate totals and set up auto-clear timeout
    useEffect(() => {
        console.log("Current DataSource:", dataSource); // Debugging log
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
    

    // Handle quantity change for cart items
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
        console.log(dataSource)
        localStorage.setItem('cartItems', JSON.stringify(newDataSource));
    };

    // Handle sending the order
    const handleSendOrder = () => {
        console.log("Data Source:", dataSource); // Log data source for debugging
        
        const orderList = dataSource.map(item => ({
            productId: item.productCode,
            productName: item.name || "Unknown Product", // Ensure this is not undefined or null
            sizeId: item.size, // Assuming size is used as sizeId
            quantity: item.quantity,
            price: item.price,
        }));
    
        const orderData = {
            staffId: 1, // Replace with actual staff ID if available
            customer: customerName,
            orderList,
            totalPrice: totalAllPrice
        };
    
        console.log("Order Data:", orderData); // Log the order data
    
        adornicaServ.postOrder(orderData)
            .then(response => {
                console.log("Order sent successfully:", response.data);
                setDataSource([]);
                localStorage.removeItem('cartItems');
            })
            .catch(error => {
                console.error("There was an error sending the order:", error);
                alert('Failed to send order. Please check your input data.');
            });
    };
    
    
    // Define table columns
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
            <Table dataSource={dataSource} columns={columns} />
            <hr />
            <div>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Order CODE: #1003</h1>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: '24px',
                }}>
                    <div style={{ marginTop: '4%' }}>
                        <p>Quantity: {totalQuantity}</p>
                        <p>Total Price: {totalAllPrice}</p>
                    </div>
                    <div style={{ marginTop: '4%', width: '20%' }}>
                        <p>Customer: 
                            <input
                                style={{
                                    border: '1px solid black',
                                    borderRadius: '10px',
                                    background: '#C7CCD0',
                                    color: 'black',
                                    marginLeft: '1%',
                                    marginTop: '10px'
                                }}
                                type="text"
                                placeholder='Customer'
                                value={customerName}
                                onChange={handleInputChange}
                            />
                        </p>
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
