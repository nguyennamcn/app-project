import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useNavigate } from 'react-router-dom';
import './GoldPrice.css'; 

export default function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adornicaServ.getPriceMaterial()
      .then((res) => {
        console.log(res.data.metadata);
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
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
    <div className="container">
      <button className="btnSetting" onClick={handleSetting}>Setting</button>
      <h2 className="header">GOLD PRICE - {currentDate}</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Purchase (VND)</th>
            <th className="th">Sell (VND)</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((material, index) => (
            <tr style={{cursor:'auto'}} key={index} className={index % 2 === 0 ? 'rowEven' : 'rowOdd'}>
              <td className="td">{material.materialName}</td>
              <td className="td">{formatPrice(material.materialBuyPrice)}</td>
              <td className="td">{formatPrice(material.materialSellPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
