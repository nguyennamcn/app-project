import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import "./StoreProductDetail.css";
import { useSelector } from 'react-redux';

export default function StoreProductDetail() {
    const [sp, setSp] = useState({});
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderCode } = useParams();
    const userInfo = useSelector((state) => state.userReducer.userInfo);
    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        adornicaServ.getOrderDetail(orderCode)
            .then((res) => {
                const orderDetail = res.data.metadata;
                setSp(orderDetail);
                setProducts(orderDetail.list);
                const calculatedTotalPrice = orderDetail.list.reduce((sum, product) => sum + (product.price || 0), 0);
                const priceAll = calculatedTotalPrice * 0.7;
                setTotalPrice(priceAll);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderCode]);

    const generateRandomOrderCode = () => {
        return 'SP' + Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            staffId: userInfo.id,
            purchaseOrderCode: generateRandomOrderCode(),
            customerName: sp?.customerName,
            phone: sp?.customerPhone,
            list: products.map(product => ({
                name: product.productName,
                productCode: product.productCode,
                price: product.price
            })),
            totalPrice: totalPrice,
            productStore: true
        };

        console.log('Form Data Submitted:', formData);

        try {
            const response = await adornicaServ.postPurchaseOrderCode(formData);
            console.log('Order sent successfully:', response.data);
            setModalTitle('Success');
            setModalMessage('Order sent successfully');
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
                navigate('/buyProduct');
            }, 2000);
        } catch (error) {
            console.error('There was an error sending the order:', error);
            if (error.response) {
                console.error('Response data:', error.response);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            setModalTitle('Error');
            setModalMessage('Failed to send order. Please check your input data.');
            setModalVisible(true);
        }
    };

    const columnsProductInBill = [
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
            render: (text) => `$${text}`,
        },
    ];

    const dateSellFormatted = sp?.dateSell ? new Date(sp.dateSell).toLocaleDateString() : '';

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>Order Code: {sp?.orderCode}</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="product__table col-sm-6"
                        style={{
                            marginLeft: '10px',
                            backgroundColor: 'white',
                            width: '100px',
                            height: '400px',
                            padding: '0',
                        }}>
                        <Table style={{ margin: '20px 60px 0 60px', width: '90%' }} dataSource={products} columns={columnsProductInBill} pagination={false} scroll={{ y: 168 }} />
                        <div className="row">
                            <div className='col-sm-6'>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Customer:<span style={{ marginLeft: '4%' }}>{sp?.customerName}</span>
                                    </h1>
                                </div>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Phone:<span style={{ marginLeft: '4%' }}>{sp?.customerPhone}</span>
                                    </h1>
                                </div>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Date of sale:<span style={{ marginLeft: '4%' }}>{dateSellFormatted}</span>
                                    </h1>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Total items:<span style={{ marginLeft: '4%' }}>{sp?.list ? sp.list.length : 0}</span>
                                    </h1>
                                </div>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Payment method:<span style={{ marginLeft: '4%' }}>{sp?.paymentMethod}</span>
                                    </h1>
                                </div>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Total Pay:<span style={{ marginLeft: '4%' }}>${totalPrice}</span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 flex justify-center mt-6">
                        <NavLink to={"/buyProduct"}>
                            <Button
                                style={{ padding: '0 56px 0 56px' }}
                                size="large"
                                danger
                            >Back</Button>
                        </NavLink>
                        <Button
                            size="large"
                            htmlType='submit'
                            onClick={handleSubmit}
                            style={{ padding: '0 46px', marginLeft: '30px' }}
                        >Purchase</Button>
                    </div>
                </div>
            </div>
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
}
