import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { Modal, notification } from 'antd';
import ReactPaginate from 'react-paginate';

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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>DIAMOND INVENTORY</h1>
        <NavLink to="/add-diamond" style={styles.addButton}>ADD DIAMOND</NavLink>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price (VND)</th>
            <th style={styles.th}>Size</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDiamonds.map((diamond) => (
            <tr key={diamond.productId}>
              <td style={styles.td}>{diamond.productId}</td>
              <td style={styles.td}>{diamond.productCode}</td>
              <td style={styles.td}>{diamond.productName}</td>
              <td style={styles.td}>{diamond.productPrice <= 0 ? 'Not yet been priced' : `${diamond.productPrice}`}</td>
              <td style={styles.td}>{diamond.size}</td>
              <td style={styles.td}>
                <NavLink to={`/update-diamond/${diamond.productId}`}>
                  <button style={styles.updateButton}>Update</button>
                </NavLink>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(diamond.productCode)}
                >
                  Delete
                </button>
                <button
                  style={diamond.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? styles.updateButton : styles.disabledButton}
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
      <div style={styles.footer}>
        <NavLink to="/inventory" style={styles.backButton}>BACK</NavLink>
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

const styles = {
  container: {
    margin:'30px 20px 20px 20px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: '#f7f3fc', // Màu tím nhạt
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '25px',
    color: '#6b46c1' // Màu tím đậm
  },
  addButton: {
    backgroundColor: '#6b46c1', // Màu tím đậm
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  th: {
    border: '2px solid #d3b5ff', // Màu viền tím nhạt
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#e9d8fd', // Màu nền tím nhạt
    color: '#6b46c1'
  },
  td: {
    border: '2px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  },
  updateButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '4px',
  },
  deleteButton: {
    marginRight: '5px',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '4px',
  },
  disabledButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#f0f0f0',
    color: '#888',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    marginBottom: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 20px'
  },
  pageButton: {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
