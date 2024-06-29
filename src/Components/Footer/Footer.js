import React from 'react';

export default function Footer() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      style={{
        height: '10vh',
        background: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        margin: '0',
      }}
    >
      <div>
        <p>Version: 1.0.1</p>
        <p>Last update: {formattedDate}</p>
      </div>
      <div>
        Made by: Team 3
      </div>
    </div>
  );
}
