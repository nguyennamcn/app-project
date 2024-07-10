import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';
const Spinner = () => (
  <Space
    style={{
      background: "black",
      opacity: '0.5',
      position: 'absolute',
      top : '0',
      left: '0',
      width:'100%',
      height:'100%',
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 160,
          }}
          spin
        />
      }
    />
  </Space>
);
export default Spinner;