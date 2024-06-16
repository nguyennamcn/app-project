import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const AboutSystemPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/homepage');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>About Our System</h1>
        <button className="close-btn" onClick={handleGoHome}>X</button>
      </header>
      <div className="content">
        <p>Our system is designed to provide the best shopping experience for our customers. Here are some of the features and benefits:</p>
        <ul>
          <li><strong>Secure Transactions:</strong> We use the latest technology to ensure your information is secure.</li>
          <li><strong>Fast Processing:</strong> Enjoy quick and efficient order processing and delivery.</li>
          <li><strong>Customer Support:</strong> Our support team is always ready to assist you with any questions or concerns.</li>
        </ul>
        <p>Learn more about our system and how it benefits you by visiting our store or contacting our customer service team.</p>
      </div>
    </div>
  );
};

export default AboutSystemPage;
