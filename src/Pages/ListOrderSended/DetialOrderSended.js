import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select, Modal } from 'antd';
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
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderKey } = useParams();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const convertMillisecondsToDateString = (milliseconds) => {
        const date = new Date(milliseconds);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchOrderDetails = () => {
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
                setDiscount(orderData.discount || 0);
                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchOrderDetails();
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
                showModal(
                    <div className='notice__content'>
                        <i className="check__icon fa-solid fa-circle-check"></i>
                        <h1>Giao hàng thành công !</h1>
                    </div>
                );
                setDeliveryStatus('SUCCESS'); // Update the delivery status to trigger a rerender
                fetchOrderDetails(); // Refetch order details after updating the status
            })
            .catch((err) => {
                console.log('Error submitting order:', err.response.data.metadata); 
                const errorMetadata = err.response.data.metadata;
                const errorMessage = errorMetadata.message || "An error occurred";
                const errorCode = errorMetadata.code || "Unknown error code";
                showModal(<div className='notice__content'><i class="error__icon fa-solid fa-circle-xmark" ></i><h1 style={{color:'red'}}>Error: {errorMessage} (Code: {errorCode})</h1></div>);
            });
    };

    const columns = [
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Mã Sản Phẩm',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Giá tiền (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
        },
    ];

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalVisible(true);
        setTimeout(() => setIsModalVisible(false), 2000);
    };

    const isDeliverySuccessful = deliveryStatus.toLowerCase() === 'success';
    const isNotPaymented = paymentMethod.toLowerCase() === 'none';

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 10px 0', }}>Mã đơn hàng: {orderKey}</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px', }}></div>
            </div>
            <div className="detailOrderSended">
                <div className="row justify-content-md-center" style={{backgroundColor:'white', padding:'6px', borderRadius:'10px',}}>

                    <div className='order__info col-sm-5'
                     style={{
                        marginLeft: '10px',
                        backgroundColor: 'white',
                        width: '100px',
                        height: '400px',
                        padding: '0',
                    }}>
                        <label>Tên: {customerName}</label>
                        <label>Số điện thoại: {customerPhone}</label>
                        <label>Ngày : {datesale}</label>
                        <label>Phương thức thanh toán: {paymentMethod}</label>
                        <label>Trạng thái giao dịch: {deliveryStatus}</label>
                    </div>

                    <div className="product__table col-sm-6"
                        style={{
                            marginLeft: '10px',
                            backgroundColor: 'white',
                            width: '100px',
                            height: '400px',
                            padding: '0',
                        }}>
                        <Table style={{ margin: '20px 20px 0 20px', width: '90%' }} dataSource={products} columns={columns} pagination={false} scroll={{ y: 168 }} />
                        <div className="row" style={{position: 'absolute', bottom:'16px'}}>
                            <div className="col-sm-12"><h1 style={{textAlign:'left', fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Số lượng sản phẩm:<span style={{ marginLeft: '4%' }}>{products.length}</span></h1></div>
                            <div className="col-sm-12"><h1 style={{textAlign:'left', fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Giảm :<span style={{ marginLeft: '4%' }}>{discount}%</span></h1></div>
                            {discount > 0 && (
                                <div className="col-sm-12">
                                    <h1 style={{ textAlign: 'left', fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Tổng:
                                        <span style={{ marginLeft: '4%', textDecoration: 'line-through' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                                        <span style={{ marginLeft: '4%', color: 'orange' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - (totalPrice * discount / 100))}</span>
                                    </h1>
                                </div>
                            )}
                            {discount === 0 && (
                                <div className="col-sm-12">
                                    <h1 style={{ textAlign: 'left', fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Tổng:
                                        <span style={{ marginLeft: '4%', color: 'orange' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                                    </h1>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-sm-12 flex justify-center mt-6">
                        <NavLink to={"/homePage"}>
                            <Button
                                style={{ padding: '0 56px 0 56px', marginRight: '30px',marginBottom:'20px' }}
                                size="large"
                                danger
                            >Trở về</Button>
                        </NavLink>

                        <Button
                            style={{ padding: '0 56px 0 56px', marginLeft: '30px' ,marginBottom:'20px'}}
                            size="large"
                            type='primary'
                            onClick={() => handleSubmit(orderKey)}
                            disabled={isDeliverySuccessful || isNotPaymented}
                        >Giao hàng</Button>

                    </div>
                </div>
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal-detail-order-send"
            >
                <div>{modalMessage}</div>
            </Modal>
        </div>
    );
}