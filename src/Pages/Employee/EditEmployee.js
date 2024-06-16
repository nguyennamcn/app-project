import React, { useEffect, useState } from 'react';
import { Input, Button, Radio, Select, DatePicker } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import moment from 'moment';
import './EditEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';

const { Option } = Select;


export default function EditEmployee() {
  const [form, setForm] = useState();
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

  const handleSelectChange = (value) => {
    setForm({
      ...form,
      storeAddress: value
    });
  };

  const handleSubmit = () => {
    console.log('Form data:', form);
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Employee</h1>
      <div className="edit-card">
        <div className="edit-header">
          <div className="edit-image">
            <label htmlFor="avatar-upload" className="edit-placeholder">
              {/* {form.avatar ? (
                <img src="{form.avatar}" alt="Avatar" className="avatar" />
              ) : (
                '+'
              )} */}
            </label>
            <input
              id="avatar-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="edit-info">
            <Input className="input-field" placeholder="Full Name" name="name" onChange={handleChange} />
            <Input className="input-field" placeholder="Phone number" name="phone"  onChange={handleChange} />
            <Input className="input-field" placeholder="Email" name="email"  onChange={handleChange} />
            <DatePicker
              className="input-field"
              placeholder="Birthday"
              // value={moment(form.birthday)}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <hr />
        <div className="edit-details">
          <h3>Work Information</h3>
          <div className="role-group-edit">
            <h3>Role:</h3>
            <Radio.Group name="role" onChange={handleChange} style={{ marginLeft: '10px' }}>
              <Radio value="Staff">Staff</Radio>
              <Radio value="Manager">Manager</Radio>
            </Radio.Group>
          </div>
          <div className="store-select-edit">
            <h3>Store address:</h3>
            <Select  onChange={handleSelectChange} style={{ width: '100%', marginLeft: '10px' }}>
              <Option value="6224 Richmond Ave., Houston, US">6224 Richmond Ave., Houston, US</Option>
              {/* Add more store options here */}
            </Select>
          </div>
        </div>
        <hr />
        <div className="edit-actions">
          <NavLink to="/view-employee">
            <Button className="nav-button">Back</Button>
          </NavLink>

          <NavLink to="/view-employee">
          <Button type="primary" className="nav-button" onClick={handleSubmit}>Save</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
