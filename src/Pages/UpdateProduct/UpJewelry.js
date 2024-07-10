import React, { useState, useEffect } from 'react';
import { Modal, message, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './UpJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';
import Spinner from '../../Components/Spinner/Spinner';

function UpJewelry() {
  const { productCode } = useParams();
  const [loading, setLoading] = useState(true);


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
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
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
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="upjewelry-container">
      <div className="upjewelry-content">
        <div className="upjewelry-form">
          <h2 className="upjewelry-title">UPDATE JEWELRY</h2>
          <form onSubmit={handleUpdate}>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Product Code:</label>
                <h2 className="upjewelry-static-input">{sp.productCode}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" placeholder='Product name' value={sp.productName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Gem Cost:</label>
                <h2 className="upjewelry-static-input">{sp.gemCost}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Production Cost:</label>
                <input type="number" name="productionCost" placeholder='Production cost' value={sp.productionCost} onChange={handleInputChange} min={1} required />
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Gender:</label>
                <select name="gender" value={sp.gender} onChange={handleInputChange}>
                  <option value={sp.gender}>{sp.gender}</option>
                  {sp.gender !== "MALE" && <option value="MALE">Male</option>}
                  {sp.gender !== "FEMALE" && <option value="FEMALE">Female</option>}
                  {sp.gender !== "UNISEX" && <option value="UNISEX">Unisex</option>}
                </select>
              </div>
              <div className="upjewelry-form-group">
                <label>Category:</label>
                <h2 className="upjewelry-static-input">{sp.category}</h2>
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Material ID:</label>
                <h2 className="upjewelry-static-input">{sp.materials[0]?.name}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Material Weight (gram):</label>
                <input type="number" name="weight" placeholder='Material weight' value={sp.materials[0]?.weight} onChange={(e) => handleMaterialInputChange(e, 0)} min={1} />
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Gem Code:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.gemCode}</h2>
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Diamond Name:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.gemName}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Origin:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.origin}</h2>
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Color:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.color}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Clarity:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.clarity}</h2>
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
                <label>Cut:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.cut}</h2>
              </div>
              <div className="upjewelry-form-group">
                <label>Carat:</label>
                <h2 className="upjewelry-static-input">{sp.gem[0]?.carat}</h2>
              </div>
            </div>
            <div className="upjewelry-form-row">
              <div className="upjewelry-form-group">
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
              <div className="upjewelry-form-group">
                <label>Jewelry Diamond:</label>
                <h2 className="upjewelry-static-input">{sp.jewelryDiamond ? "true" : "false"}</h2>
              </div>
            </div>
            <div className="upjewelry-form-footer">
              <NavLink to="/ManageJewelry" style={{
                                            backgroundColor: 'gray',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>BACK</NavLink>
              <button style={{
                    backgroundColor: '#00ca4d',
                    border: '1px solid purple',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight:'5px'
                }} type="submit">
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
      )
    }
</>
    
  );
}

export default UpJewelry;
