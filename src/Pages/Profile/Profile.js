import React, { useState } from 'react';
import { Input, Button, Select, DatePicker } from 'antd';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import './Profile.css';

const { Option } = Select;

const initialEmployee = {
  id: '001',
  name: 'Nguyen Tan Thanh',
  email: 'thanhntse171854@fpt.edu.vn',
  gender: 'Male',
  birthday: '2001-11-09',
  role: 'Manager',
  phone: '0908911035',
  storeAddress: '6224 Richmond Ave., Houston, US',
  avatar: null
};

export default function EditEmployee() {
  const [form, setForm] = useState(initialEmployee);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date, dateString) => {
    setForm({
      ...form,
      birthday: dateString
    });
  };

  const handleSubmit = () => {
    console.log('Form data:', form);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <label htmlFor="avatar-upload" className="profile-placeholder">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="avatar" />
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
            <Input className="input-field" placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input className="input-field" placeholder="Phone number" name="phone" value={form.phone} onChange={handleChange} />
            <Input className="input-field" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
            <DatePicker
              className="input-field"
              placeholder="Birthday"
              value={moment(form.birthday)}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <hr />
        <div className="profile-details">
          <h3>Work Information:</h3>
          <div className="work-info-row">
            <div className="work-info-item">
              <h3>Role:</h3>
              <Input className="input-field" value={form.role} disabled />
            </div>
          </div>
          <div className="work-info-item">
              <h3>Store address:</h3>
              <Select value={form.storeAddress} style={{ width: '100%' }} disabled>
                <Option value="6224 Richmond Ave., Houston, US">6224 Richmond Ave., Houston, US</Option>
                {/* Add more store options here */}
              </Select>
            </div>
        </div>
        <hr />
        <div className="profile-actions">
          {/* <Button className="nav-button">Back</Button> */}
          <Button type="primary" className="nav-button" onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}
