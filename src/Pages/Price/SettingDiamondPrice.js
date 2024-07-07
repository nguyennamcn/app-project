import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, Button, notification } from 'antd';
import './Diamond.css';
import { useNavigate } from 'react-router-dom';

export default function SettingDiamondPrice() {
  const [listDiamond, setListDiamond] = useState([]);
  const [diamondPrices, setDiamondPrices] = useState([]);
  const [selectedDiamond, setSelectedDiamond] = useState({});
  const [updatedBuyPrice, setUpdatedBuyPrice] = useState('');
  const [updatedSellPrice, setUpdatedSellPrice] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDiamondList();
  }, []);

  const fetchDiamondList = () => {
    adornicaServ.getPriceDiamond()
      .then((res) => {
        console.log(res.data.metadata);
        setListDiamond(res.data.metadata);
        if (res.data.metadata.length > 0) {
          handleDiamondChange(res.data.metadata[0].gemId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDiamondChange = (diamondId) => {
    adornicaServ.getPriceDiamondExceptEffectDate(diamondId)
      .then((res) => {
        console.log(res.data.metadata);
        setDiamondPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    const dataUpdate = {
      priceSell: updatedSellPrice,
      priceBuy: updatedBuyPrice,
      effectDate: 0, // Assuming effectDate is handled elsewhere
    };

    adornicaServ.putDiamondPrice(selectedDiamond.id, dataUpdate)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Updated price successfully" });

        setDiamondPrices(prevPrices =>
          prevPrices.map(price =>
            price.id === selectedDiamond.id
              ? {
                  ...price,
                  gemBuyPrice: updatedBuyPrice,
                  gemSellPrice: updatedSellPrice,
                }
              : price
          )
        );
        setIsModalVisible(false);
        handleDiamondChange(selectedDiamond.gemId);
        console.log("selectedDiamond", selectedDiamond);
      })
      .catch(error => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(error);
      });
  };

  const handleBack = () => {
    navigate('/diamond-price');
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const showModal = (diamond) => {
    setSelectedDiamond(diamond);
    setUpdatedBuyPrice(diamond.gemBuyPrice);
    setUpdatedSellPrice(diamond.gemSellPrice);
    setIsModalVisible(true);
  };

  const sortedDiamondPrices = [...diamondPrices].sort((a, b) => new Date(a.effectDate) - new Date(b.effectDate));


  return (
    <div className="DiamondPrice-container">
      <h2 className="DiamondPrice-header">SETTING DIAMOND PRICE</h2>
      <select className='selectMaterial-diamond' onChange={(e) => handleDiamondChange(e.target.value)}>
        {listDiamond.map((diamond) => (
          <option key={diamond.gemId} value={diamond.gemId}>
            {diamond.color} - {diamond.clarity} - {diamond.cut} - {diamond.origin} - {diamond.carat}
          </option>
        ))}
      </select>
      <div className="DiamondPrice-tableContainer">
        <table className="DiamondPrice-table">
          <thead>
            <tr>
              <th className="DiamondPrice-th">ID</th>
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
            {sortedDiamondPrices.map((price, index) => (
              <tr key={index} onClick={() => showModal(price)} className={index % 2 === 0 ? 'DiamondPrice-rowEven' : 'DiamondPrice-rowOdd'}>
                <td data-label="STT" className="DiamondPrice-td-toClick">{price.id}</td>
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
        <button className="btnBack-diamond" onClick={handleBack}>Back</button>
      </div>

      <Modal
        title={<center><h1>UPDATE PRICE</h1></center>}
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <h2>Price ID: {selectedDiamond.id}</h2>
        <h2>Diamond: {selectedDiamond.color} - {selectedDiamond.clarity} - {selectedDiamond.cut} - {selectedDiamond.origin} - {selectedDiamond.carat}</h2>
        <div>
          <label style={{fontWeight:600, fontSize:'16px'}}>Purchase (VND): </label>
          <Input
            value={updatedBuyPrice}
            onChange={(e) => setUpdatedBuyPrice(e.target.value)}
            type="number"
            step={1000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label style={{fontWeight:600, fontSize:'16px'}}>Sell (VND): </label>
          <Input
            value={updatedSellPrice}
            onChange={(e) => setUpdatedSellPrice(e.target.value)}
            type="number"
            step={1000}
          />
        </div>
      </Modal>

    </div>
  );
}
