import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ReactPaginate from 'react-paginate';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function ListOrderPage() {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const ordersPerPage = 4;
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        adornicaServ.getHistoryOrders()
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
        adornicaServ.deletePreOrder(orderCodeToDelete)
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

    const handleView = (key) => {
        adornicaServ.getListOrderDetail(key)
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
        setCurrentPage(0);
        const filtered = dataSource.filter((entry) =>
            entry.salesStaffName.toLowerCase().includes(value.toLowerCase()) ||
            entry.orderCode.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastOrder = (currentPage + 1) * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

    const pageCount = Math.ceil(filteredData.length / ordersPerPage);

    return (
        <div className="order-list-container">
            <h1 className="order-list-title">Orders</h1>
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
                        <th>Order Code</th>
                        <th>Total Price</th>
                        <th>Date Order</th>
                        <th>Payment method</th>
                        <th>Delivery Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.orderId}>
                            <td data-label="Order ID">{order.orderId}</td>
                            <td data-label="Staff name">{order.salesStaffName}</td>
                            <td data-label="Order Code">{order.orderCode}</td>
                            <td data-label="Total Price">{order.totalPrice}</td>
                            <td data-label="Date Order">{order.dateOrder}</td>
                            <td data-label="Payment method">{order.paymentMethod}</td>
                            <td data-label="Delivery Status">{order.deliveryStatus}</td>
                            <td data-label="Action">
                                <div className="action-buttons">
                                    <NavLink to={`/cashierOrderDetail/${order.orderCode}`}>
                                        <Button
                                            style={{ marginRight: '14px' }}
                                            type="primary"
                                            onClick={() => handleView(order.orderCode)}
                                        >
                                            View
                                        </Button>
                                    </NavLink>
                                    <Button
                                        style={{ marginRight: '14px' }}
                                        type="primary"
                                        danger
                                        onClick={() => handleDelete(order.orderCode)}
                                        disabled={order.deliveryStatus.toLowerCase() === 'success' || order.paymentMethod.toLowerCase() === ('cash' || 'banking')}
                                    >
                                        Delete
                                    </Button>
                                    <NavLink to={`/cashierUpdateOrder/${order.orderCode}`}>
                                        <Button
                                            type="primary"
                                            disabled={order.deliveryStatus.toLowerCase() === 'success' || order.paymentMethod.toLowerCase() === ('cash' || 'banking')}
                                        >
                                            Update
                                        </Button>
                                    </NavLink>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
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
                        max-height: 70vh;
                        overflow-y: auto;
                    }

                    .order-list-title {
                        font-size: 2rem;
                        margin-bottom: 0px;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
                    }

                    .search-add-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        margin-bottom: 5px;
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
                        margin-top: 20px;
                    }

                    .order-list-table th,
                    .order-list-table td {
                        border: 1.5px solid #ddd;
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
                        margin-top: 20px;
                    }

                    .pagination {
                        display: flex;
                        list-style: none;
                        padding: 0;
                    }

                    .page-item {
                        margin: 0 5px;
                    }

                    .page-link {
                        padding: 8px 16px;
                        border: 1px solid #ddd;
                        background-color: white;
                        cursor: pointer;
                    }

                    .page-link.active {
                        background-color: #008cba;
                        color: white;
                    }

                    .page-link.disabled {
                        color: #ccc;
                        cursor: not-allowed;
                    }
                `}
            </style>
        </div>
    );
}
