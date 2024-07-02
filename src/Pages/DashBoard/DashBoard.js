import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import ProductPieChart from './ProductPieChart';
import WeeklyRevenueChart from './WeeklyRevenueChart';
import YearlyRevenueChart from './YearlyRevenueChart';
import { adornicaServ } from '../../service/adornicaServ';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashBoard.css';

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
    weeklyRevenue: [],
    yearlyRevenue: [],
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
        const weeklyRes = await adornicaServ.getWeeklyRevenue();
        const yearlyRes = await adornicaServ.getYearlyRevenue();

        const productsData = productsRes.data.metadata.reduce((acc, item) => {
          if (item.categoryType === 'JEWELRY') {
            acc.jewelry = Math.ceil(item.percentage);
          } else if (item.categoryType === 'GOLD') {
            acc.gold = Math.ceil(item.percentage);
          } else if (item.categoryType === 'DIAMOND') {
            acc.diamond = Math.ceil(item.percentage);
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
          weeklyRevenue: weeklyRes.data.metadata,
          yearlyRevenue: yearlyRes.data.metadata,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const dailyAndMonthlyRevenueData = [
    { period: 'Yesterday', dailyRevenue: data.yesterday, monthlyRevenue: null },
    { period: 'Today', dailyRevenue: data.today, monthlyRevenue: null },
    { period: 'Last Month', monthlyRevenue: data.lastMonth },
    { period: 'This Month', monthlyRevenue: data.thisMonth },
  ];

  const productData = [
    { name: 'Jewelry', value: data.products.jewelry },
    { name: 'Gold', value: data.products.gold },
    { name: 'Diamond', value: data.products.diamond },
  ];

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dailyRevenue = payload.find(p => p.dataKey === 'dailyRevenue')?.value;
      const monthlyRevenue = payload.find(p => p.dataKey === 'monthlyRevenue')?.value;

      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Daily Revenue: ${dailyRevenue ? dailyRevenue.toLocaleString() + ' VND' : 'N/A'}`}</p>
          {monthlyRevenue !== undefined && <p className="intro">{`Monthly Revenue: ${monthlyRevenue ? monthlyRevenue.toLocaleString() + ' VND' : 'N/A'}`}</p>}
        </div>
      );
    }
    return null;
  };

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
        <h2>Daily and Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyAndMonthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="dailyRevenue" fill="#8884d8" name="Daily"/>
            <Bar dataKey="monthlyRevenue" fill="#82ca9d" name="Monthly" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
        <ProductPieChart data={productData} />
      </div>
      <div className="chart-container">
        <h2>Weekly Revenue</h2>
        <WeeklyRevenueChart data={data.weeklyRevenue} />
      </div>
      <div className="chart-container">
        <h2>Yearly Revenue</h2>
        <YearlyRevenueChart data={data.yearlyRevenue} />
      </div>
    </div>
  );
}
