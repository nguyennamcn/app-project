import React, { useState, useEffect } from 'react';
import { productServ } from './productService';
import { Card } from 'antd';
import './JewelryCss.css';
import { NavLink } from 'react-router-dom';

const { Meta } = Card;

export default function JewelryPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productServ.getProductList()
      .then((res) => {
        console.log(res.data.metadata.data);
        setProducts(res.data.metadata.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="jewelry-container">
      {products.map((sp) => (
        <div className="product-card-container" key={sp.productCode}>
          <NavLink to={`/detail/${sp.productCode}`}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt={sp.productName} src={sp.productImage} />}
            >
              <Meta title={sp.productName} description={sp.categoryType} />
              <div className="product-info">
                <h1>{sp.productCode}</h1>
                <h2>Price: {sp.productPrice}$</h2>
              </div>
            </Card>
          </NavLink>
        </div>
      ))}
    </div>
  );
}
