import { Table, Button, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
// import './PurchaseOrder.css'; // Thêm file CSS riêng nếu cần

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function PurchaseOrder() {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const ordersPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        adornicaServ.getPurchaseHistoryOrders()
            .then((res) => {
                const orders = res.data.metadata
                    .map((order, index) => ({
                        key: index,
                        salesStaffName: order.salesStaffName,
                        orderId: order.orderId,
                        orderCode: order.orderCode,
                        totalPrice: order.totalPrice,
                        dateOrder: formatDate(order.dateOrder),
                        paymentMethod: order.paymentMethod,
                        deliveryStatus: order.deliveryStatus,
                    }))
                    .sort((a, b) => a.orderId - b.orderId);

                setDataSource(orders);
                setFilteredData(orders);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const showModal = (message, orderCode = null) => {
        setModalMessage(message);
        setOrderCodeToDelete(orderCode);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        adornicaServ.deletePurchaseOrder(orderCodeToDelete)
            .then(() => {
                const newDataSource = dataSource.filter((item) => item.orderCode !== orderCodeToDelete);
                setDataSource(newDataSource);
                setFilteredData(newDataSource);
                setModalMessage(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check"></i><h1>Order was deleted!</h1></div>);
            })
            .catch((err) => {
                console.log("Error deleting order:", err);
            });
        setModalVisible(false);
    };

    const handleDelete = (key) => {
        showModal("Do you really want to delete this order?", key);
    };

    const handleView = (code) => {
        adornicaServ.getListOrderPurchase(code)
            .then((res) => {
                console.log(res.data); // Replace with navigation to detail page if needed
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        const filtered = dataSource.filter((entry) =>
            entry.salesStaffName.toLowerCase().includes(value.toLowerCase()) ||
            entry.orderCode.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(filteredData.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="order-list-container">
            <h1 className="order-list-title">Purchase List</h1>
            <div className="search-add-container">
                <Input
                    type="text"
                    placeholder="Search by Staff name or Order Code"
                    className="order-list-search-input"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
                    size="small"
                />
            </div>
            <table className="order-list-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Staff name</th>
                        <th>Purchase Code</th>
                        <th>Total Price</th>
                        <th>Date Order</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.orderId}>
                            <td data-label="Order ID">{order.orderId}</td>
                            <td data-label="Staff name">{order.salesStaffName}</td>
                            <td data-label="Purchase Code">{order.orderCode}</td>
                            <td data-label="Total Price">{order.totalPrice}</td>
                            <td data-label="Date Order">{order.dateOrder}</td>
                            <td data-label="Action">
                                <div className="action-buttons">
                                    <NavLink to={`/payment-history/${order.orderCode}`}>
                                        <Button
                                            style={{ marginRight: '14px' }}
                                            type="primary"
                                            onClick={() => handleView(order.orderCode)}
                                        >
                                            View
                                        </Button>
                                    </NavLink>
                                    {/* <Button
                                        style={{ marginRight: '14px' }}
                                        type="primary"
                                        danger
                                        onClick={() => handleDelete(order.orderCode)}
                                    >
                                        Delete
                                    </Button> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Modal
                title="Notification"
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
                className="custom-modal"
            >
                <div>
                    <p style={{ fontSize: '20px', marginBottom: '50px' }}>{modalMessage}</p>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            onClick={() => setModalVisible(false)}
                            style={{ marginRight: '40px' }}
                            size='large'
                        >
                            No
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={confirmDelete}
                            size='large'
                        >
                            Yes
                        </Button>
                    </div>
                </div>
            </Modal>
            <style>
                {`
                    .order-list-container {
                        padding: 20px;
                        max-height:70vh;
                        overflow-y: auto;
                    }

                    .order-list-title {
                        font-size: 2rem;
                        margin-bottom: 0px;
                    }

                    .search-add-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        margin-bottom: 10px;
                        width: 26%;
                    }

                    .order-list-search-input {
                        flex-grow: 1;
                        padding: 8px;
                        font-size: 1rem;
                        margin-right: 10px;
                    }

                    .add-order-list-button {
                        padding: 8px 16px;
                        font-size: 1rem;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        cursor: pointer;
                        white-space: nowrap;
                    }

                    .order-list-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 5px;
                    }

                    .order-list-table th,
                    .order-list-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }

                    .order-list-table th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }

                    .order-list-table td {
                        text-align: left;
                    }

                    .pagination-container {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 0px;
                    }

                    .pagination {
                        display: flex;
                    }

                    .pagination button {
                        padding: 8px 16px;
                        margin: 0 4px;
                        border: 1px solid #ddd;
                        background-color: white;
                        cursor: pointer;
                    }

                    .pagination button.active {
                        background-color: #008cba;
                        color: white;
                    }
                `}
            </style>
        </div>
    );
}
