import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useNavigate } from 'react-router-dom';
import './GoldPrice.css';
import { useSelector } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';

export default function ShowGold() {
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

  const currentDate = new Date().toLocaleDateString();
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="sgold-price-container">
            <h2 className="gold-price-header">Giá Vàng - {currentDate}</h2>
            {goldPrices.length > 0 ? (
              <table className="gold-price-table">
                <thead>
                  <tr>
                    <th className="gold-price-th">Loại vàng</th>
                    <th className="gold-price-th">Giá thu mua (VND)</th>
                    <th className="gold-price-th">Giá bán (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {goldPrices.map((material, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'rowEven' : 'rowOdd'}>
                      <td data-label="Loại vàng" className="gold-price-td">{material.materialName}</td>
                      <td data-label="Giá thu mua (VND)" className="gold-price-td">{formatPrice(material.materialBuyPrice)}</td>
                      <td data-label="Giá bán (VND)" className="gold-price-td">{formatPrice(material.materialSellPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h1 className="no-data-message">Giá đang được điều chỉnh</h1>
            )}
          </div>
        </>
      )}
    </>
  );
};
