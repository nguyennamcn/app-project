import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import './AddGold.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddGold() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: '',
    productName: '',
    categoryId: 5, //id 5: GOLD
    material: 1,
    weight: 0,
    size: 'NONE',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [productImages, setProductImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJewelry({ ...newJewelry, [name]: value });
  };

  const handleImageUpload = (e) => {
    setProductImages(Array.from(e.target.files));
  };
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const productData = {
      productCode: newJewelry.productCode,
      productName: newJewelry.productName,
      gemCost: Number(newJewelry.gemCost),
      productionCost: Number(newJewelry.productionCost),
      gender: "UNISEX",
      categoryId: Number(newJewelry.categoryId),
      materialProductRequests: [
        {
          material: Number(newJewelry.material),
          weight: Number(newJewelry.weight),
        }
      ],
      size: newJewelry.size,
      jewelryDiamond: newJewelry.jewelryDiamond === 'true' || newJewelry.jewelryDiamond === true,
    };

    adornicaServ.postCreateProduct(productData)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({message: "Đã thêm sản phẩm thành công"})
        navigate(0);
      })
      .catch(error => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(error);
      });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-gold-container">
      <div className="add-gold-content">
        <div className="add-gold-form">
          <h2 className="form-title">Thêm sản phẩm từ Vàng</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-gold-form-row">
              <div className="add-gold-form-group">
                <label>Mã sản phẩm:</label>
                <input type="text" name="productCode" placeholder='Hãy nhập mã sản phẩm' value={newJewelry.productCode} onChange={handleInputChange} required/>
              </div>
              <div className="add-gold-form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" name="productName" placeholder='Hãy nhập tên sản phẩm' value={newJewelry.productName} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-gold-form-row">
              <div className="add-gold-form-group">
                <label>Vật liệu:</label>
                <select name="material" value={newJewelry.material} onChange={handleInputChange} >
                  <option value={1}>24K GOLD</option>
                  <option value={2}>18K GOLD</option>
                  <option value={3}>WHITE GOLD</option>
                  <option value={4}>GOLD BARS</option>
                </select>
              </div>
              <div className="add-gold-form-group">
                <label>Khối lượng (gram):</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} min={0.1} step={0.1}/>
              </div>
            </div>
            <div className="form-footer">
              <NavLink to="/ManageGold" style={{
                                            backgroundColor: 'gray',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>Trở về</NavLink>
              <button style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }} type="submit">Thêm sản phẩm</button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        title="Notification"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        className="custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>
  );
}

export default AddGold;