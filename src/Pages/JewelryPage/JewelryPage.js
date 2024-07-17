import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import './JewelryCss.css';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import QrScanner from 'react-qr-scanner';
import braceletImage from '../../asset/img/Lactay.png';
import necklaceImage from '../../asset/img/Daychuyen.png';
import { useSelector } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';

const { Meta } = Card;

export default function JewelryPage() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(5);
  const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
  const [isBraceletSizeModalVisible, setIsBraceletSizeModalVisible] = useState(false);
  const [isNecklaceSizeModalVisible, setIsNecklaceSizeModalVisible] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
  const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
  const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');

  useEffect(() => {
    adornicaServ.getListJewelry()
      .then((res) => {
        console.log(res.data.metadata.data);
        setProducts(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, []);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const handleAddToCart = (productCode) => {
    const product = products.find(p => p.productCode === productCode);
    const item = {
      productId: product.productId,
      productCode: product.productCode,
      name: product.productName,
      size: product.size,
      quantity: quantity,
      price: product.productPrice,
      totalPrice: quantity * product.productPrice,
    };
    console.log(item);

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode);

    if (product.productPrice < 0) {
      showModal(<div className='home-jewelry-notice-content'><i className="home-jewelry-error-icon fa-solid fa-question" ></i><h1>Product has not been priced yet !</h1></div>);
      return;
    }

    if (existingItemIndex > -1) {
      showModal(<div className='home-jewelry-notice-content'><i className="home-jewelry-error-icon fa-solid fa-circle-xmark" ></i><h1>Product was added !</h1></div>);
    } else {
      cartItems.push(item);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      showModal(<div className='home-jewelry-notice-content'><i className="home-jewelry-check-icon fa-solid fa-circle-check" ></i><h1>Product added successfully !</h1></div>);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setSearchTerm(data); // Set search term to scanned data
      setIsQRModalVisible(false); // Close QR modal after scan
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const filteredProducts = products.filter(product =>
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="home-jewelry-page">
      <div className='home-jewelry-filter'>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setIsSizeModalVisible(true)} className="home-jewelry-size-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-rulers" viewBox="0 0 16 16">
              <path d="M2.23 0a.5.5 0 0 0-.5.5v1.75a.5.5 0 0 0 1 0V1H6v.25a.5.5 0 0 0 1 0V1h2v.25a.5.5 0 0 0 1 0V1h2.5v1.25a.5.5 0 0 0 1 0V.5a.5.5 0 0 0-.5-.5H2.23zM1 2.5v10.77a.5.5 0 0 0 .5.5h1.75a.5.5 0 0 0 0-1H2V10h.25a.5.5 0 0 0 0-1H2V7h.25a.5.5 0 0 0 0-1H2V4h.25a.5.5 0 0 0 0-1H2V2h.25a.5.5 0 0 0 0-1H1.5a.5.5 0 0 0-.5.5zM13 2v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm-2-6v1h.5a.5.5 0 0 0 0-1H11zm0 3v1h.5a.5.5 0 0 0 0-1H11zm0 3v1h.5a.5.5 0 0 0 0-1H11zm-2-6v1h.5a.5.5 0 0 0 0-1H9zm0 3v1h.5a.5.5 0 0 0 0-1H9zm0 3v1h.5a.5.5 0 0 0 0-1H9z" />
            </svg>
          </button>
          <button onClick={() => setIsBraceletSizeModalVisible(true)} className="home-jewelry-size-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.996 0A8 8 0 0 0 0 8a8 8 0 0 0 6.93 7.93v-1.613a1.06 1.06 0 0 0-.717-1.008A5.6 5.6 0 0 1 2.4 7.865 5.58 5.58 0 0 1 8.054 2.4a5.6 5.6 0 0 1 5.535 5.81l-.002.046-.012.192-.005.061a5 5 0 0 1-.033.284l-.01.068c-.685 4.516-6.564 7.054-6.596 7.068A7.998 7.998 0 0 0 15.992 8 8 8 0 0 0 7.996.001Z" />
            </svg>
          </button>
          <button onClick={() => setIsNecklaceSizeModalVisible(true)} className="home-jewelry-size-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
            </svg>
          </button>
          <button onClick={() => setIsQRModalVisible(true)} className="home-jewelry-scan-button">Scan Code</button>
        </div>

        <div className='home-jewelry-search-input-jewelry'>
          <textarea
            placeholder='Search by product code or name...'
            value={searchTerm}
            onChange={handleSearch}
            rows={2}
            style={{ width: '300px', height: '25px', resize: 'none' }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </div>
      <div className="home-jewelry-container">
        {currentProducts.length > 0 ? (
          currentProducts.map((sp) => (
            <div className="home-jewelry-card-container" key={sp.productCode}>
              <Card
                bodyStyle={{ padding: '8px' }}
                style={{ width: '100%', textAlign: 'center', borderRadius: '10px', position: 'relative' }}
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '170px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
              >
                <Meta title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>} description={sp.categoryType} />
                <div className="home-jewelry-info">
                  <h1>{sp.productCode}</h1>
                  <h2>{sp.productPrice < 1 ? 'Not yet been priced' : `${sp.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</h2>

                </div>
                <div className="home-jewelry-overlay">
                  <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
                    <button className="home-jewelry-overlay-button">View</button>
                  </NavLink>

                  {isAdmin || isCashier || isManager ? (null
                  ) : (
                    <button className="home-jewelry-overlay-button" onClick={() => handleAddToCart(sp.productCode)}>Add</button>
                  )}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="no-products-message-container">
            {searchTerm ? (
              <div className="no-products-message">No products found matching your search criteria.</div>
            ) : null}
          </div>
        )}
      </div>
      <div className="home-jewelry-pagination-container">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'home-jewelry-pagination'}
          activeClassName={'home-jewelry-active'}
          pageClassName={'home-jewelry-page-item'}
          pageLinkClassName={'home-jewelry-page-link'}
          previousClassName={'home-jewelry-page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          disabledClassName={'home-jewelry-disabled'}
        />
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        className="home-jewelry-custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
      <Modal
        visible={isSizeModalVisible}
        footer={null}
        onCancel={() => setIsSizeModalVisible(false)}
        className="home-jewelry-custom-modal"
      >
        <div>
          <img src="https://vuanem.com/blog/wp-content/uploads/2022/09/bang-size-nhan-nam1-1.jpg" alt="Ring Sizes" style={{ width: '100%' }} />
        </div>
      </Modal>
      <Modal
        visible={isBraceletSizeModalVisible}
        footer={null}
        onCancel={() => setIsBraceletSizeModalVisible(false)}
        className="home-jewelry-custom-modal-bracelet"
      >
        <div className='size_img_bracelet'>
          <img src={braceletImage} alt="Bracelet Sizes" style={{ width: '100%' }} />
        </div>
      </Modal>
      <Modal
        visible={isNecklaceSizeModalVisible}
        footer={null}
        onCancel={() => setIsNecklaceSizeModalVisible(false)}
        className="home-jewelry-custom-modal-necklace"
      >
        <div>
          <img src={necklaceImage} alt="Necklace Sizes" style={{ width: '100%' }} />
        </div>
      </Modal>

      <Modal
        visible={isQRModalVisible}
        footer={null}
        onCancel={() => setIsQRModalVisible(false)}
        className="home-jewelry-custom-modal"
      >
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </Modal>
        </div>
      )
    }
    </>
    
  );
}
