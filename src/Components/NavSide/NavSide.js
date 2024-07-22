import React from 'react'
import './NavSide.css'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function NavSide() {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
  const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
  const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');
  const isStaff = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_SALES_STAFF');
  return (
    <div className='navbar'>
        <NavLink to='/homePage' 
          className='nav-item'
        >
          <i className="fa fa-home"></i>
          <p>Trang chủ</p>
        </NavLink>
        {isManager && (
          <NavLink to='/inventory' 
          className='nav-item'
        >
          <i className="fa fa-tasks"></i>
          <p>Sản phẩm</p>
        </NavLink>
        )}
        {isAdmin || isManager  ? (
          <NavLink to='/employee' 
          className='nav-item'
        >
          <i className="fa fa-users"></i>
          <p>Nhân Viên</p>
        </NavLink>
        ): null }
        {!isStaff && !isAdmin && (
          <NavLink to='/historyOrder' 
          className='nav-item'
        >
          <i className="fa fa-file-invoice-dollar"></i>
          <p>Danh sách đơn hàng</p>
        </NavLink>
        )}
        <NavLink to='/profile' 
          className='nav-item'
        >
          <i className="fa fa-user"></i>
          <p>Hồ sơ</p>
        </NavLink>
        <NavLink to='/gold-price' 
          className='nav-item'
        >
          <i className="fa fa-money-bill"></i>
          <p>Giá Vàng</p>
        </NavLink>
        <NavLink to='/diamond-price' 
          className='nav-item'
        >
          <i className="fa fa-gem"></i>
          <p>Giá Kim Cương</p>
        </NavLink>
        <NavLink to='/customer' 
          className='nav-item'
        >
          <i className="fa fa-user-cog"></i>
          <p>Khách hàng</p>
        </NavLink>
        {isManager && (
          <NavLink to='/dashboard' 
          className='nav-item'
        >
          <i className="fa fa-chart-line"></i>
          <p>Thống kê</p>
        </NavLink>
        )}
        <NavLink to='/feedbacks' 
          className='nav-item'
        >
          <i className="fa fa-star"></i>
          <p>Đánh giá</p>
        </NavLink>
        {isAdmin ? (null) : isManager ? (null) : isCashier ? (null) :(
          <NavLink to='/buyProduct' 
          className='nav-item'
        >
          <i className="fa fa-hand-holding-usd"></i>
          <p>Mua lại sản phẩm</p>
        </NavLink>
        )}
        
    </div>
  )
}
