import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, useNavigate } from 'react-router-dom';

export default function BuyDetail(){
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

    const handleQuantityChange = (key, change) => {
        setProducts(prevProducts => {
            return prevProducts.map(item => {
                if (item.productId === key) {
                    const newQuantity = item.quantity + change;
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
        });
    };

    const handleSubmit = () => {
        const orderData = {
            keyProOrder: orderKey,
            staffId: 1, // Assuming staffId is 1 for now
            phone: customerPhone,
            name: customerName,
            orderList: products.map(product => ({
                productId: product.productId,
                sizeId: product.sizeId,
                quantity: product.quantity,
            })),
            paymentMethod: paymentMethod,
            discount: discount,
            totalPrice: totalPrice - (totalPrice * discount / 100)
        };

        adornicaServ.postSummit(orderData)
            .then((res) => {
                console.log('Order submitted successfully:', res.data);
                navigate('/homePage'); // Navigate to the orders page or another page after successful submission
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
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Button size='medium' onClick={() => handleQuantityChange(record.productId, -record.quantity)}>Delete</Button>
            ),
        },
    ];

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0', }}>Buy products</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px', }}></div>
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
                        <label>Name<input style={{ marginLeft: '10%' }} type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></label>
                        <label>Phone<input style={{ marginLeft: '9.6%' }} type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></label>
                        <label>Date of sale:<h1 style={{ marginLeft: '2.4%', display:'inline-block', }} type="text" value={customerPhone} /*onChange={(e) => setCustomerPhone(e.target.value)}*/ >20/3/2024</h1></label>
                        <label>Payment methods<select style={{ marginLeft: '2%' }} value={paymentMethod} /*onChange={(e) => setPaymentMethod(e.target.value)}*/>
                            <option value='CASH'>Cash</option>
                            <option value='BANKING'>Banking</option>
                        </select></label>
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
                            <div className="col-sm-12"><h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>Total:<span style={{ marginLeft: '4%', textDecoration: 'line-through' }}>{(totalPrice).toFixed(2)} VND</span><span style={{ marginLeft: '4%', color: 'orange' }}>{(totalPrice - (totalPrice * discount / 100)).toFixed(2)} VND</span></h1></div>
                        </div>
                    </div>

                    <div className="col-sm-12 flex justify-center mt-6">
                    <a href='/buyproducts'><Button
                        style={{padding:'0 56px 0 56px', marginRight:'30px'}}
                            size="large"
                            danger
                        >Back</Button></a>
                       
                        <Button
                            size="large"
                            htmlType='submit'
                            onClick={handleSubmit}
                            style={{ padding:'0 60px', marginLeft:'30px'}}            
                        >Finish</Button> 
                        
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