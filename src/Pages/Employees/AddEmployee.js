import React, { useState } from 'react';
import { Input, Button, Radio, Select, DatePicker } from 'antd';
import './AddEmployee.css';

const { Option } = Select;

export default function AddEmployee() {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    birthday: null,
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Manager',
    store: '6224 Richmond Ave., Houston, US'
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value) => {
    setForm({
      ...form,
      store: value
    });
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      birthday: date
    });
  };

  const handleSubmit = () => {
    console.log('Form data:', form);
  };

  return (
    <div className="add-employee-container">
      <h1>Add Employee</h1>
      <div className="form-section">
        <div className="form-group">
          <h2>Personal information :</h2>
          <Input className="input-field" placeholder="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <Input className="input-field" placeholder="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          <Input className="input-field" placeholder="Gender" name="gender" value={form.gender} onChange={handleChange} />
          <DatePicker className="input-field" placeholder="Birthday" onChange={handleDateChange} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <h2>Account :</h2>
          <Input className="input-field" placeholder="Username" name="username" value={form.username} onChange={handleChange} />
          <Input.Password className="input-field" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
          <Input.Password className="input-field" placeholder="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
        </div>
      </div>
      <div className="store-role-section">
        <div className="role-group">
          <h3>Role :</h3>
          <Radio.Group name="role" value={form.role} onChange={handleChange}>
            <Radio value="Manager">Manager</Radio>
            <Radio value="Employee">Employee</Radio>
          </Radio.Group>
        </div>
        <div className="store-select">
          <h3>Store :</h3>
          <Select defaultValue={form.store} onChange={handleSelectChange} style={{ width: '100%' }}>
            <Option value="6224 Richmond Ave., Houston, US">6224 Richmond Ave., Houston, US</Option>
            {/* Add more store options here */}
          </Select>
        </div>
      </div>
      <div className="form-actions">
        <Button onClick={() => console.log('Back button clicked')}>Back</Button>
        <Button type="primary" onClick={handleSubmit}>ADD</Button>
      </div>
    </div>
  );
}
