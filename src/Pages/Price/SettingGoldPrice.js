import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, DatePicker, notification } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './SettingGoldPrice.css';

export default function SettingGoldPrice() {
  const [goldPrices, setGoldPrices] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState({});
  const [updatedBuyPrice, setUpdatedBuyPrice] = useState();
  const [updatedSellPrice, setUpdatedSellPrice] = useState();
  const [effectDate, setEffectDate] = useState(null);
  const [createBuyPrice, setCreateBuyPrice] = useState();
  const [createSellPrice, setCreateSellPrice] = useState();
  const [createEffectDate, setCreateEffectDate] = useState(null);
  const [createSelectedMaterialId, setCreateSelectedMaterialId] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    adornicaServ.getMaterial()
      .then((res) => {
        console.log(res.data.metadata);
        setListMaterial(res.data.metadata);

        if (res.data.metadata.length > 0) {
          handleMaterialChange(res.data.metadata[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleMaterialChange = (materialId) => {
    adornicaServ.getPriceMaterialExceptEffectDate(materialId)
      .then((res) => {
        console.log(res.data.metadata);
        setGoldPrices(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    const dataUpdate = {
      priceSell: updatedSellPrice,
      priceBuy: updatedBuyPrice,
      effectDate: 0,
    };

    adornicaServ.putMaterialPrice(selectedMaterial.id, dataUpdate)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Updated price successfully" });

        setGoldPrices(prevPrices =>
          prevPrices.map(material =>
            material.id === selectedMaterial.id
              ? {
                ...material,
                materialBuyPrice: updatedBuyPrice,
                materialSellPrice: updatedSellPrice,
              }
              : material
          )
        );
        setIsModalVisible(false);
        handleMaterialChange(selectedMaterial.materialId);
        console.log("selectedMaterial", selectedMaterial);

      })
      .catch(error => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(error);
        console.log("selectedMaterial", selectedMaterial);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCreateModalVisible(false);
  };

  const showModal = (material) => {
    setSelectedMaterial(material);
    setUpdatedBuyPrice(material.materialBuyPrice);
    setUpdatedSellPrice(material.materialSellPrice);
    setIsModalVisible(true);
  };

  const showCreateModal = () => {
    setCreateSelectedMaterialId(null);
    setCreateBuyPrice(null);
    setCreateSellPrice(null);
    setCreateEffectDate(null);
    setIsCreateModalVisible(true);
  };

  const handleCreate = () => {
    const dataUpdateWithEffectDate = {
      priceSell: createSellPrice,
      priceBuy: createBuyPrice,
      effectDate: createEffectDate ? createEffectDate.valueOf() : 0
    };

    adornicaServ.postMaterialPriceWithEffectDate(createSelectedMaterialId, dataUpdateWithEffectDate)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Added product successfully" });
        setIsCreateModalVisible(false);
        handleMaterialChange(createSelectedMaterialId);
      })
      .catch(error => {
        const errorMessage = "Can not create, please try again !";
        notification.error({ message: errorMessage });
        console.log(error);
      });
  };

  const currentDate = new Date().toLocaleDateString();
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const sortedGoldPrices = [...goldPrices].sort((a, b) => new Date(a.effectDate) - new Date(b.effectDate));

  return (
    <div className="container-gold">
      <h2 className="header">SETTING GOLD PRICE</h2>
      <select className='selectMaterial-gold' onChange={(e) => handleMaterialChange(e.target.value)}>
        {listMaterial.map((material) => (
          <option key={material.id} value={material.id}>{material.material}</option>
        ))}
      </select>
      <button className="btnCreate" onClick={showCreateModal}>Create</button>
      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">Name</th>
            <th className="th">Purchase (VND)</th>
            <th className="th">Sell (VND)</th>
            <th className="th">Effect date</th>
          </tr>
        </thead>
        <tbody>
          {sortedGoldPrices.map((material, index) => (
            <tr key={index} onClick={() => showModal(material)} className={index % 2 === 0 ? 'rowEven' : 'rowOdd'}>
              <td className="td">{material.id}</td>
              <td className="td">{material.materialName}</td>
              <td className="td">{formatPrice(material.materialBuyPrice)}</td>
              <td className="td">{formatPrice(material.materialSellPrice)}</td>
              <td className="td">{formatDate(material.effectDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btnBack" onClick={() => navigate("/gold-price")}>Back</button>
      <Modal
        title="Update price"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
      >
        <h2>Price ID: {selectedMaterial.id}</h2>
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
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label>Sell (VND): </label>
          <Input
            value={updatedSellPrice}
            onChange={(e) => setUpdatedSellPrice(e.target.value)}
            type="number"
            min={1000}
            step={1000}
          />
        </div>
      </Modal>

      <Modal
        title="Create new price for future"
        visible={isCreateModalVisible}
        onOk={handleCreate}
        onCancel={handleCancel}
      >
        <select className='selectMaterial-gold' onChange={(e) => setCreateSelectedMaterialId(e.target.value)}>
          <option value="">Select Material</option>
          {listMaterial.map((material) => (
            <option key={material.id} value={material.id}>{material.material}</option>
          ))}
        </select>

        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label>Effect date:</label>
          <DatePicker
            style={{ marginLeft: '10px' }}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) => setCreateEffectDate(date)}
          />
        </div>

        <div>
          <label>Purchase (VND): </label>
          <Input
            value={createBuyPrice}
            onChange={(e) => setCreateBuyPrice(e.target.value)}
            type="number"
            min={1000}
            step={10000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label>Sell (VND): </label>
          <Input
            value={createSellPrice}
            onChange={(e) => setCreateSellPrice(e.target.value)}
            type="number"
            min={1000}
            step={1000}
          />
        </div>
      </Modal>
    </div>
  );
};
