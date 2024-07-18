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
        setLoading(false); // Đánh dấu đã tải xong
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
        notification.error({ message: errorMessage });
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
      ) :(
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
                <h2 className="updiamond-static-input" name="color">{sp.gem[0].color}</h2>
              </div>
              <div className="updiamond-form-group">
                <label>Độ tinh khiết:</label>
                <h2 className="updiamond-static-input" name="clarity">{sp.gem[0].clarity}</h2>
              </div>
            </div>
            <div className="updiamond-form-row">
              <div className="updiamond-form-group">
                <label>Vết cắt:</label>
                <h2 className="updiamond-static-input" name="cut">{sp.gem[0].cut}</h2>
              </div>
              <div className="updiamond-form-group">
                <label>Khối lượng:</label>
                <h2 className="updiamond-static-input" name="carat">{sp.gem[0].carat}</h2>
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
      )
    }
</>
    
  );
}

export default UpDiamond;
