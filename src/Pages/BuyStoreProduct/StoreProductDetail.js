import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, NavLink } from 'react-router-dom';
import "./StoreProductDetail.css";
import { useSelector } from 'react-redux';

export default function StoreProductDetail() {
    const [sp, setSp] = useState({});
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState(10);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderCode } = useParams();
    const userInfo = useSelector((state) => state.userReducer.userInfo);

    useEffect(() => {
        adornicaServ.getOrderDetail(orderCode)
            .then((res) => {
                const orderDetail = res.data.metadata;
                setSp(orderDetail);
                setProducts(orderDetail.list);
                const calculatedTotalPrice = orderDetail.list.reduce((sum, product) => sum + product.price * product.quantity, 0);
                setTotalPrice(calculatedTotalPrice);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderCode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            staffId: userInfo.id,
            customerName: sp?.customerName,
            phone: sp?.customerPhone,
            list: products.map(product => ({
                name: product.productName,
                productCode: product.productCode
            })),
            totalPrice: totalPrice - (totalPrice * discount / 100),
            productStore: true
        };

        console.log('Form Data Submitted:', formData);

        try {
            const response = await adornicaServ.postPurchaseOrderCode(formData);
            console.log('Order sent successfully:', response.data);
            alert('Order sent successfully');
        } catch (error) {
            console.error('There was an error sending the order:', error);
            if (error.response) {
                console.error('Response data:', error.response);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            alert('Failed to send order. Please check your input data.');
        }
    };

    const columnsProductInBill = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <div>
                    <span style={{ margin: '0 10px' }}>{record.quantity}</span>
                </div>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
    ];

    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

    const dateSellFormatted = new Date(sp?.dateSell).toLocaleDateString();

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>Order Code</h1>
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
                                        Total items:<span style={{ marginLeft: '4%' }}>{totalQuantity}</span>
                                    </h1>
                                </div>
                                <div className="col-sm-12">
                                    <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                        Payment method:<span style={{ marginLeft: '4%' }}>{sp?.paymentMethod}</span>
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
        </div>
    );
}
