import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Policy.css';

const policies = [
  {
    title: 'Refund Policy',
    content: 'Our refund policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it.'
  },
  {
    title: 'Warranty Exchange Policy',
    content: 'All our products come with a six-month warranty. If you experience any issues with your product, you can exchange it for a new one within this period.'
  },
  {
    title: 'Customer Loyalty Policy',
    content: 'Our loyalty program rewards you for every purchase. You earn points that can be redeemed for discounts on future orders. Sign up today to start earning!'
  },
  {
    title: 'Customer Information Security Policy',
    content: 'We take your privacy seriously. All your personal information is stored securely and is never shared with third parties without your consent.'
  },
  {
    title: 'Personal Data Processing Policy',
    content: 'We process personal data in accordance with applicable laws and regulations. We ensure that your data is handled responsibly and ethically.'
  }
];

const Policy = ({ title, content }) => (
  <div className="policy">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

const App = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/homepage');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Our Policies</h1>
        <button className="close-btn" onClick={handleGoHome}>X</button>
      </header>
      <div className="policies">
        {policies.map((policy, index) => (
          <Policy key={index} title={policy.title} content={policy.content} />
        ))}
      </div>
    </div>
  );
};

export default App;
