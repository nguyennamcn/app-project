import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CashierUpdateOrder() {
    const [products, setProducts] = useState([]);
    const [productsUpdated, setProductsUpdated] = useState([]);
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
                const orderList = res.data.metadata.list.map(item => ({
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

    const handlRemove = (productId) => {
        const updatedProducts = products.filter(product => product.productId !== productId);
        console.log('update product: ',updatedProducts);
        setProductsUpdated(updatedProducts);
        setProducts(updatedProducts);
        calculateTotals(updatedProducts);
        console.log(products);
    };

    const calculateTotals = (products) => {
        const totalAllPrice = products.reduce((sum, product) => sum + product.price, 0);
        setTotalAllPrice(totalAllPrice);
    };

    const handleUpdateOrder = () => {
        const orderList = 
        productsUpdated.map(product => ({
                productId: product.productId,
                price: product.price,
            }));
        

        const orderData = {
            orderCode: orderKey,
            staffId: userInfo.id,
            phone: userInfo.name,
            name: userInfo.phone,
            orderList: orderList,
            totalPrice: totalAllPrice
        };

        console.log(orderData);
        adornicaServ.updatePreOrder(orderData)
            .then((res) => {
                console.log('Order updated successfully:', res);
                console.log(orderList);
            })
            .catch((err) => {
                console.error('Error updating order:', err.response); // Log error details
            });

        alert("Update successfully");
    };

    // Define table columns
    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handlRemove(record.productId)}>Delete</Button>
            ),
        },
    ];

    return (
        <div>
            <div className='container'>
                <div className='row justify-center'>
                    <div className='col-sm-12'>
                        <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500' }}>Update order: #{orderKey}</h1>
                    </div>
                    <div className='col-sm-11 mb-4'>
                        <Table dataSource={products} columns={columns} pagination={false} scroll={{ y: 320 }} style={{maxHeight:'300px'}}/>
                    </div>

                    <div style={{position:'absolute', bottom:'130px'}} className='col-sm-12'><h1>Total: {totalAllPrice}</h1></div>
                    <hr />
                    <div className='row col-sm-12 justify-center' style={{position:'absolute', bottom:'74px'}}>
                        <NavLink to='/cashierListOrder'>
                            <button style={{
                                padding: '15px 40px',
                                background: 'red',
                                borderRadius: '10px',
                                color: 'white',
                                marginRight: '70px'
                            }}>Back</button>
                        </NavLink>

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
