import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { Modal, notification } from 'antd';
import ReactPaginate from 'react-paginate';
import './ManageDiamond.css'; 

export default function ManageDiamond() {
  const [diamondManage, setDiamondManage] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentDiamondId, setCurrentDiamondId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng mục trên mỗi trang
  const totalPages = Math.ceil(diamondManage.length / itemsPerPage);

  useEffect(() => {
    adornicaServ.getListDiamond()
      .then((res) => {
        console.log(res.data.metadata.data);
        setDiamondManage(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (diamondCode) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this diamond?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        adornicaServ.deleteProduct(diamondCode)
          .then(() => {
            const newProductData = diamondManage.filter((item) => item.productCode !== diamondCode);
            setDiamondManage(newProductData);
            notification.success({ message: "Delete Successfully" });
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
            notification.error({ message: errorMessage });
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
      notification.error({ message: 'Please select all 4 images' });
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
      notification.success({message: 'Images updated successfully'});

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
      notification.error({ message: 'Error uploading images' });
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
      return 'Not yet been priced'; 
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div className="diamond-container">
      <header className="diamond-header">
        <h1 className="diamond-title">DIAMOND INVENTORY</h1>
        <NavLink to="/add-diamond" style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>ADD DIAMOND</NavLink>
      </header>
      <table className="diamond-table">
        <thead>
          <tr>
            <th  className="diamond-th">ID</th>
            <th  className="diamond-th">Code</th>
            <th  className="diamond-th">Name</th>
            <th  className="diamond-th">Price (VND)</th>
            <th  className="diamond-th">Size</th>
            <th  className="diamond-th">Action</th>
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
                  <button  className="updateButton">Update</button>
                </NavLink>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(diamond.productCode)}
                >
                  Delete
                </button>
                <button
                   className={diamond.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? "updateButton" : "disabledButton"}
                  onClick={() => diamond.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" && handleUpdateImg(diamond.productId)}
                  disabled={diamond.productImage !== "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
                >
                  Img
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div  className="diamond-footer">
        <NavLink to="/inventory" className="backButton">BACK</NavLink>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
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
  );
}

