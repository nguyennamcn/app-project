import React, { useState, useEffect } from 'react';
import { Card, Modal } from 'antd';
import './JewelryCss.css';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';

const { Meta } = Card;

export default function JewelryPage() {
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
    //setTimeout(() => setIsModalVisible(false), 1000);
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

    // Get existing cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode);

    if (existingItemIndex > -1) {
      showModal(<div className='notice__content'><i class="error__icon fa-solid fa-circle-xmark" ></i><h1>Product was added !</h1></div>);
    } else {
      // Add new item to the cart
      cartItems.push(item);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Save updated cart items to local storage
      showModal(<div className='notice__content'><i class="check__icon fa-solid fa-circle-check" ></i><h1>Product added successfully !</h1></div>);
    }
  };

  return (
    <div>
      <div className='filter'>
        <div>
          <select name='jewelry__category' id='category'>
            <option value='Rings'>Rings</option>
            <option value='Earrings'>Earrings</option>
            <option value='Necklaces'>Necklaces</option>
            <option value='Bracelets'>Bracelets</option>
          </select>

          <select name='jewelry__gender' id='gender'>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>

        <div className='search__input'>
          <input type='text' placeholder='Search...' />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </div>
      <div className="product-container">
        {products.map((sp) => (
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
        ))}
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
