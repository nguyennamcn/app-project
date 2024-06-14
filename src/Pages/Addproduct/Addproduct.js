import React, { useState } from 'react';
import './AddProduct.css';

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productId: '',
    productImages: [],
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
    setNewProduct({ ...newProduct, productImages: Array.from(e.target.files) });
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
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Product Images:</label>
                <input type="file" name="productImages" multiple onChange={handleImageUpload} />
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
                <select name="productMaterial" value={newProduct.productMaterial} onChange={handleInputChange}>
                  <option value="">Select Material</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Titanium">Titanium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select name="productCategory" value={newProduct.productCategory} onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Ring">Ring</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Earrings">Earrings</option>
                </select>
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
