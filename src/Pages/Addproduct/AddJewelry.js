import React, { useState } from 'react';
import { Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';

function AddJewelry() {
  const [newJewelry, setNewJewelry] = useState({
    productName: '',
    productId: '',
    productImages: [],
    jewelryType: '',
    material: '',
    carat: '',
    productionCost: '',
    purchasePrice: '',
    sellingPrice: '',
    productCategory: '',
    addingDay: '',
    productQuantity: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJewelry({ ...newJewelry, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewJewelry({ ...newJewelry, productImages: Array.from(e.target.files) });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setModalMessage('Jewelry added successfully!');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-jewelry-container">
      <div className="add-jewelry-content">
        <div className="add-jewelry-form">
          <h2 className="add-jewelry-title">ADD JEWELRY</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newJewelry.productName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Jewelry Type:</label>
                <input type="text" name="jewelryType" value={newJewelry.jewelryType} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Material:</label>
                <input type="text" name="material" value={newJewelry.material} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="text" name="carat" value={newJewelry.carat} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Production Cost:</label>
                <input type="text" name="productionCost" value={newJewelry.productionCost} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Purchase Price:</label>
                <input type="text" name="purchasePrice" value={newJewelry.purchasePrice} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Selling Price:</label>
                <input type="text" name="sellingPrice" value={newJewelry.sellingPrice} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageJewelry" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">ADD JEWELRY</button>
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

export default AddJewelry;


