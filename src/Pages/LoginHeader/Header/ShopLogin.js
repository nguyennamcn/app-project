import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppLogin.css';

const ShopPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Our Shop</h1>
        <button className="close-btn" onClick={handleGoHome}>X</button>
      </header>
      <div className="content">
        <p>Welcome to our shop! Browse our exclusive collection of fine jewelry, including:</p>
        <ul>
          <li><strong>Rings:</strong> From engagement rings to fashion rings, find the perfect one.</li>
          <li><strong>Necklaces:</strong> Elegant and timeless pieces for every occasion.</li>
          <li><strong>Bracelets:</strong> Stylish designs to complement any outfit.</li>
          <li><strong>Earrings:</strong> Beautifully crafted earrings in various styles and materials.</li>
        </ul>
        <p>Our expert staff is here to help you find the perfect piece for any occasion. Visit us in-store or shop online to explore our full collection.</p>
      </div>
    </div>
  );
};

export default ShopPage;
