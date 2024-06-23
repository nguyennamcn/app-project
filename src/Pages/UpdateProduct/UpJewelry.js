import React, { useState, useEffect } from 'react';
import { Modal, message, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

function UpJewelry() {
  const { productCode } = useParams();
  const [sp, setSp] = useState({
    productCode: '',
    productName: '',
    gender: 'UNISEX',
    categoryId: '',
    materials: [{ id: '', name: '', weight: '' }],
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
    gemCost: '',
    productionCost: '',
    size: 'SIZE_0',
    jewelryDiamond: true,
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
  };

  const handleGemInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedGems = [...sp.gem];
    updatedGems[index] = { ...updatedGems[index], [name]: value };
    setSp({ ...sp, gem: updatedGems });
  };

  const handleMaterialInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaterials = [...sp.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };
    setSp({ ...sp, materials: updatedMaterials });
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
      categoryId: sp.categoryId,
      materialProductRequests: sp.materials.map(material => ({
        material: material.id,
        weight: material.weight,
      })),
      gemId: Number(sp.gem[0].id),
      gemCode: sp.gem[0].gemCode,
      diamondName: sp.gem[0].gemName,
      origin: sp.gem[0].origin,
      color: sp.gem[0].color,
      clarity: sp.gem[0].clarity,
      cut: sp.gem[0].cut,
      carat: Number(sp.gem[0].carat),
      gemCost: sp.gemCost,
      productionCost: sp.productionCost,
      size: sp.size,
      jewelryDiamond: true,
    };

    adornicaServ.updateProduct(productCode, productData)
      .then((response) => {
        notification.success({ message: 'Update product success' });
        console.log(response.data.metadata);
        console.log(productData);

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
          <h2 className="add-jewelry-title">UPDATE JEWELRY</h2>
          <form onSubmit={handleUpdate}>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Product Code:</label>
                <input type="text" name="productCode" placeholder='Product code' value={sp.productCode} onChange={handleInputChange} required />
              </div>
              <div className="add-jewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" placeholder='Product name' value={sp.productName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem Cost:</label>
                <input type="number" name="gemCost" placeholder='Gem cost' value={sp.gemCost} onChange={handleInputChange} min={0} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Production Cost:</label>
                <input type="number" name="productionCost" placeholder='Production cost' value={sp.productionCost} onChange={handleInputChange} min={1} required />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gender:</label>
                <select name="gender" value={sp.gender} onChange={handleInputChange}>
                  <option value={sp.gender}>{sp.gender}</option>
                  {sp.gender !== "MALE" && <option value="MALE">Male</option>}
                  {sp.gender !== "FEMALE" && <option value="FEMALE">Female</option>}
                  {sp.gender !== "UNISEX" && <option value="UNISEX">Unisex</option>}
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Category:</label>
                <input type="text" name="categoryId" placeholder='Category' value={sp.category} onChange={handleInputChange} readOnly />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Material ID:</label>
                <input type="text" name="id" placeholder='Material id' value={sp.materials[0]?.id} onChange={(e) => handleMaterialInputChange(e, 0)} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Material Weight (gram):</label>
                <input type="number" name="weight" placeholder='Material weight' value={sp.materials[0]?.weight} onChange={(e) => handleMaterialInputChange(e, 0)} min={1} />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Gem ID:</label>
                <input type="text" name="id" placeholder='Gem id' value={sp.gem[0]?.id} onChange={(e) => handleGemInputChange(e, 0)} min={0} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Gem Code:</label>
                <input type="text" name="gemCode" placeholder='Gem Code' value={sp.gem[0]?.gemCode} onChange={(e) => handleGemInputChange(e, 0)} readOnly />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Diamond Name:</label>
                <input type="text" name="gemName" placeholder='Diamond Name' value={sp.gem[0]?.gemName} onChange={(e) => handleGemInputChange(e, 0)} readOnly />
              </div>
              <div className="add-jewelry-form-group">
                <label>Origin:</label>
                <select name="origin" value={sp.gem[0]?.origin} onChange={(e) => handleGemInputChange(e, 0)} readOnly>
                  <option value={sp.gem[0]?.origin}>{sp.gem[0]?.origin}</option>
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Color:</label>
                <select name="color" value={sp.gem[0]?.color} onChange={(e) => handleGemInputChange(e, 0)} readOnly>
                  <option value={sp.gem[0]?.color}>{sp.gem[0]?.color}</option>

                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Clarity:</label>
                <select name="clarity" value={sp.gem[0]?.clarity} onChange={(e) => handleGemInputChange(e, 0)} readOnly>
                  <option value={sp.gem[0]?.clarity}>{sp.gem[0]?.clarity}</option>

                </select>
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Cut:</label>
                <select name="cut" value={sp.gem[0]?.cut} onChange={(e) => handleGemInputChange(e, 0)} readOnly>
                  <option value={sp.gem[0]?.cut}>{sp.gem[0]?.cut}</option>

                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Carat:</label>
                <input type="text" name="carat" placeholder='Carat' value={sp.gem[0]?.carat} onChange={(e) => handleGemInputChange(e, 0)} min={0} readOnly />
              </div>
            </div>
            <div className="add-jewelry-form-row">
              <div className="add-jewelry-form-group">
                <label>Size:</label>
                <select name="size" value={sp.size} onChange={handleInputChange} required>
                  <option value={sp.size}>{sp.size}</option>
                  {sp.size !== "SIZE_1" && <option value="SIZE_1">Size 1</option>}
                  {sp.size !== "SIZE_2" && <option value="SIZE_2">Size 2</option>}
                  {sp.size !== "SIZE_3" && <option value="SIZE_3">Size 3</option>}
                  {sp.size !== "SIZE_4" && <option value="SIZE_4">Size 4</option>}
                  {sp.size !== "SIZE_5" && <option value="SIZE_5">Size 5</option>}
                  {sp.size !== "SIZE_6" && <option value="SIZE_6">Size 6</option>}
                </select>
              </div>
              <div className="add-jewelry-form-group">
                <label>Jewelry Diamond:</label>
                <select name="jewelryDiamond" value={sp.jewelryDiamond ? "true" : "false"} onChange={handleInputChange} required>
                  <option value={sp.jewelryDiamond ? "true" : "false"} >{sp.jewelryDiamond ? "true" : "false"} </option>
      
                </select>
              </div>
            </div>
            <div className="add-jewelry-form-footer">
              <NavLink to="/ManageJewelry" className="add-jewelry-back-button">BACK</NavLink>
              <button className="add-jewelry-add-button" type="submit">
                UPDATE JEWELRY
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default UpJewelry;
