
import React from 'react'
import { useState, useEffect } from 'react'
import { productServ } from './productService'
import { Card, List } from 'antd';
import './JewelryCss.css'
const { Meta } = Card;

export default function JewelryPage() {

  const data = Array.from({ length: 51 }).map((_, i) => ({
    title: `Title aaaaaaa aaaaaaaaaaaaa aaaaaaaaa aaaaa${i}`,
    code: `Code ${i}`,
    cost: `Cost ${i}`,
    img: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }));

  const [products, setItem] = useState([]);
  useEffect(() => {
    productServ.getProductList()
      .then((res) => {
        console.log(res);
        setItem(res.data.content)
      })
      .catch((err) => {
        console.log(err);
      }
      )
  }, [])

  console.log("result", products);
  return (
    <div>

    <div className='filter' style={{
      display: 'flex',
      marginBottom: '10px',
      marginLeft:'22px',
      justifyContent: 'space-between',
    }}>

      <div>
        <select name='jewelry__category' id='category'>
          <option value='category'>Category</option>
          <option value='rings'>Rings</option>
          <option value='earrings'>Earrings</option>
          <option value='necklaces'>Necklaces</option>
          <option value='bracelets'>Bracelets</option>
        </select>

        <select name='jewelry__gender' id='gender'>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>

        <select name='jewelry__price' id='price'>
          <option value=''>0-5000$</option>
          <option value=''>5000$-10000$</option>
          <option value=''>10.000$-20.000$</option>
          <option value=''>20.000$-50.000$</option>
          <option value=''>50.000$-100.000$</option>
          <option value=''>over 100.000$</option>
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
    <div className='contain__list'
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <List
        style={{
          maxWidth: '95%',
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
        dataSource={data} //lấy data set sẵn để test
        renderItem={(item) => (
          <List.Item
            className='list__products'
            style={{
              padding: '0 0',
            }}
          >
            <Card
              className='card'
              hoverable
              bodyStyle={{ padding: '8px' }}
              style={{
                maxWidth: '240px',
                textAlign: 'center',
                borderRadius: '10px',
              }}
              cover={
                <img
                  style={{ maxWidth: '100%', height: '120px', objectFit: 'cover' }}
                  alt="example"
                  src={item.img}
                />
              }
            >
              <Meta
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0',
                }}
                title={
                  <span style={{
                    fontSize: '11.4px',
                    whiteSpace: 'normal',
                    marginBottom: '0',
                    display: 'block',
                  }}>
                    {item.title} {item.code}
                  </span>
                }
                description={
                  <span style={{
                    textAlign: 'center',
                    marginTop: '4px',
                  }}>
                    {item.cost}
                  </span>
                }
              />
            </Card>

          </List.Item>
        )}
      />
    </div>

  </div>
  )
}
