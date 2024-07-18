import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyRevenueChart = ({ data }) => {

  const formatYAxis = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`; // Chia theo tỷ
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`; // Chia theo triệu
    } else {
      return `${value.toFixed(2)}K`; // Chia theo nghìn
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip 
          formatter={(value) => [`Total Amount: ${value.toLocaleString()}`]}
          labelFormatter={(label) => `Ngày: ${label}`}
          contentStyle={{ backgroundColor: 'transparent', fontSize: '16px', padding: '10px', border: 'none' }} // Điều chỉnh kích thước và kiểu dáng của Tooltip
        />
        <Legend />
        <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyRevenueChart;
