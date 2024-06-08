import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CashierUpdateOrder() {
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAllPrice, setTotalAllPrice] = useState(0);
    const { orderKey } = useParams();
    console.log(products);


    let userInfo = useSelector((state) => {
        return state.userReducer.userInfo;
      })
    console.log(userInfo);


    useEffect(() => {
        adornicaServ.getListOrderDetail(orderKey)
            .then((res) => {
                const orderList = res.data.metadata.orderList.map(item => ({
                    ...item,
                    totalPrice: item.quantity * item.price
                }));
                setProducts(orderList);
                calculateTotals(orderList);
                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderKey]);

    const handleQuantityChange = (key, change) => {
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.map(item => {
                if (item.productId === key) {
                    const newQuantity = change === 'remove' ? item.quantity =0 : item.quantity + change;
                    if (newQuantity > 0) {
                        return {
                            ...item,
                            quantity: newQuantity,
                            totalPrice: newQuantity * item.price
                        };
                    }
                }
                return item;
            }).filter(item => item.quantity > 0);

            calculateTotals(updatedProducts);
            return updatedProducts;
        });
    };

    const calculateTotals = (products) => {
        const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
        const totalAllPrice = products.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalQuantity(totalQuantity);
        setTotalAllPrice(totalAllPrice);
    };

    const handleUpdateOrder = () => {
        const orderData = {
            keyProOrder: orderKey,
            orderCode: 1,
            staffId: userInfo.id,
            orderList: products.map(product => ({
                productId: product.productId,
                productName: product.productName,
                sizeId: product.sizeId,
                quantity: product.quantity,
                price: product.price,
            })),
            totalPrice: totalAllPrice
        };

        adornicaServ.updatePreOrder(orderData)
            .then((res) => {
                console.log('Order updated successfully:', res);
            })
            .catch((err) => {
                console.error('Error updating order:', err.response); // Log error details
            });
    };

    // Define table columns
    const columns = [
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
                    <Button onClick={() => handleQuantityChange(record.productId, -1)}>-</Button>
                    <span style={{ margin: '0 10px' }}>{record.quantity}</span>
                    <Button onClick={() => handleQuantityChange(record.productId, 1)}>+</Button>
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
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleQuantityChange(record.productId, 'remove')}>Delete</Button>
            ),
        },
    ];

    return (
        <div>
            <div className='container'>
                <div className='row justify-center'>
                    <div className='col-sm-12 mt-6'>
                        <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Update order: #{orderKey}</h1>
                    </div>
                    <div className='col-sm-11 mb-10'>
                        <Table dataSource={products} columns={columns} pagination={false} scroll={{ y: 350 }} />
                    </div>
                    <hr />
                    <div className='row col-sm-12 justify-center'>
                        <button onClick={handleUpdateOrder} style={{
                            padding: '15px 40px',
                            background: '#15B83F',
                            borderRadius: '10px',
                            color: 'white',
                        }}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}