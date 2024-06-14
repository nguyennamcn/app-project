import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

const CartPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAllPrice, setTotalAllPrice] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalVisible(true);
        //setTimeout(() => setIsModalVisible(false), 1000);
    };

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

    const generateOrderCode = () => {
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };
    // Handle sending the order
    const handleSendOrder = () => {
        if (!customerPhone || !customerName || dataSource.length === 0) {
            showModal(
                <div className='notice__content'>
                    <i className="error__icon fa-solid fa-circle-xmark" ></i>
                    <h1>Failed to send order. Please check your input data.</h1>
                </div>
            );
            return;
        }

        const orderList = dataSource.map(item => ({
            productId: item.productId,
            price: item.price,
        }));


        const orderData = {
            orderCode: generateOrderCode(),  // Replace with actual order code logic if available
            staffId: userInfo.id,
            phone: customerPhone,
            name: customerName,
            orderList,
            totalPrice: totalAllPrice
        };

        adornicaServ.postOrder(orderData)
            .then(response => {
                setDataSource([]);
                localStorage.removeItem('cartItems');

                showModal(<div className='notice__content'><i class="check__icon fa-solid fa-circle-check" ></i><h1>Product added successfully !</h1></div>);
            })
            .catch(error => {
                console.error("There was an error sending the order:", error);
                showModal(<div className='notice__content'><i class="error__icon fa-solid fa-circle-xmark" ></i><h1>Failed to send order. Please check your input data.</h1></div>);
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
            title: 'Product Code',
            dataIndex: 'productCode',
            key: 'productCode',
            // render: (text, record) => (
            //     <div>
            //                           <span style={{ margin: '0 10px' }}>{record.quantity}</span>
            //       </div>
            // ),
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
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleQuantityChange(record.productCode, record.size, -1)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Table style={{ minHeight: '230px' }} dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 170 }} />
            <hr />
            <div>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Order detail</h1>
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
            <Modal
                title="Notification"
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal"
            >
                <div>{modalMessage}</div>
            </Modal>
        </div>
    );
};

export default CartPage;