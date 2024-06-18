import React, { useState } from 'react';
import { Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddGold.css';

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productId: '',
    productImages: [],
    goldType: '',
    weight: '',
    purchasePrice: '',
    sellingPrice: '',
    productGender: '',
    productWeight: '',
    productMaterial: '',
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
    // Xử lý thêm sản phẩm
    setModalMessage('Product added successfully!');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-gold-container">
      <div className="add-gold-content">
        <div className="add-gold-form">
          <h2 className="form-title">Add Product</h2>
          <form onSubmit={handleFormSubmit}>
            {/* <div className="add-product-form-row">
              <div className="add-product-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newProduct.productName} onChange={handleInputChange} />
              </div>
            </div> */}
            {/* <div className="add-gold-form-row">
              <div className="add-gold-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div> */}
            <div className="add-gold-form-row">
              <div className="add-gold-form-group">
                <label>Gold Type:</label>
                <input type="text" name="goldType" value={newProduct.goldType} onChange={handleInputChange} />
              </div>
              <div className="add-gold-form-group">
                <label>Weight:</label>
                <input type="text" name="weight" value={newProduct.weight} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-gold-form-row">
              <div className="add-gold-form-group">
                <label>Purchase Price:</label>
                <input type="text" name="purchasePrice" value={newProduct.purchasePrice} onChange={handleInputChange} />
              </div>
              <div className="add-gold-form-group">
                <label>Selling Price:</label>
                <input type="text" name="sellingPrice" value={newProduct.sellingPrice} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-footer">
              <NavLink to="/ManageGold" className="back-button">Back</NavLink>
              <button className="add-gold-button" type="submit">Add Product</button>
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

export default AddProduct;


