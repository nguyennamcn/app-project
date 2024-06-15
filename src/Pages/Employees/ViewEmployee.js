import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewEmployee.css';
import { NavLink } from 'react-router-dom';

const employees = [
  { id: 1, name: 'Nguyen Tan Thanh', gender: 'Male', email: 'thanhntse171854@fpt.edu.vn', status: true, role: 'Sale staff', phone: '0908911035', storeAddress: '6224 Richmond Ave., Houston, US', statusText: 'Working', age: 34, avatar: null },
  { id: 2, name: 'Nguyen Quoc Nam', gender: 'Male', email: 'namnqse171784@fpt.edu.vn', status: false, role: 'Sale staff', phone: '0908911035', storeAddress: '6224 Richmond Ave., Houston, US', statusText: 'Not working', age: 34, avatar: null },
  { id: 3, name: 'Duong Ngoc Thinh', gender: 'Male', email: 'thinhndse171879@fpt.edu.vn', status: true, role: 'Sale staff', phone: '0908911035', storeAddress: '6224 Richmond Ave., Houston, US', statusText: 'Working', age: 34, avatar: null },
  { id: 4, name: 'To Hoang Trung Hieu', gender: 'Male', email: 'hieuthtse171800@fpt.edu.vn', status: false, role: 'Sale staff', phone: '0908911035', storeAddress: '6224 Richmond Ave., Houston, US', statusText: 'Not working', age: 34, avatar: null },
  { id: 5, name: 'Nguyen Danh Thang', gender: 'Male', email: 'thangndse171886@fpt.edu.vn', status: true, role: 'Sale staff', phone: '0908911035', storeAddress: '6224 Richmond Ave., Houston, US', statusText: 'Working', age: 34, avatar: null },
];

function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const emp = employees.find(e => e.id === parseInt(id));
    setEmployee(emp);
  }, [id]);

  if (!employee) return <div>Employee not found</div>;

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
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEmployee({ ...employee, avatar: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
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
            <button className="delete-button" onClick={() => console.log('Employee deleted')}>Delete</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;
