import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, DatePicker, notification } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './SettingGoldPrice.css';
import Spinner from '../../Components/Spinner/Spinner';

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
  const [createSelectedMaterialName, setCreateSelectedMaterialName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    adornicaServ.getMaterial()
      .then((res) => {
        console.log("List material",res.data.metadata);
        setListMaterial(res.data.metadata);

        if (res.data.metadata.length > 0) {
          handleMaterialChange(res.data.metadata[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });

  }, []);

  const handleMaterialChange = (materialId) => {
    const selectedMaterial = listMaterial.find(material => material.id === materialId);
    setCreateSelectedMaterialId(materialId);
    setCreateSelectedMaterialName(selectedMaterial ? selectedMaterial.material : "");
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
        notification.success({ message: "Chỉnh sửa giá thành công" });

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
        notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
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
    setIsCreateModalVisible(true);
  };

  const handleCreate = () => {
    const now = Date.now(); 

    
    if (createEffectDate < now) {
        notification.error({ message: "Ngày tạo giá phải lớn hơn ngày hiện tại" });
        return; 
    }

    const dataUpdateWithEffectDate = {
      priceSell: createSellPrice,
      priceBuy: createBuyPrice,
      effectDate: createEffectDate ? createEffectDate.valueOf() : 0
    };

    adornicaServ.postMaterialPriceWithEffectDate(createSelectedMaterialId, dataUpdateWithEffectDate)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Tạo thành công" });
        setIsCreateModalVisible(false);
        handleMaterialChange(createSelectedMaterialId);

        //clear input 
        setCreateBuyPrice(null);
        setCreateSellPrice(null);
        setCreateEffectDate(null);
      })
      .catch(error => {
        const errorMessage = "Can not create, please try again !";
        notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
        console.log(error);
      });
  };

  const currentDate = new Date().toLocaleDateString();
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  const formatDate = (milliseconds) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(milliseconds).toLocaleDateString('vi-VN', options);
};

  const sortedGoldPrices = [...goldPrices].sort((a, b) => new Date(a.effectDate) - new Date(b.effectDate));

  const findClosestDate = (dates) => {
    if (dates.length === 0) return null;
    
    const currentDate = moment(); 
  
    let closestDate = null;
    let minDiff = Infinity; 

    dates.forEach(date => {
      const effectDate = moment(date.effectDate);
      
      if (effectDate.isBefore(currentDate, 'day')) {
        const diff = Math.abs(effectDate.diff(currentDate, 'days'));
        if (diff < minDiff) {
          minDiff = diff;
          closestDate = date;
        }
      }
    });
  
    return closestDate ? closestDate.effectDate : null;
  };

  const closestEffectDate = findClosestDate(goldPrices);

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="container-gold">
      <h2 className="header-setting-gold-price">Tùy chỉnh giá Vàng</h2>
      <select className='selectMaterial-gold' onChange={(e) => handleMaterialChange(e.target.value)}>
        {listMaterial.map((material) => (
          <option key={material.id} value={material.id}>{material.material}</option>
        ))}
      </select>
      <button className="btnCreate" onClick={showCreateModal}>Tạo ngày thay đổi giá</button>
      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">Loại vàng</th>
            <th className="th">Giá thu mua (VND)</th>
            <th className="th">Giá bán (VND)</th>
            <th className="th">Ngày hiệu lực</th>
          </tr>
        </thead>
        <tbody>
          {sortedGoldPrices.map((material, index) => (
            <tr key={index} onClick={() => showModal(material)} className={`${index % 2 === 0 ? 'rowEven' : 'rowOdd'} ${material.effectDate === closestEffectDate ? 'highlight' : ''}`}>              <td className="td">{material.id}</td>
              <td className="td">{material.materialName}</td>
              <td className="td">{formatPrice(material.materialBuyPrice)}</td>
              <td className="td">{formatPrice(material.materialSellPrice)}</td>
              <td className="td">{formatDate(material.effectDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btnBack" onClick={() => navigate("/gold-price")}>Trở về</button>
      <Modal
        title={<center><h1>Tùy chỉnh giá Vàng</h1></center>}
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
      >
        <h2>ID: {selectedMaterial.id}</h2>
        <h2>Loại vàng: {selectedMaterial.materialName}</h2>
        <div>
          <label style={{fontWeight:600, fontSize:'16px'}}>Giá thu mua (VND): </label>
          <Input
            value={updatedBuyPrice}
            onChange={(e) => setUpdatedBuyPrice(e.target.value)}
            type="number"
            step={1000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label style={{fontWeight:600, fontSize:'16px'}}>Giá bán (VND): </label>
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
        title={<center><h1>Tạo giá mới</h1></center>}
        visible={isCreateModalVisible}
        onOk={handleCreate}
        onCancel={handleCancel}
      >
    
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label style={{fontWeight:600, fontSize:'16px'}}>Ngày hiệu lực:</label>
          <DatePicker
            style={{ marginLeft: '10px' }}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) => setCreateEffectDate(date)}
          />
        </div>

        <div>
          <label style={{fontWeight:600, fontSize:'16px'}}>Giá thu mua (VND): </label>
          <Input
            value={createBuyPrice}
            onChange={(e) => setCreateBuyPrice(e.target.value)}
            type="number"
            min={1000}
            step={10000}
          />
        </div>
        <div style={{ marginTop: '10px', marginBottom: '0px' }}>
          <label style={{fontWeight:600, fontSize:'16px'}}>Giá bán (VND): </label>
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
      )
    }
</>
    
  );
};
