import React, { useEffect, useState } from 'react';
import { Input, Button, Radio, Modal } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import './EditEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';

export default function EditEmployee() {
  const [form, setForm] = useState({});
  const [employee, setEmployee] = useState({});
  const { id } = useParams();

  useEffect(() => {
    adornicaServ.getViewStaff(id)
      .then((res) => {
        console.log(res.data.metadata);
        setEmployee(res.data.metadata);
        setForm(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  console.log(form)
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

  const handleSubmit = () => {
    const data = {
      roles: employee.roleUser,
      id: employee.id,
    };
    console.log(data)
    Promise.all([
      adornicaServ.updateRole(data).catch((err) => {
        console.log(err);
      })
    ]).then(() => {
      showConfirm();
    });
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Save Successful',
      content: 'Employee information has been updated successfully.',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Employee</h1>
      <div className="edit-card">
        <div className="edit-header">
          <div className="edit-image">
            <label htmlFor="avatar-upload" className="edit-placeholder">
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
          <div className="edit-info">
            <div className="info-row">
              <div className="info-label">Name:</div>
              <div className="info-value">
                <Input
                  className="input-large"
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Address:</div>
              <div className="info-value">
                <Input
                  className="input-large"
                  name="address"
                  value={form.address || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone:</div>
              <div className="info-value">
                <Input
                  className="input-large"
                  name="phone"
                  value={form.phone || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Email:</div>
              <div className="info-value">
                <Input
                  className="input-large"
                  name="email"
                  value={form.email || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Role:</div>
              <div className="info-value">
                <Input
                  className="input-large"
                  name="roleUser"
                  value={form.roleUser || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="edit-details">
          <h3>Work Information</h3>
          <div className="role-group-edit">
            <h3>Role:</h3>
            <Radio.Group name="role" onChange={handleChange} style={{ marginLeft: '10px' }}>
              <Radio value="ROLE_SALES_STAFF">Staff</Radio>
              <Radio value="ROLE_MANAGER">Manager</Radio>
              <Radio value="ROLE_CASHIER_STAFF">Cashier</Radio>
            </Radio.Group>
          </div>
        </div>
        <hr />
        <div className="edit-actions">
          <NavLink to="/employee">
            <Button className="nav-button">Back</Button>
          </NavLink>
          <NavLink>
          <Button type="primary" className="nav-button" onClick={handleSubmit}>Save</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
