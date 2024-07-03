import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { adornicaServ } from '../../service/adornicaServ';
import Modal from 'react-modal';

const Material = () => {
    const [items, setItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editName, setEditName] = useState('');
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
        adornicaServ.getMaterial()
            .then((res) => {
                console.log(res.data.metadata);
                setItems(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const openModal = (item) => {
        setSelectedItem(item);
        setEditName(item.name); // Change this to item.name
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
        setEditName('');
    };

    const openCreateModal = () => {
        setCreateModalIsOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalIsOpen(false);
        setNewItemName('');
    };

    const handleCreateItem = () => {
        const newItemData = { name: newItemName }; // Use the new item name data
        adornicaServ.createMaterial(newItemData)
            .then((res) => {
                console.log(`Created new material with id: ${res.data.id}`);
                setItems(prevItems => [...prevItems, { id: res.data.id, name: newItemName }]);
                closeCreateModal();
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = (id) => {
        adornicaServ.deleteMaterial(id)
            .then((res) => {
                console.log(`Deleted material with id: ${id}`);
                setItems(prevItems => prevItems.filter(item => item.id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUpdate = (id) => {
        const updatedData = { name: editName }; // Use the edited name data
        adornicaServ.updateMaterial(id, updatedData)
            .then((res) => {
                console.log(`Updated material with id: ${id}`);
                setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updatedData } : item));
                closeModal();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="inventory-container">
            <h2 className="inventory-title">Material</h2>
            <button onClick={openCreateModal}>Create</button>
            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th> {/* Change Material to Name */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.material}</td> {/* Change item.material to item.name */}
                                <td>
                                    <button onClick={() => openModal(item)}>Update</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Modal"
            >
                {selectedItem && (
                    <div>
                        <h2>Update Material</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </label>
                        <button onClick={() => handleUpdate(selectedItem.id)}>Save</button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
            <Modal
                isOpen={createModalIsOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Create Modal"
            >
                <h2>Create New Material</h2>
                <label>
                    Name:
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                </label>
                <button onClick={handleCreateItem}>Create</button>
                <button onClick={closeCreateModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Material;
