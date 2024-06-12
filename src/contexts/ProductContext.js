import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const clearProducts = () => {
    setProducts([]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, clearProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
