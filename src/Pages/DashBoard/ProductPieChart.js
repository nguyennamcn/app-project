import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#ba2500', '#A569BD', '#FF8042'];

export default function ProductPieChart({ data }) {
  return (
    <div className="chart-content">
      <div className="chart-description">
        <h2 className="chart-title">Product Distribution</h2>
        <ul>
          {data.map((entry, index) => (
            <li key={`item-${index}`}>
              <span style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name} : {entry.value} % 
            </li>
          ))}
        </ul>
      </div>
      <PieChart width={200} height={200} className="pie-chart">
        <Pie
          data={data}
          cx={100}
          cy={100}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
