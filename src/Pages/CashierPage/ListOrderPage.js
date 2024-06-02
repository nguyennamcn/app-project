import { Table, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';

const columns = (handleView, handleDelete) => [
    {
        title: 'Order Key',
        dataIndex: 'orderKey',
        key: 'orderKey',
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
                    onClick={() => handleView(record.orderKey)}
                >
                    <NavLink to={`/cashierOrderDetail/${record.orderKey}`}>View</NavLink>
                </Button>
                <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleDelete(record.orderKey)}
                >
                    Delete
                </Button>
            </div>
        ),
    },
];

export default function ListOrderPage() {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        adornicaServ.getListOrder()
            .then((res) => {
                const orders = res.data.metadata.map((orderKey, index) => ({
                    key: index,
                    orderKey: orderKey,
                }));
                setDataSource(orders);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleDelete = (key) => {
        const newDataSource = dataSource.filter((item) => item.orderKey !== key);
        setDataSource(newDataSource);
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
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
}
