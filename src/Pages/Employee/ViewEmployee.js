import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ViewEmployee.css';

const initialEmployee = {
  id: '001',
  name: 'Nguyen Tan Thanh',
  email: 'thanhntse171854@fpt.edu.vn',
  gender: 'Male',
  age: 34,
  role: 'Sale staff',
  phone: '0908911035',
  storeAddress: '6224 Richmond Ave., Houston, US',
  status: true,
  statusText: 'Working',
  avatar: null
};

function ViewEmployee() {
  const [employee, setEmployee] = useState(initialEmployee);

  const handleDelete = () => {
    // Logic to delete the employee
    // For example, you can send a request to your server to delete the employee
    console.log('Employee deleted');
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployee({ ...employee, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <label htmlFor="avatar-upload" className="profile-placeholder">
              {employee.avatar ? (
                <img src={employee.avatar} alt="Avatar" className="avatar" />
              ) : (
                '+'
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="profile-info">
            <h2>{employee.name}</h2>
            <p>ID: {employee.id}</p>
            <p>{employee.email}</p>
            <p>{employee.gender}, {employee.age}</p>
            <div className="profile-status">
              <span className={`status-indicator ${employee.status ? 'online' : 'offline'}`}></span>
              <span className="status-text">{employee.statusText}</span>
            </div>
          </div>
          <div className="edit-button">
            <NavLink to="/edit-employee">
              <button>Edit</button>
            </NavLink>
          </div>
        </div>
        <hr />
        <div className="profile-details">
          <p><strong>Role:</strong> {employee.role}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>
          <p><strong>Store address:</strong> {employee.storeAddress}</p>
          <p><strong>Other information ...</strong></p>
        </div>
        <div className="profile-actions">
          <NavLink to="/employee">
            <button className="back-button">Back</button>
          </NavLink>
          <NavLink to="/employee">
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;


