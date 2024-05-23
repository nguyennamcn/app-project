import React, { useEffect, useState } from 'react'
import { adornicaServ } from '../../service/adornicaServ';
import { Tabs } from 'antd';

const onChange = (key) =>{
  console.log(key);
};

const items = [
  {
    key: '1',
    label: `Tab 1`,
    children: `Content of Tab Pane 1`,
  },
];

export default function TestPage() {
  const [sanpham, setSanpham] = useState([]);
  useEffect(() => {
    adornicaServ.getDetailProduct()
      .then((res) => {
        setSanpham(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])
  let renderSanpham = () => {
    return sanpham.map((sp) => {
      return {
        key: sp.id,
        label: <img
          className='h-16'
          src={sp.gemCost} alt="" />,
      };
    })
  }
  return (
    <div id='tab' className='container'>
      <h1>Trang này để test</h1>
      {sanpham.name}
      {sanpham.order}
      {/* <Tabs
        tabPosition='left'
        defaultActiveKey="1"
        items={renderSanpham()}
        onChange={onChange} /> */}
    </div>
  );
}
