import { Table, Button, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const columns = (handleView, handleDelete) => [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
    },
    {
        title: 'Staff name',
        dataIndex: 'salesStaffName',
        key: 'salesStaffName',
    },
    {
        title: 'Purchase Code',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
    },
    // {
    //     title: 'Date Order',
    //     dataIndex: 'dateOrder',
    //     key: 'dateOrder',
    // },
    // {
    //     title: 'Payment method',
    //     dataIndex: 'paymentMethod',
    //     key: 'paymentMethod',
    // },
    // {
    //     title: 'Delivery Status',
    //     dataIndex: 'deliveryStatus',
    //     key: 'deliveryStatus',
    // },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => {
            return (
                <div style={{ width: '50%', display: 'flex' }}>
                    <NavLink to={`/payment-history/${record.orderCode}`}>
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
                    >
                        Delete
                    </Button>
                </div>
            );
        }
    },
];

export default function PurchaseOrder() {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

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
                    .sort((a, b) => b.orderId - a.orderId); // Sắp xếp theo thứ tự giảm dần

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
                setModalMessage(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check" ></i><h1>Order was deleted!</h1></div>);
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

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '0px 0 6px 0' }}>Purchase List</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div style={{ margin: '20px 80px' }}>
                <Input
                    placeholder="Search by Staff name or Order Code"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
                    size="small"
                    style={{ marginBottom: 20, width: '270px' }}
                />
                <Table
                    style={{ margin: '8px 0' }}
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
