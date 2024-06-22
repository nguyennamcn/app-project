import React, { useState } from 'react';
import { Modal ,notification} from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddDiamond() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: 'None', // not null
    productName: 'None', // not null
    gemCost: 0, // not null
    productionCost: 0,
    //gender: 'MALE',
    categoryId: 6, //id: 6 Diamond
    material: 1, // not null
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
          <h2 className="add-jewelry-title">ADD DIAMOND</h2>
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
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material:</label>
                <input type="number" name="material" value={newJewelry.material} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Weight:</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} />
              </div>
            </div> */}
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="number" name="gemId" value={newJewelry.gemId} onChange={handleInputChange} min={0}/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" value={newJewelry.gemCode} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="diamondName" value={newJewelry.diamondName} onChange={handleInputChange} required/>
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
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div>
            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageDiamond" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">ADD DIAMOND</button>
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
