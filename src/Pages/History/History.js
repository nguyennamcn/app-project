import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { adornicaServ } from '../../service/adornicaServ';

const BuyHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshOrders, setRefreshOrders] = useState(false); // Trigger for re-fetching orders
  const [isAscending, setIsAscending] = useState(true); // Sorting order for Delivery Status
  const ordersPerPage = 5;

  useEffect(() => {
    adornicaServ.getHistoryOrders()
      .then((res) => {
        if (res.data && res.data.metadata) {
          const sortedOrders = res.data.metadata.sort((a, b) => a.orderId - b.orderId);
          setOrderHistory(sortedOrders);
        }
        console.log(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshOrders]); // Add refreshOrders to the dependency array

  const handleSubmit = (keyID) => {
    const orderID = keyID;

    adornicaServ.postUpdateDeliveryOrder(orderID)
      .then((res) => {
        console.log('Order submitted successfully:', res.data);
        alert("Submit success");
        setRefreshOrders(!refreshOrders); // Toggle the refresh state to re-fetch orders
      })
      .catch((err) => {
        console.log('Error submitting order:', err.response); // Log error details
        // alert( err.response.data.metadata.message)
      });
  };

  const handleSort = () => {
    const sortedOrders = [...orderHistory].sort((a, b) => {
      if (isAscending) {
        return a.deliveryStatus.localeCompare(b.deliveryStatus);
      } else {
        return b.deliveryStatus.localeCompare(a.deliveryStatus);
      }
    });
    setOrderHistory(sortedOrders);
    setIsAscending(!isAscending);
  };

  // Calculate the orders to be displayed on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderHistory.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate the total number of pages
  const pageCount = Math.ceil(orderHistory.length / ordersPerPage);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

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
    tableHeaderButton: {
      background: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
      cursor: 'pointer',
      fontWeight: 'bold',
      textDecoration: 'none',
    },
    tableHeaderButtonHover: {
      textDecoration: 'underline',
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
    },
    button: {
      padding: '5px 10px',
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    button_style: {
      backgroundColor: 'green',
      padding: '4px',
      color: 'white',
      borderRadius: '4px',
    }
  };

  return (
    <div style={styles.buyHistory}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Sales Staff</th>
            <th style={styles.tableHeader}>Order Code</th>
            <th style={styles.tableHeader}>Total Price</th>
            <th style={styles.tableHeader}>Order Date</th>
            <th style={styles.tableHeader}>Payment Method</th>
            <th style={styles.tableHeader}>
              <button
                style={styles.tableHeaderButton}
                onClick={handleSort}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Delivery Status
              </button>
            </th>
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={index}>
                <td style={styles.tableData}>
                  {order.orderId}
                </td>
                <td style={styles.tableData}>{order.salesStaffName}</td>
                <td style={styles.tableData}>{order.orderCode}</td>
                <td style={styles.tableData}>{order.totalPrice}</td>
                <td style={styles.tableData}>{order.dateOrder}</td>
                <td style={styles.tableData}>{order.paymentMethod}</td>
                <td style={styles.tableData}>{order.deliveryStatus}</td>
                <td style={styles.tableData}>
                  {order.deliveryStatus !== 'SUCCESS' && (
                    <button
                      style={styles.button_style}
                      onClick={() => handleSubmit(order.orderId)}
                    >
                      Delivery
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.tableData} colSpan="8">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{...styles.button, ...(currentPage === 1 && styles.buttonDisabled)}}>{'<'}</button>
        <span>{`Page ${currentPage} of ${pageCount}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount} style={{...styles.button, ...(currentPage === pageCount && styles.buttonDisabled)}}>{'>'}</button>
      </div>
    </div>
  );
};

export default BuyHistory;
