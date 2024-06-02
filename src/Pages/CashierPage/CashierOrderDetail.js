import { Button } from "antd";
import React from "react";
import { Table } from 'antd';
import './CashierOrderDetail.css'

const dataSource = [
    {
      key: '1',
      product: 'Italy Ring',
      productCode:'10003',
      quantity: '1',
      price: '2.643,23$',
    },
    {
      key: '2',
      product: '18K Gold Necklace',
      productCode:'13043',
      quantity: '1',
      price: '4.442,50$',
    },
    {
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },{
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },{
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },{
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },{
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },{
        key: '2',
        product: '18K Gold Necklace',
        productCode:'13043',
        quantity: '1',
        price: '4.442,50$',
      },
  ];
  
  const columns = [
    {
        title: 'Product',
        dataIndex: 'product',
        key: 'product',
        render: (text, record) => (
          <>
            {record.product} {record.productCode} x{record.quantity}
          </>
        ),
      },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

export default function ListOrderPage() {
    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0', }}>Order</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px', }}></div>
            </div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="customer__info col-sm-5" style={{ marginRight: '10px', 
                    backgroundColor: 'white', 
                    width: '100px', 
                    height: '400px', 
                    padding:'0',
                    }}>
                        <label>Name<input style={{marginLeft:'10%'}} type="text"/></label>
                        <label>Phone<input style={{marginLeft:'9.6%'}} type="text"/></label>
                        <label>Address<input style={{marginLeft:'7.1%'}} type="text"/></label>
                        <label>Date sell<input style={{marginLeft:'6.2%'}} type="text" disabled/></label>
                        <label>Payment status<select style={{marginLeft:'6.4%'}}>
                                <option>Fully paid</option>
                                <option>Payments in instalments</option>
                            </select></label>
                        <label>Payment methods<select style={{marginLeft:'2%'}}>
                                <option>Cash</option>
                                <option>Banking</option>
                            </select></label>
                    </div>
                    
                    <div className="product__table col-sm-5" 
                    style={{ 
                        marginLeft: '10px', 
                        backgroundColor: 'white', 
                        width: '100px', 
                        height: '400px', 
                        padding:'0',
                        }}>
                            <Table style={{margin:'20px 60px 0 60px'}} dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 168 }}/>
                        <div className="row">
                            <div className="col-sm-12"><h1 style={{fontSize:'16px', fontWeight:'600', margin:'12px 0px 6px 11%'}}>Total item:<span style={{marginLeft:'4%'}}>2</span></h1></div>
                            <div className="col-sm-12"><h1 style={{fontSize:'16px', fontWeight:'600', margin:'12px 0px 6px 11%'}}>Discount:<span style={{marginLeft:'4%'}}>10%</span></h1></div>
                            <div className="col-sm-12"><h1 style={{fontSize:'16px', fontWeight:'600', margin:'12px 0px 6px 11%'}}>Total:<span style={{marginLeft:'4%', textDecoration:'line-through'}}>16.665,21$</span><span style={{marginLeft:'4%', color:'orange'}}>14.700,21$</span></h1></div>
                        </div>
                    </div>

                    <div className="col-sm-12 flex justify-center mt-6">
                        <Button 
                        size="large"
                        htmlType='submit'
                        >Print order</Button>
                    </div>
                </div>

                <div className="stick" style={{
                   position:'absolute',
                   width:'1px',
                   height:'55%',
                   backgroundColor:'black',
                   top:'21%',
                   right:'43.5%', 
                }}></div>
                <h2 style={{position:'absolute', bottom:'12%' ,right:'2%' ,textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '10px 0 20px 0', }}>By statf: To Hoang Trung Hieu</h2>
                <h2 style={{position:'absolute',bottom:'8%' ,right:'11%' ,textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '10px 0 20px 0', }}>Staff ID: 0001</h2>
            </div>
        </div>
    );
}