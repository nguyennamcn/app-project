
import React from 'react'
import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { productServ } from './productService';

export default function HomePage() {

  const [products,setItem]=useState([]);
  useEffect(  () => {
    productServ.getItemList()
      .then((res) => {
        console.log(res);
        setItem(res.data.content)
      })
      .catch((err) =>{
        console.log(err);
      }
      )
  },[])
  
  console.log("result",products);
  return (
    <div>
      {
        products.map((item)=>
          <h1>{item.id}</h1>
        )
      }
    </div>
  )
}
