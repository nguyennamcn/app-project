
import React from 'react'
import { useState, useEffect } from 'react'
import { productServ } from './diamondService'
import { Card, List } from 'antd';
import { NavLink } from 'react-router-dom';
import './DiamondPage.css'
const { Meta } = Card;

export default function DiamondPage() {

  const data = Array.from({ length: 51 }).map((_, i) => ({
    title: `Title aaaaaaa aaaaaaaaaaaaa aaaaaaaaa aaaaa${i}`,
    code: `Code ${i}`,
    cost: `Cost ${i}`,
    img: 'https://trangsuc.doji.vn/Upload/dong-bo/kim-cuong-vien/kim-cuong-vien.jpg',
  }));

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

  <div className="gold-container">
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
          <option value='size'>Size</option>
          <option value='size'>4.3-4.9</option>
          <option value='size'>5.0-5.9</option>
          <option value='size'>6.0-6.9</option>
          <option value='size'>7.0-7.9</option>
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
      <input type='text' placeholder='Search...' style={{ outline: 'none', margin: '-4px 0 -4px 8px' }}></input>
      <svg style={{ marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" maxWidth="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    </div>

  </div>
  <List
    style={{
      maxWidth: '100%',
      marginLeft: '30px',
      height: '100px',
    }}
    grid={{ gutter: 11, column: 5 }}
    size='small'
    itemLayout='vertical'
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 10,
      position: 'bottom',
      align: 'end',
      className: 'custom__pagination',
    }}

    dataSource={products} //lấy data set sẵn để test
    renderItem={(sp) => (
      <List.Item
        className='list__products'
        style={{
          padding: '0 0',
          height: '210px'
        }}
      >
        <div
          className="product-card-container"
          key={sp.productCode}>

          <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productCode}`}>
            <Card
              hoverable
              bodyStyle={{ padding: '8px' }}
              style={{
                width: '220px',
                textAlign: 'center',
                borderRadius: '10px',
              }}
              cover={<img style={{ padding: '10px', maxWidth: '100%', height: '150px', objectFit: 'cover', }} alt={sp.productName} src={sp.productImage} />}
            >
              <Meta
                title={<span style={{ fontSize: '14px' }}>{sp.productName}</span>}
                description={sp.categoryType} />
              <div className="product-info">
                <h1>{sp.productCode}</h1>
                <h2> {sp.productPrice}$</h2>
              </div>
            </Card>
          </NavLink>

        </div>
      </List.Item>
    )}
  >
  </List>
</div>
  )
}


