import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './DiamondPage.css';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
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
  const itemsPerPage = 10; // Số sản phẩm mỗi trang

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

    if(product.productPrice < 0){
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
    <div className='diamond-page'>
      <div className='filter'>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        </div>

        <div className='search__input_diamond'>
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

      <div className="product-container">
        {currentItems.length > 0 ? (
          currentItems.map((sp) => (
            <div className="product-card-container" key={sp.productCode}>
              <Card
                bodyStyle={{ padding: '8px' }}
                style={{ width: '100%', textAlign: 'center', borderRadius: '10px', position: 'relative' }}
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '146px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
              >
                <Meta title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>} description={sp.categoryType} />
                <div className="product-info">
                  <h1>{sp.productCode}</h1>
                  <h2> {sp.productPrice < 1 ? 'Undefined' : `${sp.productPrice}  VND`} </h2>
                </div>
                <div className="overlay">
                  <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
                    <button className="overlay-button">View</button>
                  </NavLink>
                  <button className="overlay-button" onClick={() => handleAddToCart(sp.productCode)}>Add</button>
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
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
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        className="custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>
  );
}
