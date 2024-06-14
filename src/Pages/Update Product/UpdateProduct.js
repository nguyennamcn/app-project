import React, { useState } from 'react';
import './UpdateProduct.css';

function UpdateProduct() {
  const [product, setProduct] = useState({
    name: '',
    id: '',
    images: [],
    gem: '',
    productionCost: '',
    gender: '',
    weight: '',
    material: '',
    category: '',
    updatingDay: '',
    quantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý cập nhật sản phẩm
  };

  return (
    <div className="container1">
      <div className="content">
        <div className="update-product">
          <h2>Update products</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} />
              </div>
              <div className="form-group">
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Images:</label>
                <input type="file" name="images" multiple onChange={handleImageChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gem:</label>
                <input type="text" name="gem" value={product.gem} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Production cost:</label>
                <input type="text" name="productionCost" value={product.productionCost} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender:</label>
                <input type="text" name="gender" value={product.gender} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Weight (g):</label>
                <input type="text" name="weight" value={product.weight} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Material:</label>
                <select name="material" value={product.material} onChange={handleChange}>
                  <option value="">Select Material</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Titanium">Titanium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select name="category" value={product.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Ring">Ring</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Earrings">Earrings</option>
                </select>
              </div>
            </div>
            
            <button className="update-button" type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
