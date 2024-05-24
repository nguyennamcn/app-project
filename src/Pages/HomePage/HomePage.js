
import React from 'react'
import { useState, useEffect } from 'react'
import { productServ } from './productService'
import { Card } from 'antd';
import './CssHomePage.css'
const { Meta } = Card;

export default function HomePage() {

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
      <div className='filter' style={{ display: 'flex', marginTop: '48px', }}>
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

        <div className='search__input' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6px', border: 'solid black 1px', borderRadius: '20px' }}>
          <input type='text' placeholder='Search...' style={{ outline: 'none', margin: '-4px 0 -4px 8px' }}></input>
          <svg style={{ marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>

      </div>

      <div className='list__products'>
        <Card
          className='card'
          hoverable
          style={{
            width: '180px',
            height: '230px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center', 
          }}
          cover={
            <img
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              alt="example"
              src="https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          }
        >
          <Meta
            style={{
              width: '170px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '-20px' 
            }}
            title={
              <span style={{
                fontSize: '12px',
                whiteSpace: 'normal',
                marginBottom: '0', 
                display: 'block', 
              }}>
                14K White Gold Ring with Topaz Stone TPXMW000657
              </span>
            }
            description={
              <span style={{
                textAlign: 'center',
                marginTop: '4px',
              }}>
                24,000$
              </span>
            }
          />
        </Card>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        <div className='card' style={{backgroundColor:'black', width:'178.400px', height:'228.400px'}}></div>
        
      </div>
    </div>
  )
}
