import React, { useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import RevenueChart from './RevenueChart';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import './DashBoard.css';

export default function DashBoard() {
  const [data, setData] = useState({
    yesterday: 800,
    today: 1500,
    thisMonth: 30000,
    staffMostOrders: 'John Doe',
    lastMonth: 19700,
  });

  const dailyRevenueData = [
    { day: 'Yesterday', revenue: data.yesterday },
    { day: 'Today', revenue: data.today },
  ];

  const monthlyRevenueData = [
    { month: 'Last Month', revenue: data.lastMonth },
    { month: 'This Month', revenue: data.thisMonth },
  ];

  return (
    <div className="dashboard-container">
      <h1>DashBoard</h1>
      <Row gutter={16} className="stat-row">
        <Col span={8}>
          <Card className="stat-card orders-sold-card">
            <Statistic title="Total Amount Yesterday" value={data.yesterday} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card repeat-orders-card">
            <Statistic title="Total Amount Today" value={data.today} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card top-employee-card">
            <Statistic title="Staff with Most Orders" value={data.staffMostOrders} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="stat-row">
        <Col span={8}>
          <Card className="stat-card gold-sold-card">
            <Statistic title="Total Amount Last Month" value={data.lastMonth} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card diamond-sold-card">
            <Statistic title="Total Amount This Month" value={data.thisMonth} />
          </Card>
        </Col>
        
      </Row>
      <div className="chart-container">
        <h2>Daily Revenue</h2>
        <RevenueChart data={dailyRevenueData} />
      </div>
      <div className="chart-container">
        <h2>Monthly Revenue</h2>
        <MonthlyRevenueChart data={monthlyRevenueData} />
      </div>
    </div>
  );
}
