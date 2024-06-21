import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Row, Col } from 'antd';

const CARD_COLORS = {
  orders: '#0088FE',
  repeatOrders: '#00C49F',
  topEmployee: '#FFBB28',
  diamondSold: '#FF8042',
  goldSold: '#A569BD',
  jewelrySold: '#ba2500'
};

export default function TrafficChart({ salesData, ordersData }) {
  const COLORS = Object.values(CARD_COLORS);

  return (
    <Row gutter={16} align="middle">
      <Col span={12}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ordersData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {ordersData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ul>
          {ordersData.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: COLORS[index % COLORS.length], marginBottom: '10px' }}>
              <span style={{ backgroundColor: COLORS[index % COLORS.length], padding: '5px', borderRadius: '5px', marginRight: '10px' }}></span>
              {entry.name}: {entry.value}
            </li>
          ))}
        </ul>
      </Col>
      <Col span={12}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ul>
          {salesData.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: COLORS[index % COLORS.length], marginBottom: '10px' }}>
              <span style={{ backgroundColor: COLORS[index % COLORS.length], padding: '5px', borderRadius: '5px', marginRight: '10px' }}></span>
              {entry.name}: {entry.value}
            </li>
          ))}
        </ul>
      </Col>
    </Row>
  );
}
