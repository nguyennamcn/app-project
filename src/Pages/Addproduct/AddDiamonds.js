import React, { useState } from 'react';
import { Modal ,notification} from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddDiamond() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: 'NONE', // not null
    productName: 'NONE', // not null
    gemCost: 0, // not null
    //productionCost: 0,
    gender: 'UNISEX',
    categoryId: 6, //id: 6 Diamond
    // material: 1, // not null
    // weight: 0,
    //gemId: 0,
    gemCode: '',
    diamondName: 'NONE',
    origin: 'NONE',
    color: 'NONE',
    clarity: 'NONE',
    cut: 'NONE',
    carat: 0,
    size: 'NONE',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [productImages, setProductImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJewelry((prevJewelry) => ({
      ...prevJewelry,
      [name]: name === 'carat' ? parseFloat(value) : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const productData = {
      productCode: newJewelry.productCode,
      productName: newJewelry.productName,
      gender: "UNISEX",
      categoryId: 6,
      
      //gemId: Number(newJewelry.gemId),
      gemCode: newJewelry.gemCode,
      diamondName: newJewelry.diamondName,
      origin: newJewelry.origin,
      color: newJewelry.color,
      clarity: newJewelry.clarity,
      cut: newJewelry.cut,
      carat: newJewelry.carat,
      size: newJewelry.size,
      isJewelryDiamond: false,
    };

    console.log("product Data",productData);

    adornicaServ.postCreateProduct(productData)
      .then(response => {
        notification.success({message: "Add product success"})
        console.log(response.data.metadata);
      })
      .catch(error => {
        notification.error({message: "error"})
        console.log(error);
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
                <input type="text" name="productCode" placeholder='Product code' value={newJewelry.productCode} onChange={handleInputChange} required/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" placeholder='Product name' value={newJewelry.productName} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              {/* <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="number" name="gemId" placeholder='Gem id' value={newJewelry.gemId} onChange={handleInputChange} min={0} required/>
              </div> */}
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" placeholder='Gem code' value={newJewelry.gemCode} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="diamondName" placeholder='Diamond name' value={newJewelry.diamondName} onChange={handleInputChange} required/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Origin:</label>
                <select type="text" name="origin" value={newJewelry.origin} onChange={handleInputChange} required>
                <option value=""disabled>Select origin</option>
                <option value="NATURAL">NATURAL</option>
                <option value="LAB_GROWN">LAB_GROWN</option>
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Color:</label>
                <select type="text" name="color" value={newJewelry.color} onChange={handleInputChange} required>
                <option value="" disabled>Select color</option>
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
              <div className="add-jewelry-form-group">
                <label>Clarity:</label>
                <select type="text" name="clarity" value={newJewelry.clarity} onChange={handleInputChange}required>
                <option value="" disabled>Select Clarity</option>
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
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Cut:</label>
                <select name="cut" value={newJewelry.cut} onChange={handleInputChange} required>
                <option value="" disabled>Select Cut</option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="number" name="carat" value={newJewelry.carat} onChange={handleInputChange} min={0.1} step={0.1}/>
              </div>
            </div>
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div> */}
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
