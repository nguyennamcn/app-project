import { Table, Button, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import './CashierListOrder.css';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const columns = (handleView, handleDelete) => [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (text) => <span data-label="Order ID">{text}</span>,
    },
    {
        title: 'Staff name',
        dataIndex: 'salesStaffName',
        key: 'salesStaffName',
        render: (text) => <span data-label="Staff name">{text}</span>,
    },
    {
        title: 'Order Code',
        dataIndex: 'orderCode',
        key: 'orderCode',
        render: (text) => <span data-label="Order Code">{text}</span>,
    },
    {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (text) => <span data-label="Total Price">{text}</span>,
    },
    {
        title: 'Date Order',
        dataIndex: 'dateOrder',
        key: 'dateOrder',
        render: (text) => <span data-label="Date Order">{text}</span>,
    },
    {
        title: 'Payment method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        render: (text) => <span data-label="Payment method">{text}</span>,
    },
    {
        title: 'Delivery Status',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus',
        render: (text) => <span data-label="Delivery Status">{text}</span>,
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => {
            const isSuccess = record.deliveryStatus.toLowerCase() === 'success';
            const isPaid = record.paymentMethod.toLowerCase() === ('cash' || 'banking');
            return (
                <div className="action-buttons">
                    <NavLink to={`/cashierOrderDetail/${record.orderCode}`}>
                        <Button
                            style={{ marginRight: '14px' }}
                            type="primary"
                            onClick={() => handleView(record.orderCode)}
                        >
                            View
                        </Button>
                    </NavLink>
                    <Button
                        style={{ marginRight: '14px' }}
                        type="primary"
                        danger
                        onClick={() => handleDelete(record.orderCode)}
                        disabled={isSuccess || isPaid}
                    >
                        Delete
                    </Button>
                    <NavLink to={`/cashierUpdateOrder/${record.orderCode}`}>
                        <Button
                            type="primary"
                            disabled={isSuccess || isPaid}
                        >
                            Update
                        </Button>
                    </NavLink>
                </div>
            );
        }
    },
];

export default function ListOrderPage() {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

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
                    .sort((a, b) => b.orderId - a.orderId);

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
        const filtered = dataSource.filter((entry) =>
            entry.salesStaffName.toLowerCase().includes(value.toLowerCase()) ||
            entry.orderCode.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <div style={{maxHeight:'70vh',overflowY:'auto'}}>
            <div className='title'>
                <h1>Order List</h1>
                <div className='line'></div>
            </div>
            <div className='table-container'>
                <Input
                    className='search-input'
                    placeholder="Search by Staff name or Order Code"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
                    size="small"
                />
                <Table
                    className="table"
                    dataSource={filteredData}
                    columns={columns(handleView, handleDelete)}
                    pagination={{ className: 'custom__pagination', pageSize: 4 }}
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
