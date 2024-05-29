import React from 'react'

export default function Footer() {
  return (
    <div
      style={{
        height : '10vh',
        background : 'black',
        color : 'white',
        display : 'flex',
        alignItems : 'center',
        justifyContent: 'space-between',
        padding : "0 5%",
        margin : '0',
      }}
    >
      <div>
        <p>Version: 1.0.1</p>
        <p>Last update: 29/5/2024</p>
      </div>
      <div>
        Make by: Team 3
      </div>
    </div>
  )
}
