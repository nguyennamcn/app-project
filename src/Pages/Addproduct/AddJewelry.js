import React, { useState } from 'react';
import { Modal, message, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddJewelry() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: 'None',
    productName: 'None',
    gemCost: 0,
    productionCost: 0,
    gender: 'MALE',
    categoryId: 0, // id:1 ring, id: 2 Bracelet, id:3 Necklace, id:4 Earrings
    material: 0,
    weight: 0,
    gemId: 0,
    gemCode: 'None',
    diamondName: 'None',
    origin: 'None',
    color: 'None',
    clarity: 'None',
    cut: 'None',
    carat: 0,
    size: 'SIZE_1',
    jewelryDiamond: true,
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
      gemId: Number(newJewelry.gemId),
      gemCode: newJewelry.gemCode,
      diamondName: newJewelry.diamondName,
      origin: newJewelry.origin,
      color: newJewelry.color,
      clarity: newJewelry.clarity,
      cut: newJewelry.cut,
      carat: Number(newJewelry.carat),
      size: newJewelry.size,
      jewelryDiamond: newJewelry.jewelryDiamond === 'true' || newJewelry.jewelryDiamond === true,
    };

    if (validateForm(productData)) {
      adornicaServ.postCreateProduct(productData)
        .then(response => {
          setModalMessage('Jewelry added successfully!');
          setIsModalVisible(true);
        })
        .catch(error => {
          setModalMessage('Error adding jewelry. Please try again.');
          setIsModalVisible(true);
        });
    } else {
      notification.error({message:'Please check your input data.'});
      //setIsModalVisible(true);
    }
  };

  const validateForm = (data) => {
    const requiredFields = [
      'productCode',
      'productName',
      'gemCost',
      'productionCost',
      'categoryId',
      'material',
      'weight',
      'gemId',
      'gemCode',
      'diamondName',
      'origin',
      'color',
      'clarity',
      'cut',
      'carat',
    ];

  

    // for (let field of requiredFields) {
    //   if (!data[field] || data[field] === 'None' || data[field] === 0 || data[field] === null) {
    //     return false;
    //   }
    // }

    // if (productImages.length === 0) {
    //   return false;
    // }

    return true;
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
                <label>Product Code:</label>
                <input type="text" name="productCode" value={newJewelry.productCode} onChange={handleInputChange} required/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newJewelry.productName} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem Cost:</label>
                <input type="number" name="gemCost" value={newJewelry.gemCost} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Production Cost:</label>
                <input type="number" name="productionCost" value={newJewelry.productionCost} onChange={handleInputChange} min={1}/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gender:</label>
                <select name="gender" value={newJewelry.gender} onChange={handleInputChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Category ID:</label>
                <input type="number" name="categoryId" value={newJewelry.categoryId} onChange={handleInputChange} min={1} max={4}/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material:</label>
                <input type="number" name="material" value={newJewelry.material} onChange={handleInputChange} min={1} max={4}/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Weight:</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} min={1}/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="number" name="gemId" value={newJewelry.gemId} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" value={newJewelry.gemCode} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="diamondName" value={newJewelry.diamondName} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Origin:</label>
                <input type="text" name="origin" value={newJewelry.origin} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Color:</label>
                <input type="text" name="color" value={newJewelry.color} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Clarity:</label>
                <input type="text" name="clarity" value={newJewelry.clarity} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Cut:</label>
                <input type="text" name="cut" value={newJewelry.cut} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="number" name="carat" value={newJewelry.carat} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
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
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
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
        footer={<button className='btn__ok' onClick={handleModalOk}>OK</button>}
        className="custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>
  );
}

export default AddJewelry;
