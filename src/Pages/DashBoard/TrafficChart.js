import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Row, Col } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#DC7633'];

export default function TrafficChart({ salesData, ordersData }) {
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
