import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, Button } from 'antd';
import './Diamond.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DiamondPrice = () => {
    const [diamondPrices, setDiamondPrices] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div className="DiamondPrice-container">
            <h2 className="DiamondPrice-header">DIAMOND PRICE - {currentDate}</h2>
            <div className="DiamondPrice-tableContainer">
                <table className="DiamondPrice-table">
                    <thead>
                        <tr>
                            <th className="DiamondPrice-th">STT</th>
                            <th className="DiamondPrice-th">Origin</th>
                            <th className="DiamondPrice-th">Color</th>
                            <th className="DiamondPrice-th">Clarity</th>
                            <th className="DiamondPrice-th">Cut</th>
                            <th className="DiamondPrice-th">Carat</th>
                            <th className="DiamondPrice-th">Purchase (VND)</th>
                            <th className="DiamondPrice-th">Sell (VND)</th>
                            <th className="DiamondPrice-th">Date Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diamondPrices.map((price, index) => (
                            <tr key={index} style={{ cursor: 'auto' }} className={index % 2 === 0 ? 'DiamondPrice-rowEven' : 'DiamondPrice-rowOdd'}>
                                <td
                                    data-label="STT"
                                    className="DiamondPrice-td-toClick"
                                >
                                    {index + 1}
                                </td>
                                <td data-label="Origin" className="DiamondPrice-td">{price.origin}</td>
                                <td data-label="Color" className="DiamondPrice-td">{price.color}</td>
                                <td data-label="Clarity" className="DiamondPrice-td">{price.clarity}</td>
                                <td data-label="Cut" className="DiamondPrice-td">{price.cut}</td>
                                <td data-label="Carat" className="DiamondPrice-td">{price.carat}</td>
                                <td data-label="Purchase (VND)" className="DiamondPrice-td">{formatPrice(price.gemBuyPrice)}</td>
                                <td data-label="Sell" className="DiamondPrice-td">{formatPrice(price.gemSellPrice)}</td>
                                <td data-label="Date Update" className="DiamondPrice-td">{formatDate(price.effectDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isManager ? (<button className="btnSetting-diamond" onClick={handleSetting}>Setting</button>) : null}
            </div>


            {/* <Modal title="Update Prices" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <h1>Current price</h1>
                <div>
                    <label>Purchase (VND): </label>
                    <Input 
                        value={updatedPurchase} 
                        //onChange={(e) => setUpdatedPurchase(e.target.value)} 
                        type="number"
                        readOnly
                    />
                </div>
                <div style={{ marginTop: '10px', marginBottom:'14px' }}>
                    <label>Sell (VND): </label>
                    <Input 
                        value={updatedSell} 
                        //onChange={(e) => setUpdatedSell(e.target.value)} 
                        type="number"
                        readOnly
                    />
                </div>

                <h1>New price</h1>
                <div>
                    <label>Purchase (VND): </label>
                    <Input 
                      
                        onChange={(e) => setUpdatedPurchase(e.target.value)} 
                        type="number"
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>Sell (VND): </label>
                    <Input 
                      
                        onChange={(e) => setUpdatedSell(e.target.value)} 
                        type="number"
                    />
                </div>
            </Modal> */}

        </div>
    );
};

export default DiamondPrice;