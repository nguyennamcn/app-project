import React, { useState, useEffect } from 'react';
import { Card, List } from 'antd';
import { NavLink } from 'react-router-dom';
import './GoldPage.css';
import { adornicaServ } from '../../service/adornicaServ';
const { Meta } = Card;

export default function GoldPage() {

  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    adornicaServ.getListGold()
      .then((res) => {
        console.log(res.data.metadata.data);
        setProducts(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddToCart = (productCode) => {
    const product = products.find(p => p.productCode === productCode);
    const item = {
      productId: product.id,
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
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode && cartItem.size === item.size);

    if (existingItemIndex > -1) {
      // Update the quantity if the item exists
      cartItems[existingItemIndex].quantity += 1;
      cartItems[existingItemIndex].totalPrice += item.price;
    } else {
      // Add new item to the cart
      cartItems.push(item);
    }

    // Save updated cart items to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    alert('Added to cart');
  };

  return (
    <div>
      <div className='filter'>
        <div>
          <select name='jewelry__category' id='category'>
            <option value='gold-ring'>Gold ring</option>
            <option value='gold-bars'>Gold bars</option>
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
    </div>
  );
}