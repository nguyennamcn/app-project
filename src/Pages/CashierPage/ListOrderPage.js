import { Table, Button, Flex } from 'antd';
import React, { useState } from 'react';

const initialDataSource = [
    {
        key: '1',
        customer: 'Mike',
        orderCode: '#10003',
        date: '20/3/2024',
    },
    {
        key: '2',
        customer: 'John',
        orderCode: '#10004',
        date: '20/3/2024',
    },
    {
        key: '3',
        customer: 'John',
        orderCode: '#10005',
        date: '20/3/2024',
    },
    {
        key: '4',
        customer: 'John',
        orderCode: '#10006',
        date: '20/3/2024',
    },
    {
        key: '5',
        customer: 'John',
        orderCode: '#10007',
        date: '20/3/2024',
    },
    {
        key: '6',
        customer: 'John',
        orderCode: '#10008',
        date: '20/3/2024',
    },
    {
        key: '7',
        customer: 'John',
        orderCode: '#10009',
        date: '20/3/2024',
    },
    {
        key: '8',
        customer: 'John',
        orderCode: '#10010',
        date: '20/3/2024',
    },
    {
        key: '9',
        customer: 'John',
        orderCode: '#10011',
        date: '20/3/2024',
    },
    {
        key: '10',
        customer: 'John',
        orderCode: '#10012',
        date: '20/3/2024',
    },
];

const columns = (handleDelete) => [
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
    },
    {
        title: 'Order Code',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => (
            <div style={{width:'50%', display:'flex',}}>
                <Button style={{marginRight:'14px'}}
                    type="primary" 
                    href='/cashierOrderDetail'
                >
                    View
                </Button>
                <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleDelete(record.key)}
                >
                    Delete
                </Button>
            </div>
        ),
    },
];

export default function ListOrderPage() {
    const [dataSource, setDataSource] = useState(initialDataSource);

    const handleDelete = (key) => {
        const newDataSource = dataSource.filter((item) => item.key !== key);
        setDataSource(newDataSource);
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
                    columns={columns(handleDelete)}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
}