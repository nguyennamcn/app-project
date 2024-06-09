import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';

const BuyHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    adornicaServ.getHistoryOrders()
      .then((res) => {
        if (res.data && res.data.metadata) {
          setOrderHistory(res.data.metadata);
        }
        console.log(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (keyID) => {
    const orderID = keyID;

    adornicaServ.postUpdateDeliveryOrder(orderID)
      .then((res) => {
        console.log('Order submitted successfully:', res.data);
        alert("Submit success");
      })
      .catch((err) => {
        console.log('Error submitting order:', err.response); // Log error details
        // alert( err.response.data.metadata.message)
      });
  };

  // Calculate the orders to be displayed on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderHistory.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orderHistory.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const styles = {
    buyHistory: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      margin: '0px',
      width: '100%',
      height: '100%',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '0px',
    },
    tableHeader: {
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    tableData: {
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    navLink: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      width: '100%',
      height: '100%',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    pageItem: {
      padding: '10px',
      cursor: 'pointer',
    },
    activePageItem: {
      padding: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    button_style: {
      backgroundColor: 'green',
      padding:'4px',
      color:'white',
      borderRadius:'4px',
    }
  };

  return (
    <div style={styles.buyHistory}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Sales Staff</th>
            <th style={styles.tableHeader}>Total Price</th>
            <th style={styles.tableHeader}>Order Date</th>
            <th style={styles.tableHeader}>Payment Method</th>
            <th style={styles.tableHeader}>Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={index}>
                <td style={styles.tableData}>
                  <NavLink style={styles.navLink} to={`/detail/${order.orderId}`}>
                    {order.orderId}
                  </NavLink>
                </td>
                <td style={styles.tableData}>{order.salesStaffName}</td>
                <td style={styles.tableData}>{order.totalPrice}</td>
                <td style={styles.tableData}>{order.dateOrder}</td>
                <td style={styles.tableData}>{order.paymentMethod}</td>
                <td style={styles.tableData}>{order.deliveryStatus}</td>
                <td style={styles.tableData}>
                  <button
                    style={styles.button_style}
                    onClick={() => handleSubmit(order.orderId)}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.tableData} colSpan="6">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={styles.pagination}>
        {pageNumbers.map(number => (
          <span
            key={number}
            style={currentPage === number ? styles.activePageItem : styles.pageItem}
            onClick={() => paginate(number)}
          >
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BuyHistory;
