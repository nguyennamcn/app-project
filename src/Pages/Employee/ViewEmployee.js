import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './ViewEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';

function ViewEmployee() {
  const [employee, setEmployee] = useState();
  const { staffId } = useParams();

  useEffect(() => {
    adornicaServ.getViewEmployee(staffId)
      .then((res) => {
        console.log(res.data.metadata);
        setEmployee(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [staffId]);
  const handleDelete = () => {
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
      <h1 className="profile-title">Profile of {employee?.name}</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <label htmlFor="avatar-upload" className="profile-placeholder">
              {employee?.avatar ? (
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
            <h2>{employee?.name}</h2>
            <p>ID: {employee?.id}</p>
            <p>{employee?.phone}</p>
            <p>{employee?.roles}</p>
            <div className="profile-status">
              <span className={`status-indicator ${employee?.status ? 'online' : 'offline'}`}></span>
              <span className="status-text">{employee?.status ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <div className="edit-button">
            <NavLink to={`/edit-employee/${employee?.id}`}>
              <button>Edit</button>
            </NavLink>
          </div>
        </div>
        <hr />
        <div className="profile-details">
          <p><strong>Role:</strong> {employee?.roleUser}</p>
          <p><strong>Phone:</strong> {employee?.phone}</p>
          <p><strong>Store address:</strong> {employee?.address}</p>
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
