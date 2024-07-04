import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { Modal, notification } from 'antd';
import ReactPaginate from 'react-paginate';

import './ManageGold.css'; // Import CSS file for styling

export default function ManageGold() {
  const [goldManage, setGoldManage] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentGoldId, setCurrentGoldId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng mục trên mỗi trang
  const totalPages = Math.ceil(goldManage.length / itemsPerPage);

  useEffect(() => {
    adornicaServ.getListGold()
      .then((res) => {
        console.log(res.data.metadata.data);
        setGoldManage(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const showDeleteConfirm = (goldCode) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Do you really want to delete this product?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(goldCode);
      }
    });
  };

  const handleDelete = (goldCode) => {
    adornicaServ.deleteProduct(goldCode)
      .then(() => {
        const newProductData = goldManage.filter((item) => item.productCode !== goldCode);
        setGoldManage(newProductData);
        notification.success({ message: "Delete Successfully" });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(err);
      });
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleInputChange = (e, productId) => {
    const { name, value } = e.target;
    setGoldManage(prevState =>
      prevState.map(product =>
        product.materialId === productId ? { ...product, [name]: value } : product
      )
    );
  };

  const handleUpdate = (productId) => {
    const updatedProduct = goldManage.find(product => product.materialId === productId);
    console.log('Updated product with id: ', updatedProduct);
  };

  const handleUpdateImg = (goldId) => {
    setCurrentGoldId(goldId);
    setIsModalVisible(true);
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
      currentGoldId,
      selectedImages[0],
      selectedImages[1],
      selectedImages[2],
      selectedImages[3]
    ).then(() => {
      setIsModalVisible(false);
      setSelectedImages([]);
      setCurrentGoldId(null);
      notification.success({ message: 'Images updated successfully' });

      adornicaServ.getListGold()
        .then((res) => {
          console.log(res.data.metadata.data);
          setGoldManage(res.data.metadata.data);
        })
        .catch((err) => {
          console.log(err);
        });

    }).catch((err) => {
      console.log("Error uploading images:", err.response.data);
      notification.error({ message: 'Error uploading images' });
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedImages([]);
    setCurrentGoldId(null);
  };

  const firstItemIndex = currentPage * itemsPerPage;
  const lastItemIndex = firstItemIndex + itemsPerPage;
  const currentGold = goldManage.slice(firstItemIndex, lastItemIndex);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };
  const formatPrice = (price) => {
    if (price <= 0 || isNaN(price)) {
      return 'Not yet been priced';
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  

  return (
    <div className="gold-container">
      <header className="gold-header">
        <h1 className="gold-title">GOLD</h1>
        <NavLink to="/add-gold" style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>ADD GOLD</NavLink>
      </header>
      <table className="gold-table">
        <thead>
          <tr>
            <th className="gold-th">ID</th>
            <th className="gold-th">Code</th>
            <th className="gold-th">Name</th>
            <th className="gold-th">Price (VND)</th>
            <th className="gold-th">Size</th>
            <th className="gold-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentGold.map((product) => (
            <tr key={product.productId}>
              <td className="gold-td" data-label="ID">{product.productId}</td>
              <td className="gold-td" data-label="Code">{product.productCode}</td>
              <td className="gold-td" data-label="Name">{product.productName}</td>
              <td className="gold-td" data-label="Price (VND)">{formatPrice(product.productPrice)}</td>
              <td className="gold-td" data-label="Size">{product.size}</td>
              <td className="gold-td" data-label="Action">
                <NavLink to={`/update-gold/${product.productId}`}>
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
                    onClick={() => handleUpdate(product.productCode)}

                  >
                    Update
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
                  onClick={() => showDeleteConfirm(product.productCode)}
                >
                  Delete
                </button>
                <button
                  className={product.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? "updateButton" : "disabledButton"}
                  onClick={() => product.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" && handleUpdateImg(product.productId)}
                  disabled={product.productImage !== "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
                >
                  Img
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="gold-footer">
        <NavLink to="/inventory" style={{
                                            backgroundColor: 'gray',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>BACK</NavLink>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
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
        title={`Update Images of product ID: ${currentGoldId}`}
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
};