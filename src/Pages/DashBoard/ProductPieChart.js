import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#ba2500', '#A569BD', '#FF8042'];

export default function ProductPieChart({ data }) {
  // Format the data values to two decimal places
  const formattedData = data.map(entry => ({
    ...entry,
    value: parseFloat(entry.value.toFixed(2))
  }));

  return (
    <div className="chart-content">
      <div className="chart-description">
        {/* <h2 className="chart-title">Product Distribution</h2> */}
        <ul>
          {formattedData.map((entry, index) => (
            <li key={`item-${index}`}>
              <span style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name} : {entry.value} %
            </li>
          ))}
        </ul>
      </div>
      <PieChart width={200} height={200} className="pie-chart">
        <Pie
          data={formattedData}
          cx={100}
          cy={100}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`Tổng : ${value.toLocaleString()} %`]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ backgroundColor: 'transparent', fontSize: '16px', padding: '10px', border: 'none' }}/>
      </PieChart>
    </div>
  );
}


