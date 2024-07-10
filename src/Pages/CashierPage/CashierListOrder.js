import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, notification } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ReactPaginate from 'react-paginate';
import './CashierListOrder.css'; // Đảm bảo rằng CSS này đã được cập nhật đúng với yêu cầu
import Spinner from '../../Components/Spinner/Spinner';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function SellOrderPage() {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const ordersPerPage = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
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
            })
            .finally(() => {
                setLoading(false); // Đánh dấu đã tải xong
              });
    }, []);

    const showDeleteModal = (message, orderCode = null) => {
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
                notification.success({ message: "Order was deleted!" });
            })
            .catch((err) => {
                console.log("Error deleting order:", err);
            });
        setModalVisible(false);
    };

    const handleDeleteOrder = (key) => {
        showDeleteModal("Do you really want to delete this order?", key);
    };

    const handleViewOrder = (key) => {
        adornicaServ.getListOrderDetail(key)
            .then((res) => {
                console.log(res.data); // Replace with navigation to detail page if needed
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSearchOrders = (e) => {
        const { value } = e.target;
        setSearchText(value);
        setCurrentPage(0);
        const filtered = dataSource.filter((entry) =>
            entry.salesStaffName.toLowerCase().includes(value.toLowerCase()) ||
            entry.orderCode.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastOrder = (currentPage + 1) * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

    const pageCount = Math.ceil(filteredData.length / ordersPerPage);
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    

    return (
        <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="sell-order-container">
            <h1 className="sell-order-title">Orders</h1>
            <div className="search-add-container">
                <Input
                    type="text"
                    placeholder="Search by Staff name or Order Code"
                    className="sell-order-search-input"
                    value={searchText}
                    onChange={handleSearchOrders}
                    prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
                    size="small"
                />
            </div>
            <table className="sell-order-table">
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
            <td data-label="Total Price">{formatPrice(order.totalPrice)}</td>
            <td data-label="Date Order">{order.dateOrder}</td>
            <td data-label="Payment method">{order.paymentMethod}</td>
            <td data-label="Delivery Status">{order.deliveryStatus}</td>
            <td data-label="Action">
                <div className="action-buttons">
                    <NavLink to={`/cashierOrderDetail/${order.orderCode}`}>
                        <Button
                            style={{ backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            // padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight:'5px' }}
                            type="primary"
                            onClick={() => handleViewOrder(order.orderCode)}
                        >
                            View
                        </Button>
                    </NavLink>
                    <NavLink>
                    <Button
                        style={{ backgroundColor: order.deliveryStatus.toLowerCase() === 'success' || order.paymentMethod.toLowerCase() === 'cash' || order.paymentMethod.toLowerCase() === 'banking' ? 'gray' : 'red',
                            border: '1px solid purple',
                            color: 'white',
                            marginTop:'10px',
                            marginRight:'5px',
                            borderRadius: '5px',
                            cursor: 'pointer' }}
                        type="primary"
                        danger
                        onClick={() => handleDeleteOrder(order.orderCode)}
                        disabled={order.deliveryStatus.toLowerCase() === 'success' || order.paymentMethod.toLowerCase() === ('cash' || 'banking')}
                    >
                        Delete
                    </Button>
                    </NavLink>
                    <NavLink to={`/cashierUpdateOrder/${order.orderCode}`}>
                        <Button
                            style={{ 
                                border: '1px solid purple',
                                marginRight:'5px',
                                borderRadius: '5px',
                                cursor: 'pointer' }}
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
                    onPageChange={handlePageChange}
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
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
                className="custom-modal-list"
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
      )
    }
</>
        
    );
}
