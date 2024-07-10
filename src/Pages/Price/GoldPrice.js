import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useNavigate } from 'react-router-dom';
import './GoldPrice.css';
import { useSelector } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';

export default function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState([]);
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
  const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
  const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');
  const isStaff = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_SALES_STAFF');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adornicaServ.getPriceMaterial()
      .then((res) => {
        console.log(res.data.metadata);
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, []);

  const handleSetting = () => {
    navigate('/settingGoldPrice');
  };

  const currentDate = new Date().toLocaleDateString();
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="gold-price-container">
      <h2 className="gold-price-header">GOLD PRICE - {currentDate}</h2>
      <table className="gold-price-table">
        <thead>
          <tr>
            <th className="gold-price-th">Name</th>
            <th className="gold-price-th">Purchase (VND)</th>
            <th className="gold-price-th">Sell (VND)</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((material, index) => (
            <tr key={index} className={index % 2 === 0 ? 'rowEven' : 'rowOdd'}>
              <td data-label="Name" className="gold-price-td">{material.materialName}</td>
              <td data-label="Purchase (VND)" className="gold-price-td">{formatPrice(material.materialBuyPrice)}</td>
              <td data-label="Sell (VND)" className="gold-price-td">{formatPrice(material.materialSellPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isManager ? (<button className="btnSetting-gold" onClick={handleSetting}>Setting</button>) : null}  
    </div>
      )
    }
</>
    
  );
};


