import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, DatePicker, notification } from 'antd';
import moment from 'moment';

export default function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState({});
  const [updatedBuyPrice, setUpdatedBuyPrice] = useState(0);
  const [updatedSellPrice, setUpdatedSellPrice] = useState(0);
  const [effectDate, setEffectDate] = useState(null);

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

  useEffect(() => {
    adornicaServ.getPriceMaterialExceptEffectDate()
      .then((res) => {
        console.log(res.data.metadata);
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOk = () => {
    const dataUpdateWithEffectDate = {
      priceSell: updatedSellPrice,
      priceBuy: updatedBuyPrice,
      effectDate: effectDate ? effectDate.valueOf() : 0
    };

    adornicaServ.postMaterialPriceWithEffectDate(selectedMaterial.materialId, dataUpdateWithEffectDate)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Add product successfully" });
      })
      .catch(error => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(error);
      });

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = (material) => {
    setSelectedMaterial(material);
    setUpdatedBuyPrice(material.materialBuyPrice);
    setUpdatedSellPrice(material.materialSellPrice);
    setEffectDate(moment());
    setIsModalVisible(true);
  };

  const currentDate = new Date().toLocaleDateString();
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>GOLD PRICE - {currentDate}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Purchase (VND)</th>
            <th style={styles.th}>Sell (VND)</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((material, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td onClick={() => showModal(material)} style={styles.td}>{material.materialName}</td>
              <td style={styles.td}>{formatPrice(material.materialBuyPrice)}</td>
              <td style={styles.td}>{formatPrice(material.materialSellPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="Create new price for future"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h1>Material ID: {selectedMaterial.materialId}</h1>
        <h2>Material Name: {selectedMaterial.materialName}</h2>
        <div>
          <label>Purchase (VND): </label>
          <Input 
            value={updatedBuyPrice}
            onChange={(e) => setUpdatedBuyPrice(e.target.value)} 
            type="number"
            step={1000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom:'0px'}}>
          <label>Sell (VND): </label>
          <Input 
            value={updatedSellPrice}
            onChange={(e) => setUpdatedSellPrice(e.target.value)}
            type="number" 
            step={1000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom:'0px'}}>
          <label>Effect date:</label>
          <DatePicker 
            style={{marginLeft:'10px'}}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date, dateString) => setEffectDate(date)}
          />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: 'yellow',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontSize: '16px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
};
