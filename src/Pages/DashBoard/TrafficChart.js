import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Row, Col } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#DC7633'];

export default function TrafficChart({ data }) {
  const pieData = [
    { name: 'Diamonds Sold', value: data.diamondSold },
    { name: 'Gold Sold', value: data.goldSold },
    { name: 'Jewelry Sold', value: data.jewelrySold },
  ];

  return (
    <Row gutter={16} align="middle">
      <Col span={12}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Col>
      <Col span={12}>
        <ul>
          {pieData.map((entry, index) => (
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
