import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Button, notification, message } from 'antd';
import ReactPaginate from 'react-paginate';
import './ManageJewelry.css'; 
import Spinner from '../../Components/Spinner/Spinner';

const JewelryInventoryPage = () => {
  const [jewelry, setJewelry] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentJewelryId, setCurrentJewelryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng mục trên mỗi trang
  const totalPages = Math.ceil(jewelry.length / itemsPerPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adornicaServ.getListJewelry()
      .then((res) => {
        console.log(res.data.metadata.data);
        const sortedData = res.data.metadata.data.sort((a, b) => b.productId - a.productId);
        setJewelry(sortedData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, []);

  const showDeleteConfirm = (jewelryCode) => {
    Modal.confirm({
      content: 'Bạn có muốn xóa sản phẩm này không?',
      okText: 'Có',
      okType: 'danger', 
      cancelText: 'Không',
      onOk() {
        handleDelete(jewelryCode);
      }
    });
  };

  const handleDelete = (jewelryCode) => {
    adornicaServ.deleteProduct(jewelryCode)
      .then(() => {
        const newProductData = jewelry.filter((item) => item.productCode !== jewelryCode);
        setJewelry(newProductData);
        notification.success({ message: "Xóa thành công" });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
        notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
        console.log(err);
      });
  };

  const handleUpdate = (jewelryId) => {
    const updatedItem = jewelry.find(item => item.id === jewelryId);
    console.log('Updated Jewelry:', updatedItem);
  };

  const handleUpdateImg = (jewelryId) => {
    setCurrentJewelryId(jewelryId);
    setIsModalVisible(true);
  };
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber - 1); // Trang bắt đầu từ 0
  };

  const handleImageChange = (e, index) => {
    const files = [...selectedImages];
    files[index] = e.target.files[0];
    setSelectedImages(files);
  };

  const handleModalOk = () => {
    if (selectedImages.length !== 4) {
      notification.error({ message: 'Hãy lựa chọn 4 hình ảnh' });
      return;
    }

    adornicaServ.postProductImg(
      currentJewelryId,
      selectedImages[0],
      selectedImages[1],
      selectedImages[2],
      selectedImages[3]
    ).then(() => {
      setIsModalVisible(false);
      setSelectedImages([]);
      setCurrentJewelryId(null);
      notification.success({message: 'Đã thêm hình ảnh thành công'});

      adornicaServ.getListJewelry()
      .then((res) => {
        console.log(res.data.metadata.data);
        setJewelry(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
      
    }).catch((err) => {
      console.log("Error uploading images:", err.response);
      notification.error({ message: 'Không thể tải lên hình ảnh' });
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedImages([]);
    setCurrentJewelryId(null);
  };

  const firstItemIndex = currentPage * itemsPerPage;
  const lastItemIndex = Math.min(firstItemIndex + itemsPerPage, jewelry.length);
  const currentJewelry = jewelry.slice(firstItemIndex, lastItemIndex);
  const formatPrice = (price) => {
    if (price <= 0 || isNaN(price)) {
      return 'Sản phẩm chưa có giá'; 
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  console.log(jewelry.image)

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div  className="jewelry-container">
      <header className="jewelry-header">
        <h1 className="jewelry-title">Sản phẩm Trang sức</h1>
        <NavLink to="/add-jewelry"  style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>Thêm sản phẩm</NavLink>
      </header>
      <table className="jewelry-table">
        <thead>
          <tr>
            <th className="jewelry-th">STT</th>
            <th className="jewelry-th">Mã sản phẩm</th>
            <th className="jewelry-th">Tên sản phẩm</th>
            <th className="jewelry-th">Giá (VND) </th>
            <th className="jewelry-th">Kích cỡ</th>
            <th className="jewelry-th"></th>
          </tr>
        </thead>
        <tbody>
          {currentJewelry.map((item, index) => (
            <tr key={item.productId}>
              <td className="jewelry-td" data-label="ID">{index + 1 + currentPage * itemsPerPage}</td>
              <td className="jewelry-td" data-label="Code">{item.productCode}</td>
              <td className="jewelry-td" data-label="Name">{item.productName}</td>
              <td className="gold-td" data-label="Price (VND)">{formatPrice(item.productPrice)}</td>
              <td className="jewelry-td" data-label="Size">{item.size}</td>
              <td className="jewelry-td" data-label="Action">
                <NavLink to={`/update-jewelry/${item.productId}`}>
                  <button
                    style={{
                      backgroundColor: '#00ca4d',
                      border: '1px solid purple',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight:'5px'
                  }}
                    onClick={() => handleUpdate(item.productCode)}
                  >
                    Chỉnh sửa
                  </button>
                </NavLink>
                <button
                  style={{
                    backgroundColor: 'red',
                    border: '1px solid purple',
                    color: 'white',
                    padding: '6px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight:'5px'
                }}
                  onClick={() => showDeleteConfirm(item.productCode)}
                >
                  Xóa
                </button>
                <button
                  className={item.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? "updateButton" : "disabledButton"}
                  onClick={() => item.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" && handleUpdateImg(item.productId)}
                  disabled={item.productImage !== "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
                >
                  Hình ảnh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="jewelry-footer">
        <NavLink to="/inventory" style={{
                                            backgroundColor: 'gray',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>Trở về</NavLink>
        <ReactPaginate
          previousLabel={'Trước'}
          nextLabel={'Sau'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          onPageChange={(data) => changePage(data.selected + 1)}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          disabledClassName={'disabled'}
        />
      </div>
      <Modal
        title={`Update Images of product ID: ${currentJewelryId}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div>
          {[...Array(4)].map((_, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <span style={{ marginRight: '6px' }}>Img {index + 1}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
      )
    }
</>
    
  );
};


export default JewelryInventoryPage;