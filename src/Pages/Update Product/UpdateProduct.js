import React, { useState } from 'react';
import './UpdateProduct.css';

function UpdateProduct() {
  const [product, setProduct] = useState({
    name: '',
    id: '',
    image: null,
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
    setProduct({ ...product, image: e.target.files[0] });
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
                <label>Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ID:</label>
                <input type="text" name="id" value={product.id} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Images:</label>
                <input type="file" name="image" onChange={handleImageChange} />
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
                <input type="text" name="material" value={product.material} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input type="text" name="category" value={product.category} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Updating day:</label>
                <input type="date" name="updatingDay" value={product.updatingDay} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="text" name="quantity" value={product.quantity} onChange={handleChange} />
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
