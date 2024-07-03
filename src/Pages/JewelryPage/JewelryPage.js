import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import './JewelryCss.css';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import QrScanner from 'react-qr-scanner';

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
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    adornicaServ.getListJewelry()
      .then((res) => {
        console.log(res.data.metadata.data);
        setProducts(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
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

    if(product.productPrice < 0){
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
    <div className="home-jewelry-page">
      <div className='home-jewelry-filter'>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setIsSizeModalVisible(true)} className="home-jewelry-size-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-rulers" viewBox="0 0 16 16">
              <path d="M2.23 0a.5.5 0 0 0-.5.5v1.75a.5.5 0 0 0 1 0V1H6v.25a.5.5 0 0 0 1 0V1h2v.25a.5.5 0 0 0 1 0V1h2.5v1.25a.5.5 0 0 0 1 0V.5a.5.5 0 0 0-.5-.5H2.23zM1 2.5v10.77a.5.5 0 0 0 .5.5h1.75a.5.5 0 0 0 0-1H2V10h.25a.5.5 0 0 0 0-1H2V7h.25a.5.5 0 0 0 0-1H2V4h.25a.5.5 0 0 0 0-1H2V2h.25a.5.5 0 0 0 0-1H1.5a.5.5 0 0 0-.5.5zM13 2v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm0 3v1h.5a.5.5 0 0 0 0-1H13zm-2-6v1h.5a.5.5 0 0 0 0-1H11zm0 3v1h.5a.5.5 0 0 0 0-1H11zm0 3v1h.5a.5.5 0 0 0 0-1H11zm-2-6v1h.5a.5.5 0 0 0 0-1H9zm0 3v1h.5a.5.5 0 0 0 0-1H9zm0 3v1h.5a.5.5 0 0 0 0-1H9z"/>
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
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '190px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
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
                  <button className="home-jewelry-overlay-button" onClick={() => handleAddToCart(sp.productCode)}>Add</button>
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
  );
}
