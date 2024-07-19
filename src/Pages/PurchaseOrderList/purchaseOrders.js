import { Table, Button, Modal, Input, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ReactPaginate from 'react-paginate';
import './purchaseOrders.css';
import Spinner from '../../Components/Spinner/Spinner';

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
    const ordersPerPage = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
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
            })
            .finally(() => {
                setLoading(false); // Đánh dấu đã tải xong
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
                setModalMessage(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check"></i><h1>Đơn hàng đã được xóa!</h1></div>);
                notification.success({ message: "Đơn hàng đã được xóa!" });
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
                console.log(err);
            });
        setModalVisible(false);
    };

    const handleDelete = (key) => {
        showModal("Bạn có muốn xóa đơn hàng này không", key);
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
        setCurrentPage(0);
    };

    const handlePageClick = ({ selected }) => {
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
        <div className="purchase-order-container">
            <h1 className="purchase-order-title"> Danh sách đơn hàng mua lại</h1>
            <div className="search-add-container">
                <Input
                    type="text"
                    placeholder="Tìm theo mã đơn hàng hoặc tên nhân viên"
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
                        <th>Số thứ tự</th>
                        <th>Nhân viên</th>
                        <th>Mã đơn hàng</th>
                        <th>Tổng số tiền</th>
                        <th>Ngày</th>
                        <th>Thanh toán</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.orderId}>
                            <td data-label="Số thứ tự">{order.orderId}</td>
                            <td data-label="Nhân viên">{order.salesStaffName}</td>
                            <td data-label="Mã đơn hàng">{order.orderCode}</td>
                            <td data-label="Tổng số tiền">{formatPrice(order.totalPrice)}</td>
                            <td data-label="Ngày">{order.dateOrder}</td>
                            <td data-label="Thanh toán">{order.paymentMethod}</td>
                            <td data-label="">
                                <div className="action-buttons">
                                    <NavLink to={`/payment-history/${order.orderCode}`}>
                                        <Button
                                            style={{
                                                backgroundColor: '#00ca4d',
                                                border: '1px solid purple',
                                                color: 'white',
                                                marginRight: '5px',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                            type="primary"
                                            onClick={() => handleView(order.orderCode)}
                                        >
                                            Xem
                                        </Button>
                                    </NavLink>
                                    <Button
                                        style={{
                                            backgroundColor: order.paymentMethod !== "NONE" ? 'gray' : 'red',
                                            border: '1px solid purple',
                                            color: 'white',
                                            marginRight: '5px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                        type="primary"
                                        danger
                                        onClick={() => handleDelete(order.orderCode)}
                                        disabled={order.paymentMethod !== "NONE"}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="purchase-pagination-container">
                <ReactPaginate
                    previousLabel={'Trước'}
                    nextLabel={'Sau'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
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
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
                className="custom-modal-purchased"
            >
                <div>
                    <p style={{ fontSize: '20px', marginBottom: '50px' }}>{modalMessage}</p>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            onClick={() => setModalVisible(false)}
                            style={{ marginRight: '40px' }}
                            size='large'
                        >
                            Không
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={confirmDelete}
                            size='large'
                        >
                            Có
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
