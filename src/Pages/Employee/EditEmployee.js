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
  const { id } = useParams();
  useEffect(() => {
    adornicaServ.getViewStaff(id)
      .then((res) => {
        console.log(res.data.metadata);
        setEmployee(res.data.metadata);
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

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployee({ ...employee, avatar: reader.result });
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
    const data = {
      id: employee.id,
      roles: [form.role]
    };

    // const dataImg = {
    //   id : employee.id,
    //   file : 
    // }
    
    adornicaServ.postImg(id)
      .then((res) => {
        console.log('Img updated:', res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });


    adornicaServ.updateRole(data)
      .then((res) => {
        console.log('Role updated:', res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('Form data:', data);
  };

  console.log(employee)
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
            <h1 style={{fontSize: '14px'}}>Name : {employee?.name}</h1>
            <h1 style={{fontSize: '14px'}}>Address : {employee?.address}</h1>
            <h1 style={{fontSize: '14px'}}>Phone : {employee?.phone}</h1>
            <h1 style={{fontSize: '14px'}}>Email : {employee?.email}</h1>
            <h1 style={{fontSize: '14px'}}>Role : {employee?.roleUser}</h1>
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
