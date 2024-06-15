import React from 'react'
import './NavSide.css'
import { NavLink } from 'react-router-dom'
import { Flex } from 'antd'

export default function NavSide() {
  return (
    <div className='navbar'>
        <NavLink to='/homePage' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-home"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Home
          </p>
        </NavLink>
        <NavLink to='/inventory' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-tasks"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Inventory
          </p>
        </NavLink>
        <NavLink to='/employee' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-users"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Employees
          </p>
        </NavLink>
        <NavLink to='/cashierListOrder' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-file-invoice-dollar"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Order list
          </p>
        </NavLink>
        <NavLink to='/login' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-user"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Profile
          </p>
        </NavLink>
        <NavLink to='/gold-price' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-dollar-sign"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Gold price
          </p>
        </NavLink>
        <NavLink to='/login' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-question-circle"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Applications
          </p>
        </NavLink>
        <NavLink to='/login' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-user-cog"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
          Customer
          </p>
        </NavLink>
        <NavLink to='/login' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-tv"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            DashBoard
          </p>
        </NavLink>
        <NavLink to='/feedbacks' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-comment"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Feedback
          </p>
        </NavLink>
        <NavLink to='/buyProduct' 
          style={{
            width : '50%',
            display : 'flex',
            alignItems : 'center',
            textDecoration : 'none',
          }}
        >
          <i class="fa fa-hand-holding-usd"></i>
          <p 
          style={{
            marginLeft: '12px',
          }}>
            Buy
          </p>
        </NavLink>
          
    </div>
  )
}