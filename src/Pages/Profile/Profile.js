import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

import { Input, Button, Select, DatePicker } from 'antd';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import './Profile.css';

const { Option } = Select;

// const initialEmployee = {
//   id: '001',
//   name: 'Nguyen Tan Thanh',
//   email: 'thanhntse171854@fpt.edu.vn',
//   gender: 'Male',
//   birthday: '2001-11-09',
//   role: 'Manager',
//   phone: '0908911035',
//   storeAddress: '6224 Richmond Ave., Houston, US',
//   avatar: null
// };

export default function EditEmployee() {
  const [profile, setProfile] = useState([]);
  useEffect(() => {
    adornicaServ. getProfile()
      .then((res) => {
        console.log(res.data.metadata);
        setProfile(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date, dateString) => {
    setProfile({
      ...profile,
      birthday: dateString
    });
  };

  const handleSubmit = () => {
    console.log('Form data:', profile);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <label htmlFor="avatar-upload" className="profile-placeholder">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="avatar" />
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
            <Input className="input-field" placeholder="Full Name" name="name" value={profile.name} onChange={handleChange} />
            <Input className="input-field" placeholder="Phone number" name="phone" value={profile.phone} onChange={handleChange} />
            <Input className="input-field" placeholder="Email" name="email" value={profile.email} onChange={handleChange} />
            <Input className="input-field" placeholder="Gender" name="gender" value={profile.gender} onChange={handleChange} />
            <Input className="input-field" placeholder="Address" name="address" value={profile.address} onChange={handleChange} />
            <DatePicker
              className="input-field"
              placeholder="Birthday"
              value={moment(profile.birthday)}
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
              <Input className="input-field" value={profile.roleUser} disabled />
            </div>
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
