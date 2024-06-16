import React, { useState, useEffect } from 'react';
import { Button, Table, DatePicker, Modal } from 'antd';
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
    const [paymentMethodDone, setPaymentMethodDone] = useState('');
    const [datesale, setDateSale] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderKey } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    

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
                console.log(customerData)
                setCustomer(customerData);
                setCustomerName(customerData.customerName || '');
                setCustomerPhone(customerData.customerPhone || '');
                setCustomerAddress(customerData.address || '');
                setCustomerBirthday(customerData.dateOfBirth ? moment(customerData.dateOfBirth).valueOf() : null);
                setDateSale(customerData.dateSell ? convertMillisecondsToDateString(customerData.dateSell) : '');
                setPaymentMethodDone(customerData.paymentMethod || '');
                setDeliveryStatus(customerData.deliveryStatus || '');
                setOrderId(customerData.orderId || '');
                setDiscount(customerData.discount || 0);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderKey]);

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
            orderId: orderId,
            orderCode: orderKey,
            address: customerAddress,
            name: customerName,
            dateOfBirth: customerBirthday,
            paymentMethod: paymentMethod,
            amount: totalPrice,
            customerPhone: customerPhone,
        };

        console.log('Order Data:', orderData);

        if (!orderId || !orderKey || !customerName || !customerPhone || !customerAddress || !paymentMethod) {
            console.error('Missing required fields');
            return;
        }

        adornicaServ.postPaidSummit(orderData)
            .then((res) => {
                console.log('Order submitted successfully:', res.data);
                showModal(
                    <div className='notice__content'>
                        <i className="check__icon fa-solid fa-circle-check"></i>
                        <h1>Paid successfully !</h1>
                        <Button
                            htmlType='submit'
                            onClick={handleDownload}>Download PDF</Button>
                    </div>
                );
            })
            .catch((err) => {
                console.error('Error submitting order:', err.response || err);
                alert('Error submitting order. Please check the server logs for more details.');
            });
    };

    const handleDownload = () => {
        fetch(`/api/v1/orders/export-pdf/${orderKey}`, {
            method: 'POST', // or 'POST', depending on your API
            headers: {
                'Content-Type': 'application/pdf', // Adjust headers as necessary
                // Include any other headers your API requires
            },
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'filename.pdf'); // Change 'filename.pdf' to your preferred filename
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => console.error('Error fetching PDF:', error));
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

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalVisible(true);
    };

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>Order : {orderKey}</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="customer__info col-sm-5" style={{
                        marginRight: '10px',
                        backgroundColor: 'white',
                        padding: '0',
                    }}>
                        {paymentMethodDone === 'NONE' ? (
                            <>
                                <label>Name: <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></label>
                                <label>Phone: <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></label>
                                <label>Address: <input style={{ marginLeft: '9.6%' }} type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} /></label>
                                <label>Birthday: <DatePicker onChange={(date) => setCustomerBirthday(date ? date.valueOf() : null)} value={customerBirthday ? moment(customerBirthday) : null} /></label>
                                <label>Date of sale: <div style={{ marginLeft: '2.4%', display: 'inline-block' }}>{datesale}</div></label>
                                <label>Payment methods: <select style={{ marginLeft: '2%' }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <option value='CASH'>Cash</option>
                                    <option value='BANKING'>Banking</option>
                                </select></label>
                                <label>Delivery status: {deliveryStatus}</label>
                            </>
                        ) : (
                            <>
                                <label>Name: {customerName}</label>
                                <label>Phone: {customerPhone}</label>
                                <label>Date of sale: <div style={{ marginLeft: '2.4%', display: 'inline-block' }}>{datesale}</div></label>
                                <label>Payment methods: {paymentMethodDone}</label>
                                <label>Delivery status: {deliveryStatus}</label>
                            </>
                        )}
                    </div>
                    <div className="product__table col-sm-6" style={{
                        marginLeft: '10px',
                        backgroundColor: 'white',
                        padding: '0',
                    }}>
                        <Table style={{ margin: '20px 60px 0 60px', width: '90%' }} dataSource={products} columns={columns} pagination={false} scroll={{ y: 168 }} />
                        <div className="row">
                            <div className="col-sm-12">
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total item: <span style={{ marginLeft: '4%' }}>{products.length}</span></h1>
                            </div>
                            <div className="col-sm-12">
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Discount: <span style={{ marginLeft: '4%' }}>{discount}%</span></h1>
                            </div>
                            <div className="col-sm-12">
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total:
                                    <span style={{ marginLeft: '4%', textDecoration: 'line-through' }}>{totalPrice.toFixed(2)}$</span>
                                    <span style={{ marginLeft: '4%', color: 'orange' }}>{(totalPrice - (totalPrice * discount / 100)).toFixed(2)}$</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 flex justify-center mt-6">
                        <a href='/cashierListOrder'>
                            <Button
                                style={{ padding: '0 56px 0 56px', marginRight: '30px' }}
                                size="large"
                                danger
                            >Back</Button>
                        </a>
                        <Button
                            size="large"
                            htmlType='submit'
                            onClick={handleSubmit}
                            style={{ padding: '0 60px', marginLeft: '30px' }}
                            disabled={deliveryStatus === 'SUCCESS' || paymentMethodDone !== 'NONE'} // Disable button if deliveryStatus is success
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
                <Modal
                    title="Notification"
                    visible={isModalVisible}
                    footer={null}
                    onCancel={() => setIsModalVisible(false)}
                    className="custom-modal"
                >
                    <div>{modalMessage}</div>
                </Modal>
                {pdfUrl && (
                    <div className="pdf-container">
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button type="primary" size="large">View PDF</Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
