import React, { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './UpDiamond.css';
import { adornicaServ } from '../../service/adornicaServ';
import Spinner from '../../Components/Spinner/Spinner';

function UpDiamond() {
  const { productCode } = useParams();
  const [loading, setLoading] = useState(true);
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
    origin: '',
    color: '',
    clarity: '',
    cut: '',
    carat: '',
    size: 'SIZE_1',
    isJewelryDiamond: false,
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSp({ ...sp, [name]: value });
    console.log(sp);
  };

  const handleGemInputChange = (e) => {
    const { name, value } = e.target;
    const updatedGem = { ...sp.gem[0], [name]: value };
    setSp({ ...sp, gem: [updatedGem] });
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
      isJewelryDiamond: false,
    };

    adornicaServ.updateProduct(productCode, productData)
      .then((response) => {
        notification.success({ message: 'Cập nhật thành công' });
        console.log(response.data.metadata);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
        console.log(error);
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
        <div className="updiamond-container">
          <div className="updiamond-content">
            <div className="updiamond-form">
              <h2 className="updiamond-title">Chỉnh sửa Kim cương</h2>
              <form onSubmit={handleUpdate}>
                <div className="updiamond-form-row">
                  <div className="updiamond-form-group">
                    <label>Mã sản phẩm:</label>
                    <h2 className="updiamond-static-input" name="productCode">{sp.productCode}</h2>
                  </div>
                  <div className="updiamond-form-group">
                    <label>Tên sản phẩm:</label>
                    <input type="text" name="productName" placeholder="Product name" value={sp.productName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="updiamond-form-row">
                  <div className="updiamond-form-group">
                    <label>Mã đá quý:</label>
                    <h2 className="updiamond-static-input" name="gemCode">{sp.gem[0]?.gemCode || ''}</h2>
                  </div>
                </div>
                <div className="updiamond-form-row">
                  <div className="updiamond-form-group">
                    <label>Tên kim cương:</label>
                    <input type="text" name="gemName" placeholder="Diamond name" value={sp.gem[0].gemName} onChange={handleGemInputChange} required />
                  </div>
                  <div className="updiamond-form-group">
                    <label>Nguồn gốc:</label>
                    <h2 className="updiamond-static-input" name="origin">{sp.gem[0].origin}</h2>
                  </div>
                </div>
                <div className="updiamond-form-row">
                  <div className="updiamond-form-group">
                    <label>Màu sắc:</label>
                    <select type="text" name="color" placeholder="Màu sắc" value={sp.gem[0].color} onChange={handleGemInputChange} >
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
                  <div className="updiamond-form-group">
                    <label>Độ tinh khiết:</label>
                    <select type="text" name="clarity" placeholder="Clarity" value={sp.gem[0].clarity} onChange={handleGemInputChange} >
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
                <div className="updiamond-form-row">
                  <div className="updiamond-form-group">
                    <label>Vết cắt:</label>
                    <select type="text" name="cut" placeholder="Cut" value={sp.gem[0].cut} onChange={handleGemInputChange}>
                      <option value="" disabled>Chọn loại vết cắt</option>
                      <option value="EX">EX</option>
                      <option value="G">G</option>
                      <option value="F">F</option>
                      <option value="P">P</option>
                    </select>
                  </div>
                  <div className="updiamond-form-group">
                    <label>Khối lượng:</label>
                    <input type="number" name="carat" placeholder="Carat" value={sp.gem[0].carat} onChange={handleGemInputChange} min={0} step={0.01} />
                  </div>
                </div>
                <div className="updiamond-form-footer">
                  <NavLink to="/ManageDiamond" style={{
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
                    marginRight:'5px'
                  }} type="submit">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Modal
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalOk}
            className="custom-modal-updiamond"
          >
            <div>{modalMessage}</div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default UpDiamond;
