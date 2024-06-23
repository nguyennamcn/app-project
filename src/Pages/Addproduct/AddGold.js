import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddGold() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: 'None',
    productName: 'None',
    categoryId: 5, //id 5: GOLD
    material: 0,
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const productData = {
      productCode: newJewelry.productCode,
      productName: newJewelry.productName,
      gemCost: Number(newJewelry.gemCost),
      productionCost: Number(newJewelry.productionCost),
      gender: newJewelry.gender,
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
        notification.success({message: "Add product success"})
        console.log(response.data.metadata);
      })
      .catch(error => {
        notification.error({message: error.response.data.metadata.message})
        console.log(error.response.data.metadata.message);
      });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-jewelry-container">
      <div className="add-jewelry-content">
        <div className="add-jewelry-form">
          <h2 className="add-jewelry-title">ADD GOLD</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Code:</label>
                <input type="text" name="productCode" value={newJewelry.productCode} onChange={handleInputChange} required/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newJewelry.productName} onChange={handleInputChange} required/>
              </div>
            </div>
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem Cost:</label>
                <input type="number" name="gemCost" value={newJewelry.gemCost} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Production Cost:</label>
                <input type="number" name="productionCost" value={newJewelry.productionCost} onChange={handleInputChange} />
              </div>
            </div> */}
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gender:</label>
                <select name="gender" value={newJewelry.gender} onChange={handleInputChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Category ID:</label>
                <input type="number" name="categoryId" value={newJewelry.categoryId} onChange={handleInputChange} />
              </div>
            </div> */}
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material:</label>
                <select name="material" value={newJewelry.material} onChange={handleInputChange} >
                <option value="" disabled>Select material</option>
                  <option value={1}>24K GOlD</option>
                  <option value={2}>18K GOLD</option>
                  <option value={3}>WHITE GOLD</option>
                  <option value={4}>GOLD BARS</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Weight (gram):</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} min={0.1} step={0.1}/>
              </div>
            </div>
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Size:</label>
                <select name="size" value={newJewelry.size} onChange={handleInputChange}>
                  <option value="SIZE_1">Size 1</option>
                  <option value="SIZE_2">Size 2</option>
                  <option value="SIZE_3">Size 3</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Jewelry Diamond:</label>
                <select name="jewelryDiamond" value={newJewelry.jewelryDiamond} onChange={handleInputChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div> */}
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div> */}
            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageGold" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">ADD GOLD</button>
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
