import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { Modal, notification } from 'antd';
import ReactPaginate from 'react-paginate';
import './ManageDiamond.css'; 
import Spinner from '../../Components/Spinner/Spinner';

export default function ManageDiamond() {
  const [diamondManage, setDiamondManage] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentDiamondId, setCurrentDiamondId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng mục trên mỗi trang
  const totalPages = Math.ceil(diamondManage.length / itemsPerPage);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adornicaServ.getListDiamond()
      .then((res) => {
        console.log(res.data.metadata.data);
        setDiamondManage(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, []);

  const handleDelete = (diamondCode) => {
    Modal.confirm({
      content: 'Bạn có muốn xóa sản phẩm này không?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        adornicaServ.deleteProduct(diamondCode)
          .then(() => {
            const newProductData = diamondManage.filter((item) => item.productCode !== diamondCode);
            setDiamondManage(newProductData);
            notification.success({ message: "Xóa thành công" });
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
            notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
            console.log(err);
          });
      },
      onCancel() {
        console.log('Delete canceled');
      },
    });
  };

  const handleUpdateImg = (diamondId) => {
    setCurrentDiamondId(diamondId);
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
      currentDiamondId,
      selectedImages[0],
      selectedImages[1],
      selectedImages[2],
      selectedImages[3]
    ).then(() => {
      setIsModalVisible(false);
      setSelectedImages([]);
      setCurrentDiamondId(null);
      notification.success({message: 'Đã thêm hình ảnh thành công'});

      adornicaServ.getListDiamond()
      .then((res) => {
        console.log(res.data.metadata.data);
        setDiamondManage(res.data.metadata.data);
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
    setCurrentDiamondId(null);
  };

  const firstItemIndex = currentPage * itemsPerPage;
  const lastItemIndex = Math.min(firstItemIndex + itemsPerPage, diamondManage.length);
  const currentDiamonds = diamondManage.slice(firstItemIndex, lastItemIndex);
  const formatPrice = (price) => {
    if (price <= 0 || isNaN(price)) {
      return 'Sản phẩm chưa có giá'; 
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="diamond-container">
      <header className="diamond-header">
        <h1 className="diamond-title">Kim cương</h1>
        <NavLink to="/add-diamond" style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>Thêm sản phẩm</NavLink>
      </header>
      <table className="diamond-table">
        <thead>
          <tr>
            <th  className="diamond-th">ID</th>
            <th  className="diamond-th">Mã sản phẩm</th>
            <th  className="diamond-th">Tên sản phẩm</th>
            <th  className="diamond-th">Giá (VND)</th>
            <th  className="diamond-th">Kích cỡ</th>
            <th  className="diamond-th"></th>
          </tr>
        </thead>
        <tbody>
          {currentDiamonds.map((diamond) => (
            <tr key={diamond.productId}>
              <td className="diamond-td" data-label="ID">{diamond.productId}</td>
              <td className="diamond-td" data-label="Code">{diamond.productCode}</td>
              <td className="diamond-td" data-label="Name">{diamond.productName}</td>
              <td className="gold-td" data-label="Price (VND)">{formatPrice(diamond.productPrice)}</td>
              <td className="diamond-td" data-label="Size">{diamond.size}</td>
              <td className="diamond-td" data-label="Action">
                <NavLink to={`/update-diamond/${diamond.productId}`}>
                  <button  style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight:'5px'
                                        }}>Chinh sửa</button>
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
                  onClick={() => handleDelete(diamond.productCode)}
                >
                  Xóa
                </button>
                <button
                  className={diamond.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? "updateButton" : "disabledButton"}
                  onClick={() => diamond.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" && handleUpdateImg(diamond.productId)}
                  disabled={diamond.productImage !== "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
                >
                  Hình ảnh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div  className="diamond-footer">
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
        title={`Update Images of product ID: ${currentDiamondId}`}
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
}
