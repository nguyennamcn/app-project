import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { Modal, notification, message } from 'antd';

export default function ManageGold() {
  const [goldManage, setGoldManage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentGoldId, setCurrentGoldId] = useState(null);
  const itemsPerPage = 5;

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

  const handleDelete = (goldCode) => {
    adornicaServ.deleteProduct(goldCode)
      .then(() => {
        const newProductData = goldManage.filter((item) => item.productCode !== goldCode);
        setGoldManage(newProductData);
      })
      .catch((err) => {
        console.log("Error deleting order:", err);
      });
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
    console.log('Updated Product:', updatedProduct);
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
      message.success('Images updated successfully');
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

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentGold = goldManage.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(goldManage.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GOLD</h1>
        <NavLink to="/add-gold" style={styles.addButton}>ADD GOLD</NavLink>
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
          {currentGold.map((product) => (
            <tr key={product.productId}>
              <td style={styles.td}>{product.productId}</td>
              <td style={styles.td}>{product.productCode}</td>
              <td style={styles.td}>{product.productName}</td>
              <td style={styles.td}>{product.productPrice <= 0 ? 'undefinded' : product.productPrice}</td>
              <td style={styles.td}>{product.size}</td>
              <td style={styles.td}>
              <NavLink to={`/update-gold/${product.productId}`}>
                <button
                  style={styles.updateButton}
                  onClick={() => handleUpdate(product.productCode)}
                >
                  Update
                </button>
                </NavLink>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(product.productCode)}
                >
                  Delete
                </button>
                <button
                  style={styles.updateButton}
                  onClick={() => handleUpdateImg(product.productId)}
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

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxHeight: '70vh',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingRight: '20px'
  },
  title: {
    margin: 0,
    fontSize: '25px',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  updateButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom:'4px',
  },
  deleteButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom:'4px',
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
  backButtonHover: {
    backgroundColor: '#e0e0e0'
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
