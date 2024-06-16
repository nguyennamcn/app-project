import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import './DetailOrderStatus.css';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

export default function ListOrderPage() {
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [datesale, setDateSale] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [discount, setDiscount] = useState(10);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderKey } = useParams();
    const navigate = useNavigate();

    const convertMillisecondsToDateString = (milliseconds) => {
        const date = new Date(milliseconds);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        adornicaServ.getListOrderDetail(orderKey)
            .then((res) => {
                const orderList = res.data.metadata.list.map(item => ({
                    ...item,
                    totalPrice: item.price
                })) || [];
                setProducts(orderList);
                const orderData = res.data.metadata || {};
                setCustomerName(orderData.customerName || '');
                setCustomerPhone(orderData.customerPhone || '');
                setDateSale(orderData.dateSell ? convertMillisecondsToDateString(orderData.dateSell) : '');
                setPaymentMethod(orderData.paymentMethod || '');
                setDeliveryStatus(orderData.deliveryStatus || '');

                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderKey]);

    useEffect(() => {
        const calculatedTotalPrice = products.reduce((total, product) => total + product.totalPrice, 0);
        setTotalPrice(calculatedTotalPrice);
    }, [products]);

    const handleSubmit = (keyID) => {
        const orderID = keyID;

        adornicaServ.postUpdateDeliveryOrder(orderID)
            .then((res) => {
                console.log('Order submitted successfully:', res.data);
                alert("Submit success");
                // Toggle the refresh state to re-fetch orders
            })
            .catch((err) => {
                console.log('Error submitting order:', err.response); // Log error details
                // alert( err.response.data.metadata.message)
            });
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Product Code',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
    ];

    const isDeliverySuccessful = deliveryStatus.toLowerCase() === 'success';
    const isNotPaymented = paymentMethod.toLowerCase() === 'none';

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0', }}>Order</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px', }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">

                    <div className='order__info col-sm-5'>
                        <label>Name: {customerName}</label>
                        <label>Phone: {customerPhone}</label>
                        <label>Date of sale: {datesale}</label>
                        <label>Payment methods: {paymentMethod}</label>
                        <label>Delivery status: {deliveryStatus}</label>
                    </div>

                    <div className="product__table col-sm-6"
                        style={{
                            marginLeft: '10px',
                            backgroundColor: 'white',
                            width: '100px',
                            height: '400px',
                            padding: '0',
                        }}>
                        <Table style={{ margin: '20px 60px 0 60px', width: '90%' }} dataSource={products} columns={columns} pagination={false} scroll={{ y: 168 }} />
                        <div className="row">
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total item:<span style={{ marginLeft: '4%' }}>{products.length}</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Discount:<span style={{ marginLeft: '4%' }}>{discount}%</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total:<span style={{ marginLeft: '4%', textDecoration: 'line-through' }}>{(totalPrice).toFixed(2)}$</span><span style={{ marginLeft: '4%', color: 'orange' }}>{(totalPrice - (totalPrice * discount / 100)).toFixed(2)}$</span></h1></div>
                        </div>
                    </div>

                    <div className="col-sm-12 flex justify-center mt-6">
                        <NavLink to={"/homePage"}>
                            <Button
                                style={{ padding: '0 56px 0 56px', marginRight: '30px' }}
                                size="large"
                                danger
                            >Back</Button>
                        </NavLink>

                        <Button
                            style={{ padding: '0 56px 0 56px', marginLeft: '30px' }}
                            size="large"
                            type='primary'
                            onClick={() => handleSubmit(orderKey)}
                            disabled={isDeliverySuccessful || isNotPaymented}
                        >Delivery</Button>

                    </div>
                </div>
            </div>
        </div>
    );
}
