import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Employee.css';
import { adornicaServ } from '../../service/adornicaServ';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5; 

  useEffect(() => {
    adornicaServ.getEmployee()
      .then((res) => {
        console.log(res.data.metadata);
        const sortedEmployees = res.data.metadata.sort((a, b) => a.staffId - b.staffId);
        setEmployees(sortedEmployees);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const filteredEmployees = employees.filter(employee => {
    const roles = Array.isArray(employee.roles) ? employee.roles.join(' ') : employee.roles;
    return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.phone.includes(searchTerm) ||
           roles.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="employee-list-container">
      <h1 className="employee-list-title">Employees</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name, phone or role" 
          className="employee-list-search-input" 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        <NavLink to="/add-employee">
          <button className="add-employee-list-button">+ ADD EMPLOYEE</button>
        </NavLink>
      </div>
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
          {currentEmployees.map(employee => (
            <tr key={employee.id}>
              <td data-label="ID">{employee.staffId}</td>
              <td data-label="Name">{employee.name}</td>
              <td data-label="Phone">{employee.phone}</td>
              <td data-label="Role User">{Array.isArray(employee.roles) ? employee.roles.join(', ') : employee.roles}</td>
              <td data-label="Status">
                <span className={`employee-list-status ${employee.active ? 'online' : 'offline'}`}></span>
              </td>
              <td data-label="">
                <NavLink to={`/view-employee/${employee.staffId}`}>
                  <button className="employee-list-view-button">View</button>
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => handlePageChange(index + 1)} 
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
