import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppLogin.css';

const ServicePage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Our Services</h1>
        <button className="close-btn" onClick={handleGoHome}>X</button>
      </header>
      <div className="content">
        <p>We offer a wide range of services to meet all your jewelry needs, including:</p>
        <ul>
          <li><strong>Custom Designs:</strong> Create a unique piece that reflects your personal style.</li>
          <li><strong>Repairs:</strong> Bring your treasured pieces back to life with our expert repair services.</li>
          <li><strong>Appraisals:</strong> Get an accurate valuation of your jewelry for insurance or resale purposes.</li>
          <li><strong>Cleaning:</strong> Keep your jewelry looking its best with our professional cleaning services.</li>
        </ul>
        <p>Visit our store to experience the best in customer service and quality craftsmanship.</p>
      </div>
    </div>
  );
};

export default ServicePage;
