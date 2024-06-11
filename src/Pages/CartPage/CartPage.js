import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

const CartPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAllPrice, setTotalAllPrice] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    // Handle input change for customer name
    const handleInputChange = (event) => {
        setCustomerName(event.target.value);
    };

    const handleInputChange1 = (event) => {
        setCustomerPhone(event.target.value);
    };

    let userInfo = useSelector((state) => {
        return state.userReducer.userInfo;
    });

    // Load cart items from localStorage when component mounts
    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setDataSource(cartItems);
    }, []);

    // Fetch customer data when phone number changes
    useEffect(() => {
        if (customerPhone) {
            adornicaServ.getPhoneCustomer(customerPhone)
                .then(response => {
                    if (response.data) {
                        setCustomerName(response.data.metadata.name);
                        console.log(response)
                    } else {
                        setCustomerName('');
                    }
                })
                .catch(error => {
                    console.error("Error fetching customer data:", error);
                    setCustomerName(''); // Clear the customer name if there's an error
                });
        }
    }, [customerPhone]);

    // Calculate totals and set up auto-clear timeout
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
        localStorage.setItem('cartItems', JSON.stringify(newDataSource));
    };

    // Handle sending the order
    const handleSendOrder = () => {
        const orderList = dataSource.map(item => ({
            productCode: item.productCode,
            productId: item.productId,
            productName: item.name || "Unknown Product", 
            sizeId: item.sizeId,
            quantity: item.quantity,
            price: item.price,
        }));
        console.log(orderList)
        const orderData = {
            staffId: userInfo.id,
            customer: customerName,
            phone: customerPhone,
            orderList,
            totalPrice: totalAllPrice
        };
    
        adornicaServ.postOrder(orderData)
            .then(response => {
                setDataSource([]);
                localStorage.removeItem('cartItems');
                alert('Order sent successfully');
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
            <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 170 }} />
            <hr />
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: '24px',
                }}>
                    <div style={{ marginTop: '0%' }}>
                        <p>Quantity: {totalQuantity}</p>
                        <p>Total Price: {totalAllPrice}</p>
                    </div>
                    <div style={{ marginTop: '0%', width: '20%' }}>
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
                        <p>Phone:
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
                                placeholder='Phone'
                                value={customerPhone}
                                onChange={handleInputChange1}
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
