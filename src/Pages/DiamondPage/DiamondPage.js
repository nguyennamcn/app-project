import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './DiamondPage.css';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import QrScanner from 'react-qr-scanner';
const { Meta } = Card;

export default function DiamondPage() {
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    adornicaServ.getListDiamond()
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
      size: selectedSize,
      sizeId: selectedId,
      quantity: quantity,
      price: product.productPrice,
      totalPrice: quantity * product.productPrice,
    };
    console.log(item);
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode);

    if (product.productPrice < 0) {
      showModal(<div className='notice__content'><i className="error__icon fa-solid fa-question" ></i><h1>Product has not been priced yet !</h1></div>);
      return;
    }

    if (existingItemIndex > -1) {
      showModal(<div className='notice__content'><i className="error__icon fa-solid fa-circle-xmark" ></i><h1>Product was added !</h1></div>);
    } else {
      cartItems.push(item);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      showModal(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check" ></i><h1>Product added successfully !</h1></div>);
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const filteredProducts = products.filter(product => 
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(offset, offset + itemsPerPage);

  return (
    <div className='home-diamond-page'>
      <div className='home-diamond-filter'>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsQRModalVisible(true)} className="home-diamond-scan-button">Scan Code</button>
        </div>
  
        <div className='home-diamond-search-input-diamond'>
          <textarea 
            placeholder='Search by product code or name...' 
            value={searchTerm} 
            onChange={handleSearch} 
            rows={2}
            style={{ width: '300px', height: '25px', resize: 'none', outline: 'none', margin: '-4px 0 -4px 8px' }}
          />
          <svg style={{ marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" maxWidth="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </div>
  
      <div className="home-diamond--container">
        {currentItems.length > 0 ? (
          currentItems.map((sp) => (
            <div className="home-diamond-card-container" key={sp.productCode}>
              <Card
                bodyStyle={{ padding: '8px' }}
                style={{ width: '100%', textAlign: 'center', borderRadius: '10px', position: 'relative' }}
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '190px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
              >
                <Meta title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>} description={sp.categoryType} />
                <div className="home-diamond--info">
                  <h1>{sp.productCode}</h1>
                  <h2>{sp.productPrice < 1 ? 'Not yet been priced' : `${sp.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</h2>

                </div>
                <div className="home-diamond-overlay">
                  <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
                    <button className="home-diamond-overlay-button">View</button>
                  </NavLink>
                  <button className="home-diamond-overlay-button" onClick={() => handleAddToCart(sp.productCode)}>Add</button>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="no-products-message-container">
            {searchTerm ? (
            <div className="no-products-message">No products found matching your search criteria.</div>
          ) : null }
          </div>
        )}
      </div>
  
      <div className="home-diamond-pagination-container">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'home-diamond-pagination'}
          activeClassName={'home-diamond-active'}
          pageClassName={'home-diamond-page-item'}
          pageLinkClassName={'home-diamond-page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          disabledClassName={'home-diamond-disabled'}
        />
      </div>
  
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        className="custom-modal-diamond"
      >
        <div>{modalMessage}</div>
      </Modal>
      <Modal
        visible={isQRModalVisible}
        footer={null}
        onCancel={() => setIsQRModalVisible(false)}
        className="custom-modal-diamond"
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
