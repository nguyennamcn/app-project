import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function UpGold() {
  const { productCode } = useParams();
  const [sp, setSp] = useState({
    productCode: 'None',
    productName: 'None',
    categoryId: 5, // id 5: GOLD
    materials: [],
    size: 'SIZE_1',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSp({ ...sp, [name]: value });
    console.log(sp);
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    const updatedMaterials = sp.materials.map((material, index) => {
      if (index === 0) { // Assuming you want to update the first material
        return { ...material, [name]: value };
      }
      return material;
    });
    setSp({ ...sp, materials: updatedMaterials });
    console.log(sp);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const productData = {
      productCode: sp.productCode,
      productName: sp.productName,
      gender: sp.gender,
      categoryId: 5,
      materialProductRequests: sp.materials.map(material => ({
        material: material.id,
        weight: material.weight,
      })),
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
          <h2 className="add-jewelry-title">ADD GOLD</h2>
          <form onSubmit={handleUpdate}>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Code:</label>
                <input type="text" name="productCode" value={sp.productCode} onChange={handleInputChange} required />
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={sp.productName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material ID:</label>
                <input type="number" name="id" value={sp.materials[0]?.id || ''} onChange={handleMaterialChange} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Weight (gram):</label>
                <input type="number" name="weight" value={sp.materials[0]?.weight || ''} onChange={handleMaterialChange} min={0.1} step={0.1} />
              </div>
            </div>
            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageGold" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">UPDATE GOLD</button>
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

export default UpGold;
