import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal, Button, notification, message } from 'antd';

const JewelryInventoryPage = () => {
  const [jewelry, setJewelry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentJewelryId, setCurrentJewelryId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    adornicaServ.getListJewelry()
      .then((res) => {
        console.log(res.data.metadata.data);
        setJewelry(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const showDeleteConfirm = (jewelryCode) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Do you really want to delete this product?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
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
        notification.success({ message: "Delete Successfully" });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
        notification.error({ message: errorMessage });
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
      currentJewelryId,
      selectedImages[0],
      selectedImages[1],
      selectedImages[2],
      selectedImages[3]
    ).then(() => {
      setIsModalVisible(false);
      setSelectedImages([]);
      setCurrentJewelryId(null);
      notification.success({message: 'Images updated successfully'});

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
      notification.error({ message: 'Error uploading images' });
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedImages([]);
    setCurrentJewelryId(null);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentJewelry = jewelry.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(jewelry.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>JEWELRY INVENTORY</h1>
        <NavLink to="/add-jewelry" style={styles.addButton}>ADD PRODUCT</NavLink>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Size</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentJewelry.map((item) => (
            <tr key={item.productId}>
              <td style={styles.td}>{item.productId}</td>
              <td style={styles.td}>{item.productCode}</td>
              <td style={styles.td}>{item.productName}</td>
              <td style={styles.td}>{item.productPrice <= 0 ? 'Not yet been priced' : (item.productPrice + "$")}</td>
              <td style={styles.td}>{item.size}</td>
              <td style={styles.td}>
                <NavLink to={`/update-jewelry/${item.productId}`}>
                  <button
                    style={styles.updateButton}
                    onClick={() => handleUpdate(item.productCode)}
                  >
                    Update
                  </button>
                </NavLink>
                <button
                  style={styles.deleteButton}
                  onClick={() => showDeleteConfirm(item.productCode)}
                >
                  Delete
                </button>
                <button
                  style={item.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" ? styles.updateButton : styles.disabledButton}
                  onClick={() => item.productImage === "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png" && handleUpdateImg(item.productId)}
                  disabled={item.productImage !== "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
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
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} style={styles.pageButton} onClick={() => changePage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
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
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
    backgroundColor: '#d3d3d3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: '',
    marginBottom: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '3px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 20px',
  },
  pageButton: {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default JewelryInventoryPage;
