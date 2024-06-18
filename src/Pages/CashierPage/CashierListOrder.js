import { Table, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const columns = (handleView, handleDelete, handleUpdate) => [
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
        title: 'Order Code',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
    },
    {
        title: 'Date Order',
        dataIndex: 'dateOrder',
        key: 'dateOrder',
    },
    {
        title: 'Payment method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
    },
    {
        title: 'Delivery Status',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus',
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => {
            const isSuccess = record.deliveryStatus.toLowerCase() === 'success';

            const isPaid = record.paymentMethod.toLowerCase() === ('cash' || 'banking') ;
            return (
                <div style={{ width: '50%', display: 'flex' }}>
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

    useEffect(() => {
        adornicaServ.getHistoryOrders()
            .then((res) => {
                const orders = res.data.metadata.map((order, index) => ({
                    key: index,
                    salesStaffName: order.salesStaffName,
                    orderId: order.orderId,
                    orderCode: order.orderCode,
                    totalPrice: order.totalPrice,
                    dateOrder: formatDate(order.dateOrder),
                    paymentMethod: order.paymentMethod,
                    deliveryStatus: order.deliveryStatus,
                }));
                setDataSource(orders);
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

    const handleView = (key) => {
        adornicaServ.getListOrderDetail(key)
            .then((res) => {
                console.log(res.data); // Replace with navigation to detail page if needed
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '0px 0 6px 0' }}>Order List</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div>
                <Table
                    style={{ margin: '8px 60px 0 60px' }}
                    dataSource={dataSource}
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
