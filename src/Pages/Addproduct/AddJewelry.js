import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import './AddJewelry.css';
import { adornicaServ } from '../../service/adornicaServ';

const categorySizes = {
  1: ['SIZE_6', 'SIZE_7', 'SIZE_8', 'SIZE_9','SIZE_10', 'SIZE_11', 'SIZE_12', 'SIZE_13','SIZE_14', 'SIZE_15', 'SIZE_16', 'SIZE_17','SIZE_18', 'SIZE_19', 'SIZE_20'], // Ring sizes
  2: ['SIZE_14', 'SIZE_15', 'SIZE_16', 'SIZE_17','SIZE_18', 'SIZE_19', 'SIZE_20', 'SIZE_21', 'SIZE_22'], // Bracelet sizes
  3: ['SIZE_36', 'SIZE_38', 'SIZE_40', 'SIZE_42','SIZE_45', 'SIZE_48', 'SIZE_50', 'SIZE_55','SIZE_60'], // Necklace sizes
  4: ['SIZE_1', 'SIZE_2', 'SIZE_3', 'SIZE_4'], // Earrings sizes
};

function AddJewelry() {
  const [newJewelry, setNewJewelry] = useState({
    productCode: '', // not null
    productName: '', // not null
    gemCost: 0, 
    productionCost: null, // not null
    gender: '',
    categoryId: null, // id:1 ring, id: 2 Bracelet, id:3 Necklace, id:4 Earrings
    material: null,  // not null
    weight: null, // not null
    diamondName: '',
    gemCode: '',
    origin: '',
    color: '',
    clarity: '',
    cut: '',
    carat: 0,
    size: '', // size based on selected category
    isJewelryDiamond: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [addGemContent, setAddGemContent] = useState(false);
  const [availableSizes, setAvailableSizes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (newJewelry.categoryId) {
      setAvailableSizes(categorySizes[newJewelry.categoryId] || []);
      setNewJewelry({ ...newJewelry, size: categorySizes[newJewelry.categoryId]?.[0] || '' });
    }
  }, [newJewelry.categoryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let selectedIsJewelryDiamond = value === "true" ? true : value === "false" ? false : value;
    
    setNewJewelry((prevState) => ({ ...prevState, [name]: selectedIsJewelryDiamond }));
    
    if(name === 'isJewelryDiamond'){
    setAddGemContent(selectedIsJewelryDiamond);
    }
  };

   useEffect(() => {
    if (!addGemContent) {
      setNewJewelry((prevState) => ({
        ...prevState,
        diamondName: 'NONE',
        gemCode: 'NONE',
        origin: 'NONE',
        color: 'NONE',
        clarity: 'NONE',
        cut: 'NONE',
        carat: 0,
        gemCost: 0,
      }));
    } else {
      setNewJewelry((prevState) => ({
        ...prevState,
        diamondName: '',
        gemCode: '',
        origin: '',
        color: '',
        clarity: '',
        cut: '',
        carat: 0,
        gemCost: 0,
      }));
    }
  }, [addGemContent]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if(newJewelry.isJewelryDiamond === true){
      if(newJewelry.gemCode === ''){
        notification.warning({message: "Bạn chưa nhập mã kim cương"});
        return;
      }
      if(newJewelry.diamondName === ''){
        notification.warning({message: "Bạn chưa nhập tên kim cương"});
        return;
      }
      if(newJewelry.carat <= 0){
        notification.warning({message: "bạn chưa nhập carat"});
        return;
      }
      if(newJewelry.gemCost <= 0){
        notification.warning({message: "Bạn chưa nhập giá"});
        return;
      }
      
    }

    if(newJewelry.categoryId <= 0){
        notification.warning({message: "Bạn chưa chọn loại sản phẩm"});
        return;
      }
      if(newJewelry.material <= 0){
        notification.warning({message: "Bạn chưa chọn loại vật liệu"});
        return;
      }
      if(newJewelry.weight <= 0){
        notification.warning({message: "Bạn chưa chọn trọng lượng vật liệu"});
        return;
      }

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
      gemCode: newJewelry.gemCode,
      diamondName: newJewelry.diamondName,
      origin: newJewelry.origin,
      color: newJewelry.color,
      clarity: newJewelry.clarity,
      cut: newJewelry.cut,
      carat: Number(newJewelry.carat),
      size: newJewelry.size,
      isJewelryDiamond: newJewelry.isJewelryDiamond,
    };

    adornicaServ.postCreateProduct(productData)
      .then(response => {
        console.log(response.data.metadata);
        notification.success({ message: "Thêm sản phẩm thành công" });
        navigate('/ManageJewelry');
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
    <div className="add-gem-container">
      <div className="add-gem-content">
        <div className="add-gem-form">
          <h2 className="add-gem-title">Thêm sản phẩm từ Kim cương</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Mã sản phẩm:</label>
                <input type="text" name="productCode" placeholder='Hãy nhập mã sản phẩm' value={newJewelry.productCode} onChange={handleInputChange} required/>
              </div>
              <div className="add-gem-form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" name="productName" placeholder='Hãy nhập tên sản phẩm' value={newJewelry.productName} onChange={handleInputChange} required/>
              </div>
            </div>
            <div className="add-gem-form-row">
              
            <div className="add-gem-form-group">
                <label>Loại sản phẩm</label>
                <select name="categoryId" placeholder='Category id' value={newJewelry.categoryId} onChange={handleInputChange} required>
                  <option value={0}>Chọn loại sản phẩm</option>
                  <option value={1}>Nhẫn</option>
                  <option value={2}>Vòng tay</option>
                  <option value={3}>Vòng cổ</option>
                  <option value={4}>Bông tai</option>
                </select>
              </div>

              <div className="add-gem-form-group">
                <label>Kích cỡ:</label>
                <select name="size" value={newJewelry.size} onChange={handleInputChange}>
                  {availableSizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>

             
            </div>

            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Vật liệu:</label>
                <select name="material" placeholder='Material id' value={newJewelry.material} onChange={handleInputChange} required>
                  <option value={0}>Hãy chọn vật liệu</option>
                  <option value={1}>VÀNG 24K</option>
                  <option value={2}>VÀNG 18K</option>
                  <option value={3}>VÀNG TRẮNG</option>
                  {/* <option value={4}>GOLD BARS</option> */}
                </select>
              </div>
              <div className="add-gem-form-group">
                <label>Trọng lượng vật liệu (Chỉ):</label>
                <input type="number" name="weight" value={newJewelry.weight} onChange={handleInputChange} min={1} required/>
              </div>
            </div>
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Giới tính:</label>
                <select name="gender" value={newJewelry.gender} onChange={handleInputChange} required>
                  <option value="">Chọn giới tính</option>
                  <option value="UNISEX">UNISEX</option>
                  <option value="MALE">NAM</option>
                  <option value="FEMALE">NỮ</option>
                </select>
              </div>
              
              <div className="add-gem-form-group">
                <label>Chi phí sản xuất:</label>
                <input type="number" name="productionCost" placeholder='Hãy nhập chi phí sản xuất' value={newJewelry.productionCost} onChange={handleInputChange} min={1} required/>
              </div>

              <div className="add-gem-form-group">
                <label>Trang sức kim cương:</label>
                <select name="isJewelryDiamond" value={newJewelry.isJewelryDiamond} onChange={handleInputChange}>
                <option value="true">Có</option>
                <option value="false">Không</option>
                </select>
              </div>
            </div>
          {(addGemContent === true) && (
            <div className='gem-content'>
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Mã đá quý (Kim cương):</label>
                <input type="text" name="gemCode" placeholder='Hãy nhập mã đá quý của Kim cương' value={newJewelry.gemCode} onChange={handleInputChange} />
              </div>
            </div>
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Tên kim cương:</label>
                <input type="text" name="diamondName" placeholder='Hãy nhập tên của Kim cương' value={newJewelry.diamondName} onChange={handleInputChange} />
              </div>
              <div className="add-gem-form-group">
                <label>Nguồn gốc:</label>
                <select type="text" name="origin" value={newJewelry.origin} onChange={handleInputChange} required>
                  <option value="">Chọn nguồn gốc</option>
           
                  <option value="TỰ NHIÊN">TỰ NHIÊN</option>
                  <option value="NHÂN TẠO">NHÂN TẠO</option>
                </select>
              </div>
            </div>
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Màu sắc:</label>
                <select type="text" name="color" value={newJewelry.color} onChange={handleInputChange} required>
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
              <div className="add-gem-form-group">
                <label>Độ tinh khiết:</label>
                <select type="text" name="clarity" value={newJewelry.clarity} onChange={handleInputChange} required>
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
            <div className="add-gem-form-row">
              <div className="add-gem-form-group">
                <label>Vết cắt:</label>
                <select name="cut" value={newJewelry.cut} onChange={handleInputChange} required>
                  <option value="" disabled>Chọn loại vết cắt</option>
         
                  <option value="EX">EX</option>
                  <option value="G">G</option>
                  <option value="F">F</option>
                  <option value="P">P</option>
                </select>
              </div>
              <div className="add-gem-form-group">
                <label>Khối lượng (carat):</label>
                <input type="number" name="carat" value={newJewelry.carat} onChange={handleInputChange} min={0} step={0.1}/>
              </div>
              <div className="add-gem-form-group">
                <label>Giá đá quý:</label>
                <input type="number" name="gemCost" placeholder='Gem cost' value={newJewelry.gemCost} onChange={handleInputChange} min={0} />
              </div>
            </div>
          </div>
          )}  
          

            <div className="add-gem-form-footer">
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
        footer={<button className='btn__ok' onClick={handleModalOk}>OK</button>}
        className="custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>
  );
}

export default AddJewelry;
