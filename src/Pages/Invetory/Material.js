import React, { useEffect, useState } from 'react';
import './Material.css';
import { adornicaServ } from '../../service/adornicaServ';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { Modal as AntdModal, notification } from 'antd';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner/Spinner';

const Material = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editName, setEditName] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [priceSell, setPriceSell] = useState('');
    const [priceBuy, setPriceBuy] = useState('');
    const effdate = Date.now();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 3;

    useEffect(() => {
        adornicaServ.getMaterial()
            .then((res) => {
                console.log(res.data.metadata);
                const sortedItems = res.data.metadata.sort((a, b) => a.id - b.id);
                setItems(res.data.metadata);
                setPageCount(Math.ceil(res.data.metadata.length / itemsPerPage));
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false); // Đánh dấu đã tải xong
            });

    }, []);

    const openMaterialModal = (item) => {
        setSelectedItem(item);
        setEditName(item.name);
        setModalIsOpen(true);
    };

    const closeMaterialModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
        setEditName('');
    };

    const openCreateMaterialModal = () => {
        setCreateModalIsOpen(true);
    };

    const closeCreateMaterialModal = () => {
        setCreateModalIsOpen(false);
        setNewItemName('');
    };

    const handleCreateMaterial = () => {
        const newItemData = { name: newItemName };
        
        console.log(effdate)
        adornicaServ.createMaterial(newItemData)
            .then((res) => {
                console.log(`Created new material with id: ${res.data.id}`);
                setItems(prevItems => [...prevItems, { id: res.data.id, name: newItemName }]);
                setPageCount(Math.ceil((items.length + 1) / itemsPerPage));
                closeCreateMaterialModal();
                notification.success({ message: "Tạo thành công !" });
                // navigate(0); // Reload lại trang

            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
                console.log(err);
            });

        
    };

    const handleDeleteMaterial = (id) => {
        adornicaServ.deleteMaterial(id)
            .then((res) => {
                console.log(`Deleted material with id: ${id}`);
                const newItems = items.filter(item => item.id !== id);
                setItems(newItems);
                setPageCount(Math.ceil(newItems.length / itemsPerPage));
                notification.success({ message: "Xóa thành công !" });
                // navigate(0); // Reload lại trang
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
                console.log(err);
            });
        closeConfirmationModal();
    };

    const handleUpdateMaterial = (id) => {
        const updatedData = { name: editName };
        const newPriceData = {
            priceBuy: priceBuy,
            priceSell: priceSell,
            effectDate: effdate,
        };
        adornicaServ.updateMaterial(id, updatedData)
            .then((res) => {
                console.log(`Updated material with id: ${id}`);
                setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updatedData } : item));
                notification.success({ message: "Cập nhật thành công !" });
                navigate(0); // Reload lại trang
                closeMaterialModal();
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại !" });
                console.log(err);
            });

    
            adornicaServ.updatePriceMaterial(id, newPriceData)
            .then((res) => {
                console.log(`Created new material with id: ${res.data.id}`);
                setItems(prevItems => [...prevItems, { id: res.data.id, name: newItemName }]);
                setPageCount(Math.ceil((items.length + 1) / itemsPerPage));
                closeCreateMaterialModal();
                notification.success({ message: "Tạo thành công !" });
                navigate(0); // Reload lại trang

            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: "Lỗi ! Vui lòng kiểm tra lại" });
                console.log(err);
            });
    };

    const showDeleteConfirm = (id) => {
        AntdModal.confirm({
            content: 'Bạn có muốn xóa sản phẩm này không ?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                handleDeleteMaterial(id);
            }
        });
    };

    const closeConfirmationModal = () => {
        setConfirmationModalIsOpen(false);
        setItemToDelete(null);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="material-container">
                    <h2 className="material-title">Vật liệu</h2>
                    <NavLink to="/inventory" style={{
                        backgroundColor: 'gray',
                        border: '1px solid purple',
                        color: 'white',
                        padding: '13px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        justifyContent: 'flex-start',
                        margin: 'auto',
                    }}>Trở về</NavLink>
                    <button style={{
                        backgroundColor: '#00ca4d',
                        border: '1px solid purple',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        marginLeft: '20px'
                    }} onClick={openCreateMaterialModal}>Tạo mới</button>
                    <div className="material-table-container">
                        <table className="material-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.material}</td>
                                        <td>
                                            <button style={{
                                                backgroundColor: '#00ca4d',
                                                border: '1px solid purple',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }} onClick={() => openMaterialModal(item)}>Chỉnh sửa</button>
                                            <button
                                                onClick={() => showDeleteConfirm(item.id)}
                                                style={{
                                                    backgroundColor: 'red',
                                                    border: '1px solid purple',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="material-paginationContainer">
                        <ReactPaginate
                            previousLabel={'Trước'}
                            nextLabel={'Sau'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={'material-pagination'}
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
                        <div>
                        </div>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeMaterialModal}
                        contentLabel="Material-update"
                        className="material-modal"
                    >
                        {selectedItem && (
                            <div className="material-modal-content">
                                <h2 className="material-modal-header">Chỉnh sửa vật liệu</h2>
                                <label className="material-modal-label">
                                    Tên sản phẩm:
                                    <input
                                        className="material-modal-input"
                                        type="text"
                                        style={{
                                            marginLeft:'25px'
                                        }}
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                </label>
                                <label className="material-modal-label">
                                    Giá bán:
                                    <input
                                        className="material-modal-input"
                                        type="text"
                                        value={priceSell}
                                        onChange={(e) => setPriceSell(e.target.value)}
                                    />
                                </label><label className="material-modal-label">
                                    Giá thu mua:
                                    <input
                                        className="material-modal-input"
                                        type="text"
                                        value={priceBuy}
                                        onChange={(e) => setPriceBuy(e.target.value)}
                                    />
                                </label>
                                <div className="material-modal-buttons">
                                    <button style={{
                                        backgroundColor: '#00ca4d',
                                        border: '1px solid purple',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }} onClick={() => handleUpdateMaterial(selectedItem.id)}>Lưu</button>
                                    <button style={{
                                        backgroundColor: 'red',
                                        border: '1px solid purple',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                        onClick={closeMaterialModal}>Đóng</button>
                                </div>
                            </div>
                        )}
                    </Modal>
                    <Modal
                        isOpen={createModalIsOpen}
                        onRequestClose={closeCreateMaterialModal}
                        contentLabel="Material-create"
                        className="material-modal"
                    >
                        <div className="material-modal-content">
                            <h2 className="material-modal-header">Tạo vật liệu mới</h2>
                            <label className="material-modal-label">
                                Tên:
                                <input
                                    className="material-modal-input"
                                    type="text"
                                    style={{
                                        marginLeft: '25px'
                                    }}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                            </label>


                            <div className="material-modal-buttons">
                                <button style={{
                                    backgroundColor: '#00ca4d',
                                    border: '1px solid purple',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }} onClick={handleCreateMaterial}>Tạo</button>
                                <button style={{
                                    backgroundColor: 'red',
                                    border: '1px solid purple',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }} onClick={closeCreateMaterialModal}>Hủy</button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={confirmationModalIsOpen}
                        onRequestClose={closeConfirmationModal}
                        contentLabel="Confirmation Modal"
                    >
                        <h2>Are you sure you want to delete this material ?</h2>
                        <button className="material-modal-button-delete" onClick={() => handleDeleteMaterial(itemToDelete.id)}>Yes</button>
                        <button onClick={closeConfirmationModal}>No</button>
                    </Modal>
                </div>
            )
            }
        </>

    );
};

export default Material;