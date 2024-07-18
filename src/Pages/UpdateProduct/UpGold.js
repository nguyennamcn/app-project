import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './UpGold.css';
import { adornicaServ } from '../../service/adornicaServ';
import Spinner from '../../Components/Spinner/Spinner';

function UpGold() {
  const { productCode } = useParams();
  const [loading, setLoading] = useState(true);
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
        const productData = res.data.metadata;
        const firstMaterial = productData.materials.length > 0 ? productData.materials[0] : {};
        setSp({ ...productData, materials: [firstMaterial] });
        console.log("Data from api: ", productData);
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

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    const updatedMaterials = sp.materials.map((material, index) => {
      if (index === 0) { // Assuming you want to update the first material
        return { ...material, [name]: value };
      }
      return material;
    });
    setSp({ ...sp, materials: updatedMaterials });
    console.log("Material to update",updatedMaterials);
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
    console.log("productData sent: ", productData);
    adornicaServ.updateProduct(productCode, productData)
      .then((response) => {
        notification.success({ message: 'Cập nhật thành công' });
        console.log(productData);
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
        <div className="upgold-container">
      <div className="upgold-content">
        <div className="upgold-form">
          <h2 className="upgold-title">Chỉnh sửa Vàng</h2>
          <form onSubmit={handleUpdate}>
            <div className="upgold-form-row">
              <div className="upgold-form-group">
                <label>Mã sản phẩm:</label>
                <h2 className="upgold-static-input">{sp.productCode}</h2>
              </div>
              <div className="upgold-form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" name="productName" value={sp.productName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="upgold-form-row">
              <div className="upgold-form-group">
                <label>Vật liệu ID:</label>
                <h2 className="upgold-static-input">{sp.materials[0]?.name || ''}</h2>
              </div>
              <div className="upgold-form-group">
                <label>Khối lượng (gram):</label>
                <input type="number" name="weight" value={sp.materials[0]?.weight || ''} onChange={handleMaterialChange} min={0.1} step={0.1} />
              </div>
            </div>
            <div className="upgold-form-footer">
              <NavLink to="/ManageGold" style={{
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
                }} type="submit">Cập nhật</button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        title="Notification"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        className="custom-modal-upgold"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>
      )
    }
</>
    
  );
}

export default UpGold;
