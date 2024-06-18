import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './DiamondPage.css';
import { adornicaServ } from '../../service/adornicaServ';
const { Meta } = Card;

export default function DiamondPage() {

  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

    // Get existing cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode );

    if (existingItemIndex > -1) {
      showModal(<div className='notice__content'><i className="error__icon fa-solid fa-circle-xmark" ></i><h1>Product was added !</h1></div>);
    } else {
      // Add new item to the cart
      cartItems.push(item);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Save updated cart items to local storage
      showModal(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check" ></i><h1>Product added successfully !</h1></div>);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='filter' style={{
        display: 'flex',
        marginTop: '-6px',
        marginBottom: '6px',
        marginLeft: '22px',
        justifyContent: 'space-between',
      }}>

        <div>
          <select name='jewelry__category' id='Carat'>
            <option value='Carat'>Carat</option>
            <option value='Carat'>0.30-0.49</option>
            <option value='Carat'>0.50-0.89</option>
            <option value='Carat'>0.9-1.3</option>
            <option value='Carat'>1.4-1.9</option>
            <option value='Carat'>2.0-3.0</option>
            <option value='Carat<'>above 3.0</option>
          </select>

          <select name='jewelry__size' id='size'>
            <option value='size'>Cut</option>
            <option value='size'>EX</option>
            <option value='size'>G</option>
            <option value='size'>F</option>
            <option value='size'>P</option>
          </select>

          <select name='jewelry__color' id='color'>
            <option value='color'>Color</option>
            <option value=''>D</option>
            <option value=''>E</option>
            <option value=''>F</option>
            <option value=''>G</option>
            <option value=''>H</option>
            <option value=''>I</option>
            <option value=''>J</option>
            <option value=''>K</option>
            <option value=''>L</option>
            <option value=''>M</option>
          </select>

          <select name='jewelry__clarity' id='clarity'>
            <option value='clarity'>Clarity</option>
            <option value='FL'>FL</option>
            <option value='IF'>IF</option>
            <option value='VVS1'>VVS1</option>
            <option value='VVS2'>VVS2</option>
            <option value='VS1'>VS1</option>
            <option value='VS2'>VS2</option>
            <option value='SI1'>SI1</option>
            <option value='SI2'>SI2</option>
            <option value='I1'>I1</option>
            <option value='I2'>I2</option>
            <option value='I3'>I3</option>
          </select>
        </div>

        <div className='search__input ' style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '6px',
          border: 'solid black 1px',
          borderRadius: '20px',
        }}>
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((sp) => (
            <div className="product-card-container" key={sp.productCode}>
              <Card
                bodyStyle={{ padding: '8px' }}
                style={{ width: '100%', textAlign: 'center', borderRadius: '10px', position: 'relative' }}
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '146px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
              >
                <Meta title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>} description={sp.categoryType} />
                <div className="product-info">
                  <h1>{sp.productCode}</h1>
                  <h2>{sp.productPrice}$</h2>
                </div>
                <div className="overlay">
                  <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
                    <button className="overlay-button">View</button>
                  </NavLink>
                  <button className="overlay-button" onClick={() => handleAddToCart(sp.productCode)}>Add to Cart</button>
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
      <Modal
        title="Notification"
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
