import { Table, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const columns = (handleView, handleDelete) => [
    {
        title: 'Order code',
        dataIndex: 'orderCode',
        key: 'orderCode',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Total',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
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
                >
                    Cancel
                </Button>
            </div>
        ),
    },
];

export default function SentPage(){
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);

    let userInfo = useSelector((state) => {
        return state.userReducer.userInfo;
    });

    useEffect(() => {
        adornicaServ.getListOrderByStaffID(userInfo.id)
            .then((res) => {
                const orders = res.data.metadata.map((order, index) => ({
                    key: index,
                    orderCode: order.orderCode,
                    phone: order.phone,
                    name: order.name,
                    totalPrice: order.totalPrice,
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
                showModal(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check" ></i><h1>Product was deleted!</h1></div>);
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

    return(
        <div>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 20px 0' }}>List order sended</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div>
                <Table
                    style={{ margin: '30px 60px 0 60px' }}
                    dataSource={dataSource}
                    columns={columns(handleView, handleDelete)}
                    pagination={{className:'custom__pagination', pageSize: 4 }}
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
                        <p style={{fontSize:'20px', marginBottom:'50px'}}>{modalMessage}</p>
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
