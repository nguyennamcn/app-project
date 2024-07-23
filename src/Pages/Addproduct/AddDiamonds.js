import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { NavLink , useNavigate } from 'react-router-dom';
import './AddDiamond.css';
import { adornicaServ } from '../../service/adornicaServ';

function AddDiamond() {
  const [newDiamond, setNewDiamond] = useState({
    productCode: '', // not null
    productName: '', // not null
    gemCost: 0, // not null
    gender: 'UNISEX',
    categoryId: 6, //id: 6 Diamond
    gemCode: '',
    diamondName: '',
    origin: '',
    color: '',
    clarity: '',
    cut: '',
    carat: 0,
    size: 'NONE',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [productImages, setProductImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiamond((prevJewelry) => ({
      ...prevJewelry,
      [name]: name === 'carat' ? parseFloat(value) : value,
    }));
  };
  const navigate = useNavigate();
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const productData = {
      productCode: newDiamond.productCode,
      productName: newDiamond.productName,
      gender: "UNISEX",
      categoryId: 6,
      gemCode: newDiamond.gemCode,
      diamondName: newDiamond.diamondName,
      origin: newDiamond.origin,
      color: newDiamond.color,
      clarity: newDiamond.clarity,
      cut: newDiamond.cut,
      carat: newDiamond.carat,
      size: newDiamond.size,
    };

    adornicaServ.postCreateProduct(productData)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Thêm kim cương thành công" });
        navigate('/ManageDiamond');
      })
      .catch(error => {
        const errorMessage = error.response?.data?.metadata?.message || error.message || "Server error";
        notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
        console.log(error);
      });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-diamond-container">
      <div className="add-diamond-content">
        <div className="add-diamond-form">
          <h2 className="add-diamond-title">Thêm sản phẩm từ Kim cương</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Mã sản phẩm:</label>
                <input type="text" name="productCode" placeholder='Hãy nhập mã sản phẩm' value={newDiamond.productCode} onChange={handleInputChange} required />
              </div>
              <div className="add-diamond-form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" name="productName" placeholder='Hãy nhập tên sản phẩm' value={newDiamond.productName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Mã đá quý:</label>
                <input type="text" name="gemCode" placeholder='Hãy nhập mã đá quý' value={newDiamond.gemCode} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Tên kim cương:</label>
                <input type="text" name="diamondName" placeholder='Hãy nhập tên kim cương' value={newDiamond.diamondName} onChange={handleInputChange} required />
              </div>
              <div className="add-diamond-form-group">
                <label>Nguồn gốc:</label>
                <select type="text" name="origin" value={newDiamond.origin} onChange={handleInputChange} required>
                  <option value="" disabled>Hãy chọn nguồn gốc</option>
                  <option value="TỰ NHIÊN">TỰ NHIÊN</option>
                  <option value="NHÂN TẠO">NHÂN TẠO</option>
                </select>
              </div>
            </div>
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Màu sắc:</label>
                <select type="text" name="color" value={newDiamond.color} onChange={handleInputChange} required>
                  <option value="" disabled>Hãy chọn màu sắc</option>
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
              <div className="add-diamond-form-group">
                <label>Độ tinh khiết:</label>
                <select type="text" name="clarity" value={newDiamond.clarity} onChange={handleInputChange} required>
                  <option value="" disabled>Hãy chọn độ tinh khiết</option>
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
            <div className="add-diamond-form-row">
              <div className="add-diamond-form-group">
                <label>Vết cắt:</label>
                <select name="cut" value={newDiamond.cut} onChange={handleInputChange} required>
                  <option value="" disabled>Hãy chọn loại vết cắt</option>
                  <option value="EX">EX</option>
                  <option value="G">G</option>
                  <option value="F">F</option>
                  <option value="P">P</option>
                </select>
              </div>
              <div className="add-diamond-form-group">
                <label>Khối lượng:</label>
                <input type="number" name="carat" value={newDiamond.carat} onChange={handleInputChange} min={0.1} step={0.01} />
              </div>
            </div>
            <div className="add-diamond-form-footer">
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
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }} type="submit">Thêm sản phẩm</button>
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