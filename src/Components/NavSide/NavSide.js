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
          <p>Home</p>
        </NavLink>
        {isManager && (
          <NavLink to='/inventory' 
          className='nav-item'
        >
          <i className="fa fa-tasks"></i>
          <p>Inventory</p>
        </NavLink>
        )}
        {isAdmin || isManager  ? (
          <NavLink to='/employee' 
          className='nav-item'
        >
          <i className="fa fa-users"></i>
          <p>Employees</p>
        </NavLink>
        ): null }
        {!isStaff && (
          <NavLink to='/historyOrder' 
          className='nav-item'
        >
          <i className="fa fa-file-invoice-dollar"></i>
          <p>Order list</p>
        </NavLink>
        )}
        <NavLink to='/profile' 
          className='nav-item'
        >
          <i className="fa fa-user"></i>
          <p>Profile</p>
        </NavLink>
        <NavLink to='/gold-price' 
          className='nav-item'
        >
          <i className="fa fa-money-bill"></i>
          <p>Gold price</p>
        </NavLink>
        <NavLink to='/diamond-price' 
          className='nav-item'
        >
          <i className="fa fa-gem"></i>
          <p>Diamond price</p>
        </NavLink>
        <NavLink to='/customer' 
          className='nav-item'
        >
          <i className="fa fa-user-cog"></i>
          <p>Customer</p>
        </NavLink>
        {isManager && (
          <NavLink to='/dashboard' 
          className='nav-item'
        >
          <i className="fa fa-chart-line"></i>
          <p>DashBoard</p>
        </NavLink>
        )}
        <NavLink to='/feedbacks' 
          className='nav-item'
        >
          <i className="fa fa-star"></i>
          <p>Feedback</p>
        </NavLink>
        <NavLink to='/buyProduct' 
          className='nav-item'
        >
          <i className="fa fa-hand-holding-usd"></i>
          <p>Buy</p>
        </NavLink>
    </div>
  )
}
