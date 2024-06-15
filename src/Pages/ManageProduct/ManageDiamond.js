import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';

export default function ManageDiamond() {
  const [diamondManage, setDiamondManage] = useState([]);

  useEffect(() => {
    adornicaServ.getDiamondPrice()
      .then((res) => {
        console.log(res.data.metadata);
        setDiamondManage(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = (diamondId) => {
    const updatedDiamonds = diamondManage.filter(diamond => diamond.gemId !== diamondId);
    setDiamondManage(updatedDiamonds);
  };

  const handleInputChange = (e, diamondId) => {
    const { name, value } = e.target;
    setDiamondManage(prevState =>
      prevState.map(diamond =>
        diamond.gemId === diamondId ? { ...diamond, [name]: value } : diamond
      )
    );
  };

  const handleUpdate = (diamondId) => {
    const updatedDiamond = diamondManage.find(diamond => diamond.gemId === diamondId);
    console.log('Updated Diamond:', updatedDiamond);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentDiamonds = diamondManage.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(diamondManage.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>DIAMOND INVENTORY</h1>
        <NavLink to="/adddiamond" style={styles.addButton}>ADD DIAMOND</NavLink>
      </header>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Origin</th>
            <th style={styles.th}>Carat</th>
            <th style={styles.th}>Clarity</th>
            <th style={styles.th}>Color</th>
            <th style={styles.th}>Cut</th>
            <th style={styles.th}>BuyPrice</th>
            <th style={styles.th}>SellPrice</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDiamonds.map((diamond) => (
            <tr key={diamond.gemId}>
              <td style={styles.td}>{diamond.gemId}</td>
              <td style={styles.td}>{diamond.origin}</td>
              <td style={styles.td}>{diamond.carat}</td>
              <td style={styles.td}>{diamond.clarity}</td>
              <td style={styles.td}>{diamond.color}</td>
              <td style={styles.td}>{diamond.cut}</td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="gemBuyPrice"
                  value={diamond.gemBuyPrice}
                  onChange={(e) => handleInputChange(e, diamond.gemId)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="gemSellPrice"
                  value={diamond.gemSellPrice}
                  onChange={(e) => handleInputChange(e, diamond.gemId)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>{diamond.effectDate}</td>
              <td style={styles.td}>
                <button
                  style={styles.updateButton}
                  onClick={() => handleUpdate(diamond.gemId)}
                >
                  Update
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(diamond.gemId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>
        <NavLink to="/inventory" style={styles.backButton}>BACK</NavLink>
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} style={styles.pageButton} onClick={() => changePage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '25px'
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  updateButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 20px'
  },
  pageButton: {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};


