import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import RevenueChart from './RevenueChart';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import ProductPieChart from './ProductPieChart';
import './DashBoard.css';
import { adornicaServ } from '../../service/adornicaServ';

export default function DashBoard() {
  const [data, setData] = useState({
    yesterday: 0,
    today: 0,
    thisMonth: 0,
    staffMostOrders: '',
    lastMonth: 0,
    products: {
      jewelry: 0,
      gold: 0,
      diamond: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastMonthRes = await adornicaServ.getTotalLastMonth();
        const thisMonthRes = await adornicaServ.getTotalThisMonth();
        const todayRes = await adornicaServ.getTotalToday();
        const yesterdayRes = await adornicaServ.getTotalYesterday();
        const staffRes = await adornicaServ.getMostStaff();
        const productsRes = await adornicaServ.getCategoryType();

        const productsData = productsRes.data.metadata.reduce((acc, item) => {
          if (item.categoryType === 'JEWELRY') {
            acc.jewelry = item.percentage;
          } else if (item.categoryType === 'GOLD') {
            acc.gold = item.percentage;
          } else if (item.categoryType === 'DIAMOND') {
            acc.diamond = item.percentage;
          }
          return acc;
        }, { jewelry: 0, gold: 0, diamond: 0 });

        setData((prevState) => ({
          ...prevState,
          lastMonth: lastMonthRes.data.metadata,
          thisMonth: thisMonthRes.data.metadata,
          today: todayRes.data.metadata,
          yesterday: yesterdayRes.data.metadata,
          staffMostOrders: staffRes.data.metadata.staffName,
          products: productsData,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const dailyRevenueData = [
    { day: 'Yesterday', revenue: data.yesterday },
    { day: 'Today', revenue: data.today },
  ];

  const monthlyRevenueData = [
    { month: 'Last Month', revenue: data.lastMonth },
    { month: 'This Month', revenue: data.thisMonth },
  ];

  const productData = [
    { name: 'Jewelry', value: data.products.jewelry },
    { name: 'Gold', value: data.products.gold },
    { name: 'Diamond', value: data.products.diamond },
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
      <div className="chart-container">
        <ProductPieChart data={productData} />
      </div>
    </div>
  );
}
