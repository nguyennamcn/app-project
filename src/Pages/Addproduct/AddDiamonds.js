import React, { useState } from 'react';
import { Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddDiamond.css';

function AddDiamond() {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productId: '',
    productImages: [],
    clarity: '',
    color: '',
    cut: '',
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
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewProduct({ ...newProduct, productImages: Array.from(e.target.files) });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setModalMessage('Product added successfully!');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-diamond-container">
      <div className="add-diamond-content">
        <div className="add-diamond-form">
          <h2 className="add-diamond-title">ADD DIAMOND</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newProduct.productName} onChange={handleInputChange} />
              </div>
              <div className="add-diamond-form-group">
                <label>Production Cost:</label>
                <input type="text" name="productionCost" value={newProduct.productionCost} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">     
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Clarity:</label>
                <input type="text" name="clarity" value={newProduct.clarity} onChange={handleInputChange} />
              </div>
              <div className="add-diamond-form-group">
                <label>Color:</label>
                <input type="text" name="color" value={newProduct.color} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Cut:</label>
                <input type="text" name="cut" value={newProduct.cut} onChange={handleInputChange} />
              </div>
              <div className="add-diamond-form-group">
                <label>Carat:</label>
                <input type="text" name="carat" value={newProduct.carat} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Purchase Price:</label>
                <input type="text" name="purchasePrice" value={newProduct.purchasePrice} onChange={handleInputChange} />
              </div>
              <div className="add-diamond-form-group">
                <label>Selling Price:</label>
                <input type="text" name="sellingPrice" value={newProduct.sellingPrice} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-diamond-form-footer">
              <NavLink to="/ManageDiamond" className="add-diamond-back-button">BACK</NavLink>
              <button className="add-diamond-add-button" type="submit">ADD DIAMOND</button>
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

export default AddDiamond;


