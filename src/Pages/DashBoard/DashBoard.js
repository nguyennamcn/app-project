import React, { useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import TrafficChart from './TrafficChart';
import RevenueChart from './RevenueChart';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import './DashBoard.css';

export default function DashBoard() {
  const [data, setData] = useState({
    ordersSold: 500,
    repeatOrders: 150,
    diamondSold: 200,
    goldSold: 300,
    jewelrySold: 100,
    topEmployee: 'John Doe',
    dailyRevenue: [
      { day: 'Monday', revenue: 500 },
      { day: 'Tuesday', revenue: 700 },
      { day: 'Wednesday', revenue: 300 },
      { day: 'Thursday', revenue: 900 },
      { day: 'Friday', revenue: 600 },
      { day: 'Saturday', revenue: 800 },
      { day: 'Sunday', revenue: 1000 },
    ],
    monthlyRevenue: [
      { month: 'January', revenue: 5000 },
      { month: 'February', revenue: 7000 },
      { month: 'March', revenue: 8000 },
      { month: 'April', revenue: 9000 },
      { month: 'May', revenue: 6000 },
      { month: 'June', revenue: 7000 },
      { month: 'July', revenue: 8000 },
      { month: 'August', revenue: 9000 },
      { month: 'September', revenue: 6000 },
      { month: 'October', revenue: 7000 },
      { month: 'November', revenue: 8000 },
      { month: 'December', revenue: 9000 },
    ],
  });

  const salesData = [
    { name: 'Diamonds Sold', value: data.diamondSold },
    { name: 'Gold Sold', value: data.goldSold },
    { name: 'Jewelry Sold', value: data.jewelrySold },
  ];

  const ordersData = [
    { name: 'Bill Orders', value: data.ordersSold },
    { name: 'Purchase Orders', value: data.repeatOrders },
  ];

  return (
    <div className="dashboard-container">
      <h1>DashBoard</h1>
      <Row gutter={16} className="stat-row">
        <Col span={8}>
          <Card className="stat-card orders-sold-card">
            <Statistic title="Sell Orders " value={data.ordersSold} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card repeat-orders-card">
            <Statistic title="Purchase Orders" value={data.repeatOrders} />
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
      <div className="chart-container">
        <h2>Daily Revenue</h2>
        <RevenueChart data={data.dailyRevenue} />
      </div>
      <div className="chart-container">
        <h2>Monthly Revenue</h2>
        <MonthlyRevenueChart data={data.monthlyRevenue} />
      </div>
    </div>
  );
}
