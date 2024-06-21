import React, { useState } from 'react';
import { Input, Button, Radio, DatePicker, Modal } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import './AddEmployee.css';

const { confirm } = Modal;

const AddEmployee = () => {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    email : '',
    gender: '',
    birthday: null,
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Manager',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleGenderChange = (e) => {
    setForm({
      ...form,
      gender: e.target.value
    });
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      birthday: date
    });
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      showModal();
    }
  };

  const isFormValid = () => {
    return (
      form.fullName &&
      form.phoneNumber &&
      form.address &&
      form.email &&
      form.gender &&
      form.birthday &&
      form.username &&
      form.password &&
      form.confirmPassword &&
      form.password === form.confirmPassword
    );
  };

  const showModal = () => {
    confirm({
      title: 'Add Successful',
      content: 'Employee has been added successfully!',
      onOk() {
        navigate('/employee');
      },
      onCancel() {
        console.log('Cancelled');
      },
    });
  };

  return (
    <div className="add-employee-container">
      <h1>Add Employee</h1>
      <div className="form-section">
        <div className="form-group">
          <h2>Personal information :</h2>
          <Input
            className="input-field"
            placeholder="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          <Input
            className="input-field"
            placeholder="Phone number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <Input
            className="input-field"
            placeholder="Address"
            name="Address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            className="input-field"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <div className="input-field">
            <h3>Gender :</h3>
            <Radio.Group
              name="gender"
              value={form.gender}
              onChange={handleGenderChange}
            >
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </div>
          <DatePicker
            className="input-field"
            placeholder="Birthday"
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <h2>Account :</h2>
          <Input
            className="input-field"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <Input.Password
            className="input-field"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input.Password
            className="input-field"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="store-role-section">
        <div className="role-group">
          <h3>Role :</h3>
          <Radio.Group
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <Radio value="Sale Staff">Sale Staff</Radio>
            <Radio value="Cashier">Cashier</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="form-actions">
        <NavLink to="/employee">
          <Button className="nav-button">Back</Button>
        </NavLink>
        <Button
          type="primary"
          className="nav-button"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          ADD
        </Button>
      </div>
    </div>
  );
};

export default AddEmployee;
