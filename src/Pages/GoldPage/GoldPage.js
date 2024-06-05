import React, { useState, useEffect } from 'react';
import { Card, List } from 'antd';
import { NavLink } from 'react-router-dom';
import './GoldPage.css';
import { adornicaServ } from '../../service/adornicaServ';
const { Meta } = Card;

export default function GoldPage() {

  const [products, setProducts] = useState([]);

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
      <div className="gold-container">
        {products.map((sp) => (
          <div className="product-card-container" key={sp.productCode}>
            <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
              <Card
                hoverable
                bodyStyle={{ padding: '8px' }}
                style={{ width: '100%', textAlign: 'center', borderRadius: '10px' }}
                cover={<img style={{ padding: '10px', maxWidth: '100%', height: '150px', objectFit: 'cover' }} alt={sp.productName} src={sp.productImage} />}
              >
                <Meta title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>} description={sp.categoryType} />
                <div className="product-info">
                  <h1>{sp.productCode}</h1>
                  <h2>{sp.productPrice}$</h2>
                </div>
              </Card>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
