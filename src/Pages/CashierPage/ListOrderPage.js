import { Table } from 'antd';
import React from 'react';

const dataSource = [
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
  ];
  
  const columns = [
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
        dataIndex: 'action',
        key: 'action',
        render: () => <a style={{backgroundColor:'green', padding: '8px', textDecoration:'none', color:'white', borderRadius:'10px'}} href='#'>View</a>,
      },
  ];
  


export default function ListOrderPage() {
    return(
        <div>
            <div className='title'>
            <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin:'10px 0 20px 0', }}>List Order</h1>
                <div style={{backgroundColor:'black', width:'96%', height:'1px', marginLeft:'22px',}}></div>
            </div>
            
            <div>
            <Table style={{margin:'30px 60px 0 60px'}} dataSource={dataSource} columns={columns} />;
            </div>
        </div>
    );
}