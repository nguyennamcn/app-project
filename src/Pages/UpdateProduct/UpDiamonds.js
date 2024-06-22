import React, { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function UpDiamonds() {
  const { productCode } = useParams();
  const [sp, setSp] = useState({
    productCode: '',
    productName: '',
    gender: 'UNISEX',
    categoryId: '',
    material: '',
    weight: '',
    gem: [{
      id: '',
      carat: '',
      gemCode: '',
      gemName: '',
      origin: '',
      color: '',
      clarity: '',
      cut: '',
    }],
    gemId: '',
    gemCode: '',
    diamondName: '',
    origin: '',
    color: '',
    clarity: '',
    cut: '',
    carat: '',
    size: 'SIZE_1',
    jewelryDiamond: false,
  });

  useEffect(() => {
    adornicaServ.getDetailProduct(productCode)
      .then((res) => {
        setSp(res.data.metadata);
        console.log(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productCode]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [productImages, setProductImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSp({ ...sp, [name]: value });
    console.log(sp)
  };

  const handleGemInputChange = (e) => {
    const { name, value } = e.target;
    const updatedGem = { ...sp.gem[0], [name]: value };
    setSp({ ...sp, gem: [updatedGem] });
  };

  const handleImageUpload = (e) => {
    setProductImages(Array.from(e.target.files));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const productData = {
      productCode: sp.productCode,
      productName: sp.productName,
      gender: sp.gender,
      categoryId: 6,
      materialProductRequests: [
        {
          material: 1,
          weight: 0,
        },
      ],
      gemId: Number(sp.gem[0].id),
      gemCode: sp.gem[0].gemCode,
      diamondName: sp.gem[0].gemName,
      origin: sp.gem[0].origin,
      color: sp.gem[0].color,
      clarity: sp.gem[0].clarity,
      cut: sp.gem[0].cut,
      carat: Number(sp.gem[0].carat),
      size: sp.size,
      jewelryDiamond: false,
    };

    adornicaServ.updateProduct(productCode, productData)
      .then((response) => {
        notification.success({ message: 'Update product success' });
        console.log(response.data.metadata);
      })
      .catch((error) => {
        notification.error({ message: error.response.data.metadata.message });
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
          <form onSubmit={handleUpdate}>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Code:</label>
                <input type="text" name="productCode" placeholder="Product code" value={sp.productCode} onChange={handleInputChange}  required/>
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" placeholder="Product name" value={sp.productName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="number" name="id" placeholder="Gem id" value={sp.gem[0]?.id || ''} onChange={handleGemInputChange}  readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" placeholder="Gem code" value={sp.gem[0]?.gemCode || ''} onChange={handleGemInputChange} required />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="diamondName" placeholder="Diamond name" value={sp.gem[0].gemName} onChange={handleInputChange} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Origin:</label>
                <select name="origin" value={sp.gem[0].origin} onChange={handleInputChange} >
                  <option value={sp.gem[0].origin} >{sp.gem[0].origin}</option>
         
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Color:</label>
                <select name="color" value={sp.gem[0].color} onChange={handleInputChange} >
                  <option value={sp.gem[0].color} >{sp.gem[0].color} </option>
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Clarity:</label>
                <select name="clarity" value={sp.gem[0].clarity} onChange={handleInputChange} >
                  <option value={sp.gem[0].clarity}>{sp.gem[0].clarity}</option>
                
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Cut:</label>
                <select name="cut" value={sp.gem[0].cut} onChange={handleInputChange} >
                  <option value="">{sp.gem[0].cut}</option>

                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="number" name="carat" value={sp.gem[0].carat} onChange={handleInputChange} />
              </div>
            </div>

            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageDiamond" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">
                UPDATE DIAMOND
              </button>
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

export default UpDiamonds;
