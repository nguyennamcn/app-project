import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Employee.css';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import Spinner from '../../Components/Spinner/Spinner';
import { useSelector } from 'react-redux';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 4; 
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.userReducer.userInfo);

  useEffect(() => {
    adornicaServ.getEmployee()
      .then((res) => {
        console.log(res.data.metadata);
        const sortedEmployees = res.data.metadata.sort((a, b) => a.staffId - b.staffId);
        setEmployees(sortedEmployees);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); 
  };

  const mapRole = (role) => {
    switch(role) {
      case 'ROLE_SALES_STAFF':
        return 'Nhân Viên Bán Hàng';
      case 'ROLE_CASHIER_STAFF':
        return 'Nhân Viên Thu Ngân';
      case 'ROLE_MANAGER':
        return 'Quản Lý';
      default:
        return role;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const roles = Array.isArray(employee.roles) ? employee.roles.join(' ') : employee.roles;
    return (
      !roles.includes('ROLE_ADMIN') && employee.phone !== userInfo.phone &&
      (
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        roles.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const pageCount = Math.ceil(filteredEmployees.length / employeesPerPage);
  const offset = currentPage * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(offset, offset + employeesPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="employee-list-container">
          <h1 className="employee-list-title">Danh sách Nhân viên</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc số điện thoại hoặc theo chức vụ" 
              className="employee-list-search-input" 
              value={searchTerm} 
              onChange={handleSearch} 
            />
            <NavLink to="/add-employee">
              <button className="add-employee-list-button">+ Thêm nhân viên</button>
            </NavLink>
          </div>
          <table className="employee-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Chức vụ</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map(employee => (
                <tr key={employee.id}>
                  <td data-label="ID">{employee.staffId}</td>
                  <td data-label="Name">{employee.name}</td>
                  <td data-label="Phone">{employee.phone}</td>
                  <td data-label="Role User">{Array.isArray(employee.roles) ? employee.roles.map(mapRole).join(', ') : mapRole(employee.roles)}</td>
                  <td data-label="Status">
                    <span className={`employee-list-status ${employee.active ? 'online' : 'offline'}`}></span>
                  </td>
                  <td data-label="Action">
                    <NavLink to={`/view-employee/${employee.staffId}`}>
                      <button className="employee-list-view-button">Xem</button>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={'Trước'}
              nextLabel={'Sau'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
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
      )}
    </>
  );
}
