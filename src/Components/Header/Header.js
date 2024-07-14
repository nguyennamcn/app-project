import React, { useState } from 'react';
import './header.css';
import { useSelector } from 'react-redux';
import { localService } from '../../service/localService';
import UserDropDown from './UserDropDown';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userInfo = useSelector((state) => state.userReducer.userInfo);

  const handleLogout = () => {
    localService.remove();
    window.location.reload();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.body.classList.toggle('sidebar-open', !sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const renderContent = () => (
    <div id='header'>
      <div className="header__login">
        <div className="header__login__left">
          <NavLink to="/homePage" className='img__login1'>
            {/* img */}
          </NavLink>
        </div>
        <div className="header__login__right">
          <div className="hidden-links">
            <NavLink
              style={{
                textDecoration: 'none',
                fontWeight: '700'
              }}
              to="/service"
            >
              Service
            </NavLink>
            <NavLink
              style={{
                textDecoration: 'none',
                fontWeight: '700'
              }}
              to="/policy"
            >
              Policy
            </NavLink>
            <NavLink
              style={{
                textDecoration: 'none',
                fontWeight: '700'
              }}
              to="/shop"
            >
              Shop
            </NavLink>
            <NavLink
              style={{
                textDecoration: 'none',
                fontWeight: '700'
              }}
              to="/about-system"
            >
              About system
            </NavLink>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          {userInfo ? (
            <UserDropDown
              user={userInfo}
              logoutBtn={
                <button
                  onClick={handleLogout}
                  style={{ width: '120px', height: '32px', marginLeft: 'auto' }}
                >
                  Log out
                </button>
              }
            />
          ) : (
            <NavLink to='/'>
              Login
            </NavLink>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </div>
      {sidebarOpen && (
        <div className="sidebar">
          <button className="close-btn" onClick={closeSidebar}>✕</button>
          <NavLink to="/service" onClick={closeSidebar}>Service</NavLink>
          <NavLink to="/policy" onClick={closeSidebar}>Policy</NavLink>
          <NavLink to="/shop" onClick={closeSidebar}>Shop</NavLink>
          <NavLink to="/about-system" onClick={closeSidebar}>About system</NavLink>
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderContent()}
    </>
  );
}
