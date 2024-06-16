import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import './DashBoard.css';

const { Meta } = Card;

export default function DashBoard() {
  const [data, setData] = useState({
    feedback: 230,
    employees: 69,
    customers: 239,
    productsPurchased: 50,
    productsSold: 250
  });

  return (
    <div className="dashboard-container">
      <h1>DashBoard</h1>
      <div className="card-container">
        <div className="card-row">
          <Card className="card feedback-card">
            <Meta title={`${data.feedback} Total Feedback`} description={<button>More Information</button>} />
          </Card>
          <Card className="card employees-card">
            <Meta title={`${data.employees} Total Employees`} description={<button>More Information</button>} />
          </Card>
          <Card className="card customers-card">
            <Meta title={`${data.customers} Total Customers`} description={<button>More Information</button>} />
          </Card>
        </div>
        <div className="card-row">
          <Card className="card products-purchased-card">
            <Meta title={`${data.productsPurchased} Total Products Purchased`} description={<button>More Information</button>} />
          </Card>
          <Card className="card products-sold-card">
            <Meta title={`${data.productsSold} Total Products Sold`} description={<button>More Information</button>} />
          </Card>
        </div>
      </div>
    </div>
  );
}
