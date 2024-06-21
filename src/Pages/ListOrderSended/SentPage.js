import { Table, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const columns = (handleView, handleDelete) => [
    {
        title: 'ID',
        dataIndex: 'orderId',
        key: 'orderId',
    },
    {
        title: 'Order code',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },    
    {
        title: 'Delivery status',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus',
    },    
    {
        title: 'Payment method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
    },    
    {
        title: 'Total',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
    },
    {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
    },
    {
        title: 'Create at',
        dataIndex: 'createAt',
        key: 'createAt',
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (_, record) => (
            <div style={{ width: '50%', display: 'flex' }}>
                <NavLink to={`/detailOrderSended/${record.orderCode}`}>
                    <Button
                        style={{ marginRight: '14px' }}
                        type="primary"
                        onClick={() => handleView(record.orderCode)}
                    >
                        View
                    </Button>
                </NavLink>
                <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleDelete(record.orderCode)}
                    disabled={record.deliveryStatus === 'SUCCESS' || record.paymentMethod !== 'NONE'}
                >
                    Cancel
                </Button>
            </div>
        ),
    },
];

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const checkDiscount = (discount) => {
    if(discount === null){
        discount = "NONE";
    }
    return discount;
}

export default function SentPage() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);

    let userInfo = useSelector((state) => state.userReducer.userInfo);

    useEffect(() => {
        adornicaServ.getListOrderByStaffID(userInfo.id)
            .then((res) => {
                const orders = res.data.metadata.data.map((order) => ({
                    orderId: order.orderId,
                    orderCode: order.orderCode,
                    deliveryStatus: order.deliveryStatus,
                    paymentMethod: order.paymentMethod,
                    phone: order.phone,
                    name: order.name,
                    totalPrice: order.totalPrice,
                    discount: checkDiscount(order.discount),
                    createAt: formatDate(order.createAt),
                }));
                setDataSource(orders);
                console.log(orders);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo.id]);

    const showModal = (message, orderCode = null) => {
        setModalMessage(message);
        setOrderCodeToDelete(orderCode);
        setIsModalVisible(true);
    };

    const handleDelete = (key) => {
        showModal("Do you really want to cancel this order?", key);
    };

    const confirmDelete = () => {
        adornicaServ.deletePreOrder(orderCodeToDelete)
            .then(() => {
                const newDataSource = dataSource.filter((item) => item.orderCode !== orderCodeToDelete);
                setDataSource(newDataSource);
                showModal(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check" ></i><h1>Order was deleted!</h1></div>);
            })
            .catch((err) => {
                console.log("Error deleting order:", err);
            });
        setIsModalVisible(false);
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
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 10px 0' }}>List order sended</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div>
                <Table
                    style={{ margin: '10px 60px 0 60px' }}
                    dataSource={dataSource}
                    columns={columns(handleView, handleDelete)}
                    pagination={{ className: 'custom__pagination', pageSize: 4 }}
                />
            </div>
            <Modal
                title="Notification"
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal"
            >
                {orderCodeToDelete ? (
                    <div>
                        <p style={{ fontSize: '20px', marginBottom: '50px' }}>{modalMessage}</p>
                        <div style={{ textAlign: 'center' }}>
                            <Button 
                                onClick={() => setIsModalVisible(false)} 
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
                ) : (
                    <div>{modalMessage}</div>
                )}
            </Modal>
        </div>
    );
}
