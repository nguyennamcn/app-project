import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { Modal, notification } from 'antd';
import './ViewEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';

function ViewEmployee() {
  const [employee, setEmployee] = useState();
  const { staffId } = useParams();
  const navigate = useNavigate();

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
    adornicaServ.delectAccount(staffId)
      .then((res) => {
        console.log('Employee deleted', res);
        notification.success({ message: "Delete user successfully" });
        navigate(0); // Reload lại trang
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(err);
      });
  };

  const showDeleteConfirm = () => {
    if (!employee?.active) {
      notification.warning({ message: "Cannot delete an offline employee" });
      return;
    }

    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this employee?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete();
      }
    });
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
          <div className="profile-image-employee">
            <label htmlFor="avatar-upload" className="edit-placeholder-employee">
              {employee?.avatar ? (
                <img src={employee.avatar} alt="Avatar" className="avatar" />
              ) : (
                '+'
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              disabled
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
              <span className={`status-indicator ${employee?.active ? 'online' : 'offline'}`}></span>
              <span className="status-text">{employee?.active ? 'Online' : 'Offline'}</span>
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
          {/* <p><strong>Other information ...</strong></p> */}
        </div>
        <div className="profile-actions">
          <NavLink to="/employee">
            <button className="back-button">Back</button>
          </NavLink>
          <button className="delete-button" onClick={showDeleteConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;