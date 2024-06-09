import React, { useState } from 'react';
import './AddProduct.css';

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productId: '',
    productImage: null,
    productGem: '',
    productionCost: '',
    productGender: '',
    productWeight: '',
    productMaterial: '',
    productCategory: '',
    addingDay: '',
    productQuantity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewProduct({ ...newProduct, productImage: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm sản phẩm
  };

  return (
    <div className="container1">
      <div className="content">
        <div className="add-product">
          <h2>Add Product</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name:</label>
                <input type="text" name="productName" value={newProduct.productName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Product ID:</label>
                <input type="text" name="productId" value={newProduct.productId} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Product Image:</label>
                <input type="file" name="productImage" onChange={handleImageUpload} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gem:</label>
                <input type="text" name="productGem" value={newProduct.productGem} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Production Cost:</label>
                <input type="text" name="productionCost" value={newProduct.productionCost} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender:</label>
                <input type="text" name="productGender" value={newProduct.productGender} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Weight (g):</label>
                <input type="text" name="productWeight" value={newProduct.productWeight} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Material:</label>
                <input type="text" name="productMaterial" value={newProduct.productMaterial} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input type="text" name="productCategory" value={newProduct.productCategory} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Adding Day:</label>
                <input type="date" name="addingDay" value={newProduct.addingDay} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="text" name="productQuantity" value={newProduct.productQuantity} onChange={handleInputChange} />
              </div>
            </div>
            <button className="add-button" type="submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
