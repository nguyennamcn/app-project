import React, { useEffect, useState } from 'react';
import { Input, Button, Radio, Modal, notification } from 'antd';
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
        const employeeData = res.data.metadata;
        console.log("Staff:",res.data.metadata);
        setEmployee(res.data.metadata);
        setForm({
          ...form,
          role: employeeData.roleUser ? employeeData.roleUser[0] : null
        });
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
      id: employee.id,
      roles: [form.role]
    };
    console.log(data)

    adornicaServ.postImg(id)
      .then((res) => {
        console.log('Img updated:', res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      })

    adornicaServ.updateRole(data)
      .then((res) => {
        console.log('Role updated:', res);
        //window.location.reload();
        notification.success({ message: "Update user successfully" });

      })
      .catch((err) => {
        const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
        notification.error({ message: errorMessage });
        console.log(err);
      })
    console.log('Form data:', data);
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
              disabled
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="edit-info">
            <Input className="input-field" placeholder="Full Name" name="name" value={employee?.name} onChange={handleChange} />
            <Input className="input-field" placeholder="Phone number" name="phone" value={employee?.phone} onChange={handleChange} />
            <Input className="input-field" placeholder="Email" name="email" value={employee?.email} onChange={handleChange} />
            <Input className="input-field" placeholder="Gender" name="gender" value={employee?.gender} onChange={handleChange} />
            <Input className="input-field" placeholder="Address" name="address" value={employee?.address} onChange={handleChange} />
          </div>
        </div>
        <hr />
        <div className="edit-details">
          {/* <h3>Work Information</h3> */}
          <h3>Role:</h3>
          <div className="role-group-edit">
            {/* <h3>Role:</h3> */}
            <Radio.Group name="role" onChange={handleChange} value={form.role} style={{ marginLeft: '10px' }}>
              <Radio value="ROLE_SALES_STAFF">Sales staff</Radio>
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
