
import React from 'react'
import { useState, useEffect } from 'react'
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
    <div className="gold-container">
      <div className='filter' style={{
        display: 'flex',
        marginTop: '-6px',
        marginBottom: '6px',
        marginLeft: '22px',
        justifyContent: 'space-between',
      }}>

        <div>
          <select name='jewelry__category' id='category'>
            <option value='gold-ring'>Gold ring</option>
            <option value='gold-bars'>Gold bars</option>
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

              <NavLink style={{ textDecoration: 'none' }} to={`/detail/${sp.productId}`}>
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
  );
}


