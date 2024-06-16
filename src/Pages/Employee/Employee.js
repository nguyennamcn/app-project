import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Employee.css';
import { adornicaServ } from '../../service/adornicaServ';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    adornicaServ.getEmployee()
      .then((res) => {
        console.log(res.data.metadata);
        setEmployees(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
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
        placeholder="search by name" 
        className="employee-list-search-input" 
        value={searchTerm} 
        onChange={handleSearch} 
      />
      <table className="employee-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Role User</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.staffId}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.roles}</td>
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
