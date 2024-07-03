import React, { useState } from 'react';
import { Input, Button, Radio, DatePicker, Modal } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import './AddEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';

const { confirm } = Modal;

const AddEmployee = () => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: null,
    address: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) {
        setPhoneError('Phone number must be digits only!');
        return;
      } else {
        setPhoneError('');
      }
      if (value.length > 10) {
        return;
      }
    }
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleGenderChange = (e) => {
    setForm({
      ...form,
      gender: e.target.value,
    });
  };

  const handleDateChange = (date, dateString) => {
    const birthdayTimestamp = date ? date.valueOf() : null;
    setForm({
      ...form,
      dateOfBirth: birthdayTimestamp,
    });
  };

  const handleDatePickerClick = () => {
    setDatePickerOpen(true);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      adornicaServ.postNewEmployee(form)
        .then(() => {
          showModal();
        })
        .catch((err) => {
          console.log(err);
          // Handle error here
        });
    }
  };

  const isFormValid = () => {
    return (
      form.email.trim() !== '' &&
      form.name.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.gender.trim() !== '' &&
      form.dateOfBirth !== null &&
      form.address.trim() !== '' &&
      form.password.trim() !== '' &&
      form.confirmPassword.trim() !== '' &&
      form.password === form.confirmPassword &&
      form.role.trim() !== '' &&
      phoneError === ''
    );
  };

  const showModal = () => {
    confirm({
      title: 'Add Successfully',
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
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            className="input-field"
            placeholder="Phone number"
            name="phone"
            value={form.phone}
            maxLength={10}
            onChange={handleChange}
          />
          {phoneError && <div className="error-message">{phoneError}</div>}
          <DatePicker
            className="input-field"
            placeholder="Date of Birth"
            onChange={handleDateChange}
            style={{ width: '100%' }}
            open={datePickerOpen}
            onOpenChange={(open) => setDatePickerOpen(open)}
            onClick={handleDatePickerClick}
          />
          <Input
            className="input-field"
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <div className="input-field">
            <h3>Gender :</h3>
            <Radio.Group
              name="gender"
              value={form.gender}
              onChange={handleGenderChange}
            >
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="form-group">
          <h2>Account :</h2>
          <Input
            className="input-field"
            placeholder="Email"
            name="email"
            value={form.email}
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
          <div className="store-role-section">
            <div className="role-group">
              <h3>Role :</h3>
              <Radio.Group
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <Radio value="ROLE_SALES_STAFF">Sales Staff</Radio>
                <Radio value="ROLE_CASHIER_STAFF">Cashier</Radio>
              </Radio.Group>
            </div>
          </div>
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
