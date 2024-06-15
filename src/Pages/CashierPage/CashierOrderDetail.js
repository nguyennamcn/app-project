import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select, DatePicker } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import './CashierOrderDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function ListOrderPage() {
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerBirthday, setCustomerBirthday] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [datesale, setDateSale] = useState('');
    const [discount, setDiscount] = useState(10);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderKey } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState(''); // Add state for delivery status

    const userInfo = useSelector((state) => state.userReducer.userInfo);
    console.log(userInfo);

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
                console.log(res.data.metadata);
                const orderList = res.data.metadata?.list?.map(item => ({
                    ...item,
                    totalPrice: item.price
                })) || [];
                setProducts(orderList);
                const customerData = res.data.metadata || {};
                setCustomer(customerData);
                setCustomerName(customerData.customerName || '');
                setCustomerPhone(customerData.customerPhone || '');
                setCustomerAddress(customerData.address || '');
                setCustomerBirthday(customerData.dateOfBirth ? moment(customerData.dateOfBirth).valueOf() : null);
                setDateSale(customerData.dateSell ? convertMillisecondsToDateString(customerData.dateSell) : '');
                setPaymentMethod(customerData.paymentMethod || '');
                setDeliveryStatus(customerData.deliveryStatus || '');
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderKey]);

    console.log(products);
    useEffect(() => {
        const calculatedTotalPrice = products.reduce((total, product) => total + product.totalPrice, 0);
        setTotalPrice(calculatedTotalPrice);
    }, [products]);

    const generateRandomKey = () => {
        return 'order_' + Math.random().toString(36).substr(2, 9);
    };

    const handleSubmit = () => {
        const randomOrderKey = generateRandomKey();

        const orderData = {
            keyProOrder: orderKey,
            orderCode: randomOrderKey,
            staffId: userInfo.id,
            phone: customerPhone,
            name: customerName,
            address: customerAddress,
            dateOfBirth: customerBirthday ? customerBirthday : '',
            orderList: products.map(product => ({
                productId: product.productId,
                sizeId: product.sizeId,
                quantity: product.quantity,
                productCode: product.productCode
            })),
            paymentMethod: paymentMethod,
            discount: discount,
            totalPrice: totalPrice - (totalPrice * discount / 100)
        };

        adornicaServ.postPaidSummit(orderData)
            .then((res) => {
                console.log('Order submitted successfully:', res.data);
                navigate('/homePage');
            })
            .catch((err) => {
                console.log('Error submitting order:', err.response);
                alert(err.response.data.metadata.message)
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

    const currentDate = moment().format('DD/MM/YYYY');

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>Order</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="customer__info col-sm-5" style={{
                        marginRight: '10px',
                        backgroundColor: 'white',
                        width: '100px',
                        height: '400px',
                        padding: '0',
                    }}>
                        {deliveryStatus === 'PENDING' ? (
                            <>
                                <label>Name: <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></label>
                                <label>Phone: <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></label>
                                <label>Address<input style={{ marginLeft: '9.6%' }} type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} /></label>
                                <label>Birthday: <DatePicker onChange={(date) => setCustomerBirthday(date ? date.valueOf() : null)} value={customerBirthday ? moment(customerBirthday) : null} /></label>

                            </>
                        ) : (
                            <>
                                <label>Name: {customerName}</label>
                                <label>Phone: {customerPhone}</label>
                            </>
                        )}

                        {deliveryStatus === 'PENDING' ? (
                            <>
                                <label>Date of sale:<h1 style={{ marginLeft: '2.4%', display: 'inline-block' }} type="text">{currentDate}</h1></label>
                                <label>Payment methods<select style={{ marginLeft: '2%' }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <option value='CASH'>Cash</option>
                                    <option value='BANKING'>Banking</option>
                                </select></label>
                            </>
                        ) : (
                            <>
                                <label>Date of sale: </label>
                                <label>Payment methods: {paymentMethod}</label>
                                <label>Delivery status: {deliveryStatus}</label>
                            </>
                        )}

                    </div>

                    <div className="product__table col-sm-6" style={{
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
                        <a href='/cashierListOrder'><Button
                            style={{ padding: '0 56px 0 56px', marginRight: '30px' }}
                            size="large"
                            danger
                        >Back</Button></a>

                        <Button
                            size="large"
                            htmlType='submit'
                            onClick={handleSubmit}
                            style={{ padding: '0 60px', marginLeft: '30px' }}
                            disabled={deliveryStatus === 'SUCCESS'} // Disable button if deliveryStatus is success
                        >Paid</Button>
                    </div>
                </div>

                <div className="stick" style={{
                    position: 'absolute',
                    width: '1px',
                    height: '55%',
                    backgroundColor: 'black',
                    top: '21%',
                    right: '43.5%',
                }}></div>
            </div>
        </div>
    );
}
