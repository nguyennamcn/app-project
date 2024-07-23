import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Input, Button, notification, DatePicker } from 'antd';
import './Diamond.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Spinner from '../../Components/Spinner/Spinner';
const currentDate = moment();

export default function SettingDiamondPrice() {
  const [listDiamond, setListDiamond] = useState([]);
  const [diamondPrices, setDiamondPrices] = useState([]);
  const [selectedDiamond, setSelectedDiamond] = useState({});
  const [updatedBuyPrice, setUpdatedBuyPrice] = useState('');
  const [updatedSellPrice, setUpdatedSellPrice] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createEffectDate, setCreateEffectDate] = useState(null);
  const [createBuyPrice, setCreateBuyPrice] = useState();
  const [createSellPrice, setCreateSellPrice] = useState();

  const [createByOrigin, setCreateByOrigin] = useState();
  const [createByColor, setCreateByColor] = useState();
  const [createByClarity, setCreateByClarity] = useState();
  const [createByCut, setCreateByCut] = useState();
  const [createByCarat, setCreateByCarat] = useState();
  const [loading, setLoading] = useState(true);
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
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
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
        notification.success({ message: "Chỉnh sửa giá thành công" });

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

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreate = () => {
    if (isNaN(createByCarat) || createByCarat === '') {
      notification.error({ message: "Khối lượng phải là một số hợp lệ" });
      return; 
    }

    const dataCreateWithEffectDate = {
      origin: createByOrigin,
      color: createByColor,
      clarity: createByClarity,
      cut: createByCut,
      carat: parseFloat(createByCarat),
      sellPrice: createSellPrice,
      buyPrice: createBuyPrice,
      effectDate: createEffectDate ? createEffectDate.valueOf() : 0
    }; 

    adornicaServ.postDiamondPrice(dataCreateWithEffectDate)
    .then(response => {
      console.log(response.data.metadata);
      notification.success({ message: "Tạo giá mới thành công" });
      setIsCreateModalVisible(false);
      fetchDiamondList(); // Refresh the list
    })
    .catch(error => {
      const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
      notification.error({ message: errorMessage });
      console.log(error);
    });

  };

  const closestEffectDate = findClosestDate(diamondPrices);
  const sortedDiamondPrices = [...diamondPrices].sort((a, b) => new Date(a.effectDate) - new Date(b.effectDate));


  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="DiamondPrice-container">
      <h2 className="DiamondPrice-header">Tùy chỉnh giá Kim cương</h2>
      <select className='selectMaterial-diamond' onChange={(e) => handleDiamondChange(e.target.value)}>
        {listDiamond.map((diamond) => (
          <option key={diamond.gemId} value={diamond.gemId}>
            {diamond.color} - {diamond.clarity} - {diamond.cut} - {diamond.origin} - {diamond.carat}
          </option>
        ))}
      </select>
      <button className="btnCreate" onClick={showCreateModal}>Tạo ngày thay đổi giá</button>
      <div className="DiamondPrice-tableContainer">
        <table className="DiamondPrice-table">
          <thead>
            <tr>
              <th className="DiamondPrice-th">ID</th>
              <th className="DiamondPrice-th">Nguồn gốc</th>
              <th className="DiamondPrice-th">Màu sắc</th>
              <th className="DiamondPrice-th">Độ tinh khiết</th>
              <th className="DiamondPrice-th">Vết cắt</th>
              <th className="DiamondPrice-th">Khối lượng</th>
              <th className="DiamondPrice-th">Giá thu mua (VND)</th>
              <th className="DiamondPrice-th">Giá bán (VND)</th>
              <th className="DiamondPrice-th">Ngày hiệu lực</th>
            </tr>
          </thead>
          <tbody>
            {sortedDiamondPrices.map((price, index) => (
              <tr
                    key={index}
                    onClick={() => showModal(price)}
                    className={`DiamondPrice-row ${index % 2 === 0 ? 'DiamondPrice-rowEven' : 'DiamondPrice-rowOdd'} ${price.effectDate === closestEffectDate ? 'DiamondPrice-closestEffectDate' : ''}`}
                  >
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
        <button className="btnBack-diamond" onClick={handleBack}>Trở về</button>
      </div>

      <Modal
        title={<center><h1>Chỉnh sửa giá Kim cương</h1></center>}
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <h2>ID: {selectedDiamond.id}</h2>
        <h2>Kim cương: {selectedDiamond.color} - {selectedDiamond.clarity} - {selectedDiamond.cut} - {selectedDiamond.origin} - {selectedDiamond.carat}</h2>
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
            step={1000}
          />
        </div>
      </Modal>

      <Modal
        title={<center><h1>Tạo giá mới</h1></center>}
        visible={isCreateModalVisible}
        style={{ marginRight:'22%' }}
        onOk={handleCreate}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        <div>
              <label className='lable-create-modal'>Màu sắc:</label>
              <select className='select-create-modal'  value={createByColor} onChange={(e) => setCreateByColor(e.target.value)}>
                <option value=""></option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
              </select>
              </div>
              <div>
              <label className='lable-create-modal'>Vết cắt:</label>
              <select className='select-create-modal'  value={createByCut} onChange={(e) => setCreateByCut(e.target.value)}>
                <option value=""></option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
              </select>
              </div>
              <div>
              <label className='lable-create-modal'>Độ tinh khiết:</label>
              <select className='select-create-modal' value={createByClarity} onChange={(e) => setCreateByClarity(e.target.value)}>
                <option value=""></option>
                <option value="FL">FL</option>
                <option value="IF">IF</option>
                <option value="VVS1">VVS1</option>
                <option value="VVS2">VVS2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
                <option value="SI1">SI1</option>
                <option value="SI2">SI2</option>
                <option value="I1">I1</option>
                <option value="I2">I2</option>
                <option value="I3">I3</option>
              </select>
              </div>
          <div>
              <label className='lable-create-modal'>Khối lượng (Carat):</label>
              <input className='select-create-modal' type="number" value={createByCarat} onChange={(e) => setCreateByCarat(e.target.value)} 
                min={0}
                step={0.1}
              />
          </div>
          <div>
              <label className='lable-create-modal' >Nguồn gốc:</label>
              <select className='select-create-modal'  value={createByOrigin} onChange={(e) => setCreateByOrigin(e.target.value)}>
                <option value=""></option>
                <option value="TỰ NHIÊN">TỰ NHIÊN</option>
                <option value="NHÂN TẠO">NHÂN TẠO</option>
              </select>
          </div>
    
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
}
