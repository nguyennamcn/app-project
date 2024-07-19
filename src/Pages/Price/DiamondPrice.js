import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, Button } from 'antd';
import './Diamond.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';

const DiamondPrice = () => {
    const [diamondPrices, setDiamondPrices] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.userReducer.userInfo);
    const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
    const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
    const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');
    const isStaff = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_SALES_STAFF');

    useEffect(() => {
        adornicaServ.getPriceDiamond()
            .then((res) => {
                const filteredData = res.data.metadata.filter(price => price.gemBuyPrice && price.gemSellPrice);
                console.log(filteredData);
                setDiamondPrices(filteredData);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSetting = () => {
        navigate('/settingDiamondPrice');
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const currentDate = new Date().toLocaleDateString('vi-VN');
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const groupByCaratRange = (data) => {
        const ranges = {};
        data.forEach(price => {
            const rangeKey = `${Math.floor(price.carat * 2) / 2}-${Math.floor(price.carat * 2 + 1) / 2}`;
            if (!ranges[rangeKey]) {
                ranges[rangeKey] = [];
            }
            ranges[rangeKey].push(price);
        });
        return ranges;
    };

    const caratRanges = groupByCaratRange(diamondPrices);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="DiamondPrice-container">
                    <h2 className="DiamondPrice-header">Giá Kim Cương - {currentDate}</h2>
                    {Object.keys(caratRanges).map((range, idx) => (
                        <div key={idx} className="DiamondPrice-tableContainer">
                            <h3 className="DiamondPrice-rangeHeader">Khối lượng {range} carat</h3>
                            <table className="DiamondPrice-table">
                                <thead>
                                    <tr>
                                        <th className="DiamondPrice-th">STT</th>
                                        <th className="DiamondPrice-th">Nguồn gốc</th>
                                        <th className="DiamondPrice-th">Màu sắc</th>
                                        <th className="DiamondPrice-th">Độ tinh khiết</th>
                                        <th className="DiamondPrice-th">Vết cắt</th>
                                        <th className="DiamondPrice-th">Khối lượng</th>
                                        <th className="DiamondPrice-th">Giá thu mua (VND)</th>
                                        <th className="DiamondPrice-th">Giá bán (VND)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {caratRanges[range].map((price, index) => (
                                        <tr key={index} style={{ cursor: 'auto' }} className={index % 2 === 0 ? 'DiamondPrice-rowEven' : 'DiamondPrice-rowOdd'}>
                                            <td data-label="STT" className="DiamondPrice-td-toClick">{index + 1}</td>
                                            <td data-label="Origin" className="DiamondPrice-td">{price.origin}</td>
                                            <td data-label="Color" className="DiamondPrice-td">{price.color}</td>
                                            <td data-label="Clarity" className="DiamondPrice-td">{price.clarity}</td>
                                            <td data-label="Cut" className="DiamondPrice-td">{price.cut}</td>
                                            <td data-label="Carat" className="DiamondPrice-td">{price.carat}</td>
                                            <td data-label="Purchase (VND)" className="DiamondPrice-td">{formatPrice(price.gemBuyPrice)}</td>
                                            <td data-label="Sell" className="DiamondPrice-td">{formatPrice(price.gemSellPrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    {isManager ? (<button className="btnSetting-diamond" onClick={handleSetting}>Tùy chỉnh</button>) : null}
                </div>
            )}
        </>
    );
};

export default DiamondPrice;
