import React from 'react';
import './Inventory.css';
import { NavLink } from 'react-router-dom';

const Inventory = () => {
    const items = [
        { id: 1, category: 'Gold', quantity: 69 },
        { id: 2, category: 'Diamond', quantity: 70 },
        { id: 3, category: 'Jewelry', quantity: 108 }
    ];

    const handleViewClick = (category) => {
        switch (category.toLowerCase()) {
            case 'gold':
                window.location.href = '/ManageGold';
                break;
            case 'diamond':
                window.location.href = '/ManageDiamond';
                break;
            case 'jewelry':
                window.location.href = '/ManageJewelry';
                break;
            default:
                window.location.href = '/';
        }
    };

    return (
        <div className="inventory-container">
            <NavLink to={'/inventory/material'} className="inventory-material">
                <h2 style={{
                    textAlign: 'right',
                    position: 'absolute',
                    right: '5%'
                }}>Material</h2>
            </NavLink>
            <h2 className="inventory-title">Inventory</h2>
            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.category}</td>
                                <td>
                                    <button style={{
                                            backgroundColor: '#00ca4d',
                                            border: '1px solid purple',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }} onClick={() => handleViewClick(item.category)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;