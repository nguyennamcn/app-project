import React from 'react';
import './header.css';
import { useSelector } from 'react-redux';
import { localService } from '../../service/localService';
import UserDropDown from './UserDropDown';
import { NavLink } from 'react-router-dom';

export default function Header() {
  let userInfo = useSelector((state) => {
    return state.userReducer.userInfo;
  });

  let handleLogout = () => {
    localService.remove();
    window.location.reload();
  };

  let renderContent = () => {
    //let buttonCss = "px-5 py-2 border-2 border-black rounded";
    return (
      <div id='header'>
        <div className="header__login">
          <div className="header__login__left">
            <div className='img__login1'>
              {/* img */}
            </div>
          </div>
          <div className="header__login__right">
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
            {userInfo ? (
              <UserDropDown
                user={userInfo}
                logoutBtn={
                  <button
                    onClick={handleLogout}
                    //className={buttonCss}
                  style={{width:'120px',height:'32px',}}
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
}
