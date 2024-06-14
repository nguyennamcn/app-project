import { Table, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';

const columns = (handleView, handleDelete, handleUpdate) => [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
    },
    {
        title: 'Staff name',
        dataIndex: 'salesStaffName',
        key: 'salesStaffName',
    },
    {
        title: 'orderCode',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'totalPrice',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
    },
    {
        title: 'dateOrder',
        dataIndex: 'dateOrder',
        key: 'dateOrder',
    },
    {
        title: 'paymentMethod',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
    },
    {
        title: 'deliveryStatus',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus',
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => (
            <div style={{ width: '50%', display: 'flex' }}>
                <Button
                    style={{ marginRight: '14px' }}
                    type="primary"
                    onClick={() => handleView(record.orderCode)}
                >
                    <NavLink to={`/cashierOrderDetail/${record.orderCode}`}>View</NavLink>
                </Button>
                <Button 
                    style={{ marginRight: '14px' }}
                    type="primary" 
                    danger 
                    onClick={() => handleDelete(record.orderCode)}
                >
                    Delete
                </Button>

                <Button 
                    type="primary" 
                    style={{backgroundColor:'#74FF33'}}
                >
                    <NavLink to={`/cashierUpdateOrder/${record.orderCode}`}>Update</NavLink>
                </Button>
                
            </div>
        ),
    },
];

export default function ListOrderPage() {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        adornicaServ.getHistoryOrders()
            .then((res) => {
                const orders = res.data.metadata.map((order, index) => ({
                    key: index,
                    salesStaffName: order.salesStaffName,
                    orderId: order.orderId,
                    orderCode: order.orderCode,
                    totalPrice: order.totalPrice,
                    dateOrder: order.dateOrder,
                    paymentMethod: order.paymentMethod,
                    deliveryStatus: order.deliveryStatus,
                }));
                setDataSource(orders);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleDelete = (key) => {
        // Make API request to delete the order
        adornicaServ.deletePreOrder(key)
            .then(() => {
                // If deletion is successful, update the dataSource state by filtering out the deleted order
                const newDataSource = dataSource.filter((item) => item.orderCode !== key);
                setDataSource(newDataSource);
            })
            .catch((err) => {
                console.log("Error deleting order:", err);
                // Handle error if deletion fails
            });
    };

    const handleView = (key) => {
        adornicaServ.getListOrderDetail(key)
            .then((res) => {
                console.log(res.data); // Replace with navigation to detail page if needed
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>List Order</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div>
                <Table
                    style={{ margin: '30px 60px 0 60px' }}
                    dataSource={dataSource}
                    columns={columns(handleView, handleDelete)}
                    pagination={{className:'custom__pagination' ,pageSize: 5 }}
                />
            </div>
        </div>
    );
}
