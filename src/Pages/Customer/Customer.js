import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    adornicaServ.getCustomerDetails() // Assuming this endpoint returns customer details
      .then((res) => {
        console.log(res.data.metadata);
        // Sắp xếp khách hàng theo thứ tự giảm dần của ID
        const sortedDetails = res.data.metadata.sort((a, b) => b.customerId - a.customerId);
        setCustomerDetails(sortedDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const currentDate = new Date().toLocaleDateString();

  const filteredDetails = customerDetails.filter(detail =>
    detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.phone.includes(searchTerm)
  );

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredDetails.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredDetails.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatBirthday = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>CUSTOMER INFORMATION</h2>
      <input 
        type="text"
        placeholder="Search by Name or Phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Birthday</th>
            <th style={styles.th}>Discount (%)</th>
            <th style={styles.th}>Purchased ($)</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((detail, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{detail.customerId}</td>
              <td style={styles.td}>{detail.name}</td>
              <td style={styles.td}>{detail.phone}</td>
              <td style={styles.td}>{detail.address}</td>
              <td style={styles.td}>{formatBirthday(detail.dateOfBirth)}</td>
              <td style={styles.td}>{detail.percentDiscount}</td>
              <td style={styles.td}>{detail.totalAmountPurchased}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.paginationContainer}>
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
};

const styles = {
  container: {
    maxHeight: '70vh',
    overflowY: 'auto',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: '#E46A25',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontSize: '16px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
  },
  pagination: {
    display: 'flex',
    listStyle: 'none',
    gap: '5px',
  },
  pageItem: {
    display: 'inline-block',
    padding: '10px',
    cursor: 'pointer',
  },
  pageLink: {
    textDecoration: 'none',
    color: '#007bff',
  },
  active: {
    fontWeight: 'bold',
    borderBottom: '3px solid #007bff',
  },
  disabled: {
    cursor: 'not-allowed',
    color: '#ccc',
  },
  '@media (max-width: 1024px)': {
    container: {
      marginLeft: '20px',
    },
    table: {
      fontSize: '14px',
    },
    th: {
      padding: '10px',
    },
    td: {
      padding: '10px',
    },
    searchBar: {
      fontSize: '14px',
      padding: '8px',
    },
    header: {
      fontSize: '20px',
      padding: '8px',
    },
    paginationContainer: {
      justifyContent: 'center',
    },
  },
  '@media (max-width: 480px)': {
    table: {
      fontSize: '12px',
    },
    th: {
      padding: '8px',
    },
    td: {
      padding: '8px',
    },
    searchBar: {
      fontSize: '12px',
      padding: '6px',
    },
    header: {
      fontSize: '18px',
      padding: '6px',
    },
    paginationContainer: {
      justifyContent: 'center',
    },
  },
};
