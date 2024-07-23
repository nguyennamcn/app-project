import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import './UpJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';
import Spinner from '../../Components/Spinner/Spinner';

function UpJewelry() {
  const { productCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [isHaveGem, setIsHaveGem] = useState("None");

  const categorySizes = {
    1: ['SIZE_6', 'SIZE_7', 'SIZE_8', 'SIZE_9', 'SIZE_10', 'SIZE_11', 'SIZE_12', 'SIZE_13', 'SIZE_14', 'SIZE_15', 'SIZE_16', 'SIZE_17', 'SIZE_18', 'SIZE_19', 'SIZE_20'], // Ring sizes
    2: ['SIZE_14', 'SIZE_15', 'SIZE_16', 'SIZE_17', 'SIZE_18', 'SIZE_19', 'SIZE_20', 'SIZE_21', 'SIZE_22'], // Bracelet sizes
    3: ['SIZE_36', 'SIZE_38', 'SIZE_40', 'SIZE_42', 'SIZE_45', 'SIZE_48', 'SIZE_50', 'SIZE_55', 'SIZE_60'], // Necklace sizes
    4: ['SIZE_1', 'SIZE_2', 'SIZE_3', 'SIZE_4'], // Earrings sizes
  };

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
    isJewelryDiamond: true,
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
        setLoading(false);
      });
  }, [productCode]);

  useEffect(() => {
    if (sp.gem && sp.gem.length > 0 && sp.gem[0].gemCode) {
      setIsHaveGem(sp.gem[0].gemCode);
    } else {
      setIsHaveGem('None');
    }
  }, [sp]);

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
  const navigate = useNavigate();
  const handleMaterialInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaterials = [...sp.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };
    setSp({ ...sp, materials: updatedMaterials });
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
      gemCost: sp.gemCost,
      productionCost: sp.productionCost,
      size: sp.size,
      //isJewelryDiamond: true,
    };

    // Add gem properties only if gem exists
    if (sp.gem && sp.gem.length > 0 && sp.gem[0].id) {
      productData.gemId = Number(sp.gem[0].id);
      productData.gemCode = sp.gem[0].gemCode;
      productData.diamondName = sp.gem[0].gemName;
      productData.origin = sp.gem[0].origin;
      productData.color = sp.gem[0].color;
      productData.clarity = sp.gem[0].clarity;
      productData.cut = sp.gem[0].cut;
      productData.carat = Number(sp.gem[0].carat);
    }

    adornicaServ.updateProduct(productCode, productData)
      .then((response) => {
        notification.success({ message: 'Cập nhật thành công' });
        navigate('/ManageJewelry');
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
      ) : (
        <div className="upjewelry-container">
          <div className="upjewelry-content">
            <div className="upjewelry-form">
              <h2 className="upjewelry-title">Chỉnh sửa Trang sức</h2>
              <form onSubmit={handleUpdate}>
                <div className="upjewelry-form-row">
                  <div className="upjewelry-form-group">
                    <label>Mã sản phẩm:</label>
                    <h2 className="upjewelry-static-input">{sp.productCode}</h2>
                  </div>
                  <div className="upjewelry-form-group">
                    <label>Tên sản phẩm:</label>
                    <input type="text" name="productName" placeholder='Product name' value={sp.productName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="upjewelry-form-row">
                  <div className="upjewelry-form-group">
                    <label>Giá đá quý:</label>
                    <h2 className="upjewelry-static-input">{sp.gemCost}</h2>
                  </div>
                  <div className="upjewelry-form-group">
                    <label>Chi phí sản xuất:</label>
                    <input type="number" name="productionCost" placeholder='Production cost' value={sp.productionCost} onChange={handleInputChange} min={1} required />
                  </div>
                </div>
                <div className="upjewelry-form-row">
                  <div className="upjewelry-form-group">
                    <label>Giới tính:</label>
                    <select name="gender" value={sp.gender} onChange={handleInputChange}>
                    {sp.gender === "MALE" && <option value="MALE">Nam</option>}
  {sp.gender === "FEMALE" && <option value="FEMALE">Nữ</option>}
  {sp.gender === "UNISEX" && <option value="UNISEX">Unisex</option>}
  {sp.gender !== "MALE" && <option value="MALE">Nam</option>}
  {sp.gender !== "FEMALE" && <option value="FEMALE">Nữ</option>}
  {sp.gender !== "UNISEX" && <option value="UNISEX">Unisex</option>}
                    </select>
                  </div>
                  <div className="upjewelry-form-group">
                    <label>Loại:</label>
                    <h2 className="upjewelry-static-input">{sp.category}</h2>
                  </div>
                </div>
                <div className="upjewelry-form-row">
                  <div className="upjewelry-form-group">
                    <label>Vật liệu ID:</label>
                    <h2 className="upjewelry-static-input">{sp.materials[0]?.name}</h2>
                  </div>
                  <div className="upjewelry-form-group">
                    <label>Trọng lượng vật liệu (Chỉ):</label>
                    <input type="number" name="weight" placeholder='Material weight' value={sp.materials[0]?.weight} onChange={(e) => handleMaterialInputChange(e, 0)} min={0} step={0.1} />
                  </div>
                </div>
                {(isHaveGem !== "None") && isHaveGem !== "NONE" && (<>
                  <div className="upjewelry-form-row">
                    <div className="upjewelry-form-group">
                      <label>Mã đá quý (Kim cương):</label>
                      <h2 className="upjewelry-static-input">{sp.gem[0]?.gemCode}</h2>
                    </div>
                  </div>
                  <div className="upjewelry-form-row">
                    <div className="upjewelry-form-group">
                      <label>Tên kim cương:</label>
                      <h2 className="upjewelry-static-input">{sp.gem[0]?.gemName}</h2>
                    </div>
                    <div className="upjewelry-form-group">
                      <label>Nguồn gốc:</label>
                      <h2 className="upjewelry-static-input">{sp.gem[0]?.origin}</h2>
                    </div>
                  </div>
                  <div className="upjewelry-form-row">
                    <div className="upjewelry-form-group">
                      <label>Màu sắc:</label>
                      {/* <input type="text" name="color" placeholder='Màu sắc' value={sp.gem[0]?.color} onChange={(e) => handleGemInputChange(e, 0)} /> */}
                      <select type="text" name="color" placeholder='Màu sắc' value={sp.gem[0]?.color} onChange={(e) => handleGemInputChange(e, 0)} >
                        <option value="" disabled>Chọn màu sắc</option>
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
                    <div className="upjewelry-form-group">
                      <label>Độ tinh khiết:</label>
                      <select type="text" name="clarity" placeholder='Độ tinh khiết' value={sp.gem[0]?.clarity} onChange={(e) => handleGemInputChange(e, 0)} >
                        <option value="" disabled>Chọn độ tinh khiết</option>
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
                  <div className="upjewelry-form-row">
                    <div className="upjewelry-form-group">
                      <label>Vết cắt:</label>
                      <select type="text" name="cut" placeholder='Vết cắt' value={sp.gem[0]?.cut} onChange={(e) => handleGemInputChange(e, 0)}>
                        <option value="" disabled>Chọn loại vết cắt</option>
                        <option value="EX">EX</option>
                        <option value="G">G</option>
                        <option value="F">F</option>
                        <option value="P">P</option>
                      </select>
                    </div>
                    <div className="upjewelry-form-group">
                      <label>Khối lượng (carat):</label>
                      <input type="number" name="carat" placeholder='Khối lượng (kim cương)' value={sp.gem[0]?.carat} onChange={(e) => handleGemInputChange(e, 0)} min={0} step={0.01} />
                    </div>
                  </div>
                </>)}


                <div className="upjewelry-form-row">
                  <div className="upjewelry-form-group">
                    <label>Kích cỡ:</label>
                    <select name="size" value={sp.size} onChange={handleInputChange} required>
                      <option value="" disabled>Chọn kích cỡ</option>
                      {categorySizes[sp.categoryId]?.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="upjewelry-form-group">
                    {/* <label>Trang sức kim cương:</label>
                    <h2 className="upjewelry-static-input">{sp.isJewelryDiamond === true ? "true" : "false"}</h2> */}
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
                  }}>Trở về</NavLink>
                  <button style={{
                    backgroundColor: '#00ca4d',
                    border: '1px solid purple',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }} type="submit">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Modal visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
            <p>{modalMessage}</p>
          </Modal>
        </div>
      )}
    </>
  );
}

export default UpJewelry;
