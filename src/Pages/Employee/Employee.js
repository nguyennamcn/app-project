import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Employee.css';

const employees = [
  { id: 1, name: 'Nguyen Tan Thanh', gender: 'Male', email: 'thanhntse171854@fpt.edu.vn', status: true },
  { id: 2, name: 'Nguyen Quoc Nam', gender: 'Male', email: 'namnqse171784@fpt.edu.vn', status: false },
  { id: 3, name: 'Duong Ngoc Thinh', gender: 'Male', email: 'thinhndse171879@fpt.edu.vn', status: true },
  { id: 4, name: 'To Hoang Trung Hieu', gender: 'Male', email: 'hieuthtse171800@fpt.edu.vn', status: false },
  { id: 5, name: 'Nguyen Danh Thang', gender: 'Male', email: 'thangndse171886@fpt.edu.vn', status: true },
];

function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-list-container">
      <h1 className="employee-list-title">Employees</h1>
      <NavLink to="/add-employee">
        <button className="add-employee-list-button">+ ADD EMPLOYEE</button>
      </NavLink>
      <input 
        type="text" 
        placeholder="search..." 
        className="employee-list-search-input" 
        value={searchTerm} 
        onChange={handleSearch} 
      />
      <table className="employee-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>ID</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.gender}</td>
              <td>{employee.email}</td>
              <td>{String(employee.id).padStart(3, '0')}</td>
              <td>
                <span className={`employee-list-status ${employee.status ? 'online' : 'offline'}`}></span>
              </td>
              <td>
                <NavLink to={`/view-employee/${employee.id}`}>
                  <button className="employee-list-view-button">View</button>
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;