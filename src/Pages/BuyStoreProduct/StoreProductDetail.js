import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import "./StoreProductDetail.css";

export default function StoreProductDetail(){
    const [dataSource, setDataSource] = useState([]);
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [discount, setDiscount] = useState(10);
    const [totalPrice, setTotalPrice] = useState(0);
    const { orderKey } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        adornicaServ.getListOrderDetail(orderKey)
            .then((res) => {
                const orderList = res.data.metadata.orderList.map(item => ({
                    ...item,
                    totalPrice: item.quantity * item.price
                }));
                setProducts(orderList);
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

    // Handle quantity change for purchase items
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
        console.log(dataSource)
        localStorage.setItem('cartItems', JSON.stringify(newDataSource));
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
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text, record) => <span>{record.quantity * record.price}</span>,
        },
    ];

    const columnsListPurchase = [
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
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0', }}>Order Code</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px', }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className='col-sm-5' style={{marginTop:'6px'}}>
                        <div className='product__info row'>
                            <div className='col-sm-12'><label>Product code <input type='text' /></label></div>
                            <div className='col-sm-12'><label>Quantity <input type='text' style={{width:'30px', textAlign:'center'}}/></label></div>
                            <div className='col-sm-12'><Button>Add</Button></div>
                            <div className='col-sm-12'><Table dataSource={dataSource} columns={columnsListPurchase} pagination={false} scroll={{ y: 168 }}/></div>
                            <div className='col-sm-12'><label>Purchase price:<h1>70%</h1></label></div>
                            <div className='col-sm-12'><label>Total:<h1>$</h1></label></div>
                        </div>
                    </div>
                    
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
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Customer:<span style={{ marginLeft: '4%' }}>Nguyen Van A</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Phone:<span style={{ marginLeft: '4%' }}>0987654321</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Date of sale:<span style={{ marginLeft: '4%' }}>20/3/2024</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Payment method:<span style={{ marginLeft: '4%', }}>Cash</span></h1></div>
                            </div>
                            <div className='col-sm-6'>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total item:<span style={{ marginLeft: '4%' }}>{products.length}</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Discount:<span style={{ marginLeft: '4%' }}>{discount}%</span></h1></div>
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total:<span style={{ marginLeft: '4%', textDecoration: 'line-through' }}>{(totalPrice).toFixed(2)}$</span><span style={{ marginLeft: '4%', color: 'orange' }}>{(totalPrice - (totalPrice * discount / 100)).toFixed(2)}$</span></h1></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12 flex justify-center mt-6">
                    <NavLink to={"/buyproducts"}>
                        <Button
                        style={{padding:'0 56px 0 56px'}}
                            size="large"
                            danger
                        >Back</Button>
                        </NavLink>
                        <NavLink to='/buyDetail'>
                        <Button
                            size="large"
                            htmlType='submit'
                            style={{ padding:'0 46px', marginLeft:'30px'}}            
                        >Purchase</Button> 
                        </NavLink>     
                        
                    </div>
                </div>

                
            </div>
        </div>
    );
}