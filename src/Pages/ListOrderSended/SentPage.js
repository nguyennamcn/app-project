import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Button, Modal } from 'antd';
import './SentPage.css';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const checkDiscount = (discount) => {
    if (discount === null) {
        discount = "NONE";
    }
    return discount;
}

export default function SentPage() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [orderCodeToDelete, setOrderCodeToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

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
        showModal("Bạn có muốn hủy đơn này không", key);
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

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataSource.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(dataSource.length / itemsPerPage);
    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Undefined';
    };

    return (
        <div className="sent-page-container">
            <div className='title'>
                <h1>Danh sách đơn hàng</h1>
                <div className="separator"></div>
            </div>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Mã đơn hàng</th>
                            <th>Số điện thoại</th>
                            <th>Nhân viên</th>
                            <th>Trạng thái</th>
                            <th>Thanh toán</th>
                            <th>Tổng</th>
                            <th>Giảm giá</th>
                            <th>Ngày</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(order => (
                            <tr key={order.orderId}>
                                <td data-label="ID">{order.orderId}</td>
                                <td data-label="Order code">{order.orderCode}</td>
                                <td data-label="Phone">{order.phone}</td>
                                <td data-label="Name">{order.name}</td>
                                <td data-label="Delivery status">{order.deliveryStatus}</td>
                                <td data-label="Payment method">{order.paymentMethod}</td>
                                <td data-label="Total">{formatPrice(order.totalPrice)}</td>
                                <td data-label="Discount">{order.discount}</td>
                                <td data-label="Create at">{order.createAt}</td>
                                <td data-label="Action">
                                    <div className="action-buttons">
                                        <NavLink to={`/detailOrderSended/${order.orderCode}`}>
                                            <Button
                                                style={{ marginRight: '14px' }}
                                                type="primary"
                                                onClick={() => handleView(order.orderCode)}
                                            >
                                                Xem
                                            </Button>
                                        </NavLink>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => handleDelete(order.orderCode)}
                                            disabled={order.deliveryStatus === 'SUCCESS' || order.paymentMethod !== 'NONE'}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="sent-pagination-container">
                <ReactPaginate
                previousLabel={'Trước'}
                nextLabel={'Sau'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'home-jewelry-pagination'}
                activeClassName={'home-jewelry-active'}
                pageClassName={'home-jewelry-page-item'}
                pageLinkClassName={'home-jewelry-page-link'}
                previousClassName={'home-jewelry-page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                disabledClassName={'home-jewelry-disabled'}
                />
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal-sent-page"
            >
                {orderCodeToDelete ? (
                    <div>
                        <p>{modalMessage}</p>
                        <div className="modal-buttons">
                            <Button
                                onClick={() => setIsModalVisible(false)}
                            >
                                Không
                            </Button>
                            <Button
                                type="primary"
                                danger
                                onClick={confirmDelete}
                            >
                                Có
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