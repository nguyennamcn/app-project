import React, { useEffect, useState } from 'react';
import './Material.css';
import { adornicaServ } from '../../service/adornicaServ';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { Modal as AntdModal, notification } from 'antd';

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
        adornicaServ.createMaterial(newItemData)
            .then((res) => {
                console.log(`Created new material with id: ${res.data.id}`);
                setItems(prevItems => [...prevItems, { id: res.data.id, name: newItemName }]);
                setPageCount(Math.ceil((items.length + 1) / itemsPerPage));
                closeCreateMaterialModal();
                notification.success({ message: "Create successfully !" });

            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: errorMessage });
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
                notification.success({ message: "Delete successfully !" });
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: errorMessage });
                console.log(err);
            });
        closeConfirmationModal();
    };

    const handleUpdateMaterial = (id) => {
        const updatedData = { name: editName };
        adornicaServ.updateMaterial(id, updatedData)
            .then((res) => {
                console.log(`Updated material with id: ${id}`);
                setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updatedData } : item));
                notification.success({ message: "Update successfully !" });
                closeMaterialModal();
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.metadata?.message || err.message || "Server error";
                notification.error({ message: errorMessage });
                console.log(err);
            });
    };

    const showDeleteConfirm = (id) => {
        AntdModal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this material?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
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
        <div className="material-container">
            <h2 className="material-title">Material</h2>
            <button className="material-modal-button-create" onClick={openCreateMaterialModal}>Create</button>
            <div className="material-table-container">
                <table className="material-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.material}</td>
                                <td>
                                    <button onClick={() => openMaterialModal(item)}>Update</button>
                                    <button onClick={() => showDeleteConfirm(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="material-paginationContainer">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
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
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeMaterialModal}
                contentLabel="Material-update"
                className="material-modal"
            >
                {selectedItem && (
                    <div className="material-modal-content">
                        <h2 className="material-modal-header">Update Material</h2>
                        <label className="material-modal-label">
                            Name:
                            <input
                                className="material-modal-input"
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </label>
                        <div className="material-modal-buttons">
                            <button className="material-modal-button-save" onClick={() => handleUpdateMaterial(selectedItem.id)}>Save</button>
                            <button className="material-modal-button cancel" onClick={closeMaterialModal}>Close</button>
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
                    <h2 className="material-modal-header">Create New Material</h2>
                    <label className="material-modal-label">
                        Name:
                        <input
                            className="material-modal-input"
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                    </label>
                    <div className="material-modal-buttons">
                        <button className="material-modal-button-create" onClick={handleCreateMaterial}>Create</button>
                        <button className="material-modal-button cancel" onClick={closeCreateMaterialModal}>Cancel</button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={confirmationModalIsOpen}
                onRequestClose={closeConfirmationModal}
                contentLabel="Confirmation Modal"
            >
                <h2>Are you sure you want to delete this material ?</h2>
                <button onClick={() => handleDeleteMaterial(itemToDelete.id)}>Yes</button>
                <button onClick={closeConfirmationModal}>No</button>
            </Modal>
        </div>
    );
};

export default Material;
