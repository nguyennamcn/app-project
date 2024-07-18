import React, { useState } from 'react';
import { Input, Button, Radio, DatePicker, Modal } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import './AddEmployee.css';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';

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

  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) {
        setPhoneError('Vui lòng chỉ nhập số (tối đa 10 chữ số)!');
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
      content: 'Thêm nhân viên thành công!',
      onOk() {
        navigate('/employee');
      },
      okText: 'OK',
      cancelButtonProps: { style: { display: 'none' } },
    });
  };
  

  return (
    <div className="add-employee-container">
      <h1>Thêm Nhân viên</h1>
      <div className="form-section">
        <div className="form-group">
          <h2>Thông tin nhân viên :</h2>
          <Input
            className="input-field"
            placeholder="Họ và tên"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            className="input-field"
            placeholder="Số điện thoại"
            name="phone"
            value={form.phone}
            maxLength={10}
            onChange={handleChange}
          />
          {phoneError && <div className="error-message">{phoneError}</div>}
          <DatePicker
            className="input-field"
            placeholder="Ngày sinh"
            onChange={handleDateChange}
            style={{ width: '100%' }}
            open={datePickerOpen}
            onOpenChange={(open) => setDatePickerOpen(open)}
            onClick={handleDatePickerClick}
          />
          <Input
            className="input-field"
            placeholder="Địa chỉ"
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
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="form-group">
          <h2>Tài khoản :</h2>
          <Input
            className="input-field"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input.Password
            className="input-field"
            placeholder="Mật khẩu"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input.Password
            className="input-field"
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <div className="store-role-section">
          {isAdmin ? (
            <div className="role-group">
            <h3>Chức vụ :</h3>
            <Radio.Group
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <Radio value="ROLE_SALES_STAFF">Nhân viên bán hàng</Radio>
              <Radio value="ROLE_CASHIER_STAFF">Thu ngân</Radio>
              <Radio value="ROLE_MANAGER">Quản lý</Radio>
              <Radio value="ROLE_ADMIN">Admin</Radio>
            </Radio.Group>
          </div>
          ) : (
            <div className="role-group">
              <h3>Chức vụ :</h3>
              <Radio.Group
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <Radio value="ROLE_SALES_STAFF">Nhân viên bán hàng</Radio>
                <Radio value="ROLE_CASHIER_STAFF">Thu ngân</Radio>
              </Radio.Group>
            </div>
          )}
          </div>
        </div>
      </div>
      <div className="form-actions">
        <NavLink to="/employee">
          <Button className="nav-button">Trở về</Button>
        </NavLink>
        <Button
          type="primary"
          className="nav-button"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default AddEmployee;
