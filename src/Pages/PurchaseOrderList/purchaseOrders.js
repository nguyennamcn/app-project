import { Table, Button, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ReactPaginate from 'react-paginate';
import './purchaseOrders.css';

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
    const ordersPerPage = 4;
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
        <div className="purchase-order-container">
            <h1 className="purchase-order-title">Purchase List</h1>
            <div className="search-add-container">
                <Input
                    type="text"
                    placeholder="Search by Staff name or Order Code"
                    className="purchase-order-search-input"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
                    size="small"
                />
            </div>
            <table className="purchase-order-table">
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
                                            style={{ marginRight: '14px',marginTop:'10px' }}
                                            type="primary"
                                            onClick={() => handleView(order.orderCode)}
                                        >
                                            View
                                        </Button>
                                    </NavLink>
                                    {/* <Button
                                        className=''
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
            <div className="purchase-pagination-container">
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
            
        </div>
    );
}
