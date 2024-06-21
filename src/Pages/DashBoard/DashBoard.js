import React, { useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import TrafficChart from './TrafficChart';
import './DashBoard.css';

export default function DashBoard() {
  const [data, setData] = useState({
    ordersSold: 500,
    repeatOrders: 150,
    diamondSold: 200,
    goldSold: 300,
    jewelrySold: 100,
    topEmployee: 'John Doe',
  });

  const salesData = [
    { name: 'Diamonds Sold', value: data.diamondSold },
    { name: 'Gold Sold', value: data.goldSold },
    { name: 'Jewelry Sold', value: data.jewelrySold },
  ];

  const ordersData = [
    { name: 'Orders Sold', value: data.ordersSold },
    { name: 'Repeat Orders', value: data.repeatOrders },
  ];

  return (
    <div className="dashboard-container">
      <h1>DashBoard</h1>
      <Row gutter={16} className="stat-row">
        <Col span={8}>
          <Card className="stat-card orders-sold-card">
            <Statistic title="Orders Sold" value={data.ordersSold} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card repeat-orders-card">
            <Statistic title="Repeat Orders" value={data.repeatOrders} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card top-employee-card">
            <Statistic title="Top Employee" value={data.topEmployee} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="stat-row">
        <Col span={8}>
          <Card className="stat-card diamond-sold-card">
            <Statistic title="Diamonds Sold" value={data.diamondSold} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card gold-sold-card">
            <Statistic title="Gold Sold" value={data.goldSold} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card jewelry-sold-card">
            <Statistic title="Jewelry Sold" value={data.jewelrySold} />
          </Card>
        </Col>
      </Row>
      <div className="chart-container">
        <h2>Sales Distribution</h2>
        <TrafficChart salesData={salesData} ordersData={ordersData} />
      </div>
    </div>
  );
}
