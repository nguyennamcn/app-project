import React, { useState } from 'react';
import { Modal, message, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddJewelry() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: '', // not null
    productName: '', // not null
    gemCost: 0, 
    productionCost: null, // not null
    gender: 'MALE',
    categoryId: null, // id:1 ring, id: 2 Bracelet, id:3 Necklace, id:4 Earrings
    material: null,  // not null
    weight: null, // not null
    //gemId: null,
    gemCode: '',
    diamondName: '',
    origin: '',
    color: '',
    clarity: '',
    cut: '',
    carat: 0,
    size: 'SIZE_1', // có size mới chạy api vd: SIZE_1 
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
      //gemId: Number(newJewelry.gemId),
      gemCode: newJewelry.gemCode,
      diamondName: newJewelry.diamondName,
      origin: newJewelry.origin,
      color: newJewelry.color,
      clarity: newJewelry.clarity,
      cut: newJewelry.cut,
      carat: Number(newJewelry.carat),
      size: newJewelry.size,
      jewelryDiamond: true,
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
          <h2 className="add-jewelry-title">ADD JEWELRY</h2>
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
              <div className="add-jewelry-form-group">
                <label>Gem Cost:</label>
                <input type="number" name="gemCost" placeholder='Gem cost' value={newJewelry.gemCost} onChange={handleInputChange} min={0}  />
              </div>
              <div className="add-jewelry-form-group">
                <label>Production Cost:</label>
                <input type="number" name="productionCost" placeholder='Production cost' value={newJewelry.productionCost} onChange={handleInputChange} min={1} required/>
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
                <select name="categoryId" placeholder='Category id' value={newJewelry.categoryId} onChange={handleInputChange} min={1}>
                <option value={0}>Select category</option>
                  <option value={1}>Ring</option>
                  <option value={2}>Bracelet</option>
                  <option value={3}>Necklace</option>
                  <option value={4}>Earrings</option>
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material:</label>
                <select name="material" placeholder='Material id' value={newJewelry.material} onChange={handleInputChange} min={1} >
                <option value={0} >Select material</option>
                  <option value={1}>24K GOlD</option>
                  <option value={2}>18K GOLD</option>
                  <option value={3}>WHITE GOLD</option>
                  <option value={4}>GOLD BARS</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Weight (gram):</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} min={1} required/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              {/* <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="number" name="gemId" value={newJewelry.gemId} onChange={handleInputChange} min={0} required/>
              </div> */}
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" placeholder='Gem Code' value={newJewelry.gemCode} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="diamondName" placeholder='Diamond Name' value={newJewelry.diamondName} onChange={handleInputChange} />
              </div>
              <div className="add-jewelry-form-group">
                <label>Origin:</label>
                <select type="text" name="origin" value={newJewelry.origin} onChange={handleInputChange} required>
                <option value=""disabled>Select origin</option>
                <option value="NONE">NONE</option>
                <option value="NATURAL">NATURAL</option>
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Color:</label>
                <select type="text" name="color" value={newJewelry.color} onChange={handleInputChange} required>
                <option value="" disabled>Select color</option>
                <option value="NONE">NONE</option>
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
                <option value="NONE">NONE</option>
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
                <option value="NONE">NONE</option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="number" name="carat" value={newJewelry.carat} onChange={handleInputChange} min={0} step={0.1}/>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Size:</label>
                <select name="size" value={newJewelry.size} onChange={handleInputChange}>
                  <option value="SIZE_1">Size 1</option>
                  <option value="SIZE_2">Size 2</option>
                  <option value="SIZE_3">Size 3</option>
                  <option value="SIZE_4">Size 4</option>
                  <option value="SIZE_5">Size 5</option>
                  <option value="SIZE_6">Size 6</option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Jewelry Diamond:</label>
                <select name="jewelryDiamond" value={newJewelry.jewelryDiamond} onChange={handleInputChange}>
                  <option value="true">Yes</option>
                  
                </select>
              </div>
            </div>
            {/* <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
              </div>
            </div> */}
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
