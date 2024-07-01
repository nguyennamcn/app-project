import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Employee.css';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 4; 

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
    setCurrentPage(0); 
  };

  const filteredEmployees = employees.filter(employee => {
    const roles = Array.isArray(employee.roles) ? employee.roles.join(' ') : employee.roles;
    return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.phone.includes(searchTerm) ||
           roles.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pageCount = Math.ceil(filteredEmployees.length / employeesPerPage);
  const offset = currentPage * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(offset, offset + employeesPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
            <th>Action</th>
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
              <td data-label="Action">
                <NavLink to={`/view-employee/${employee.staffId}`}>
                  <button className="employee-list-view-button">View</button>
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          disabledClassName={'disabled'}
        />
      </div>
    </div>
  );
}
