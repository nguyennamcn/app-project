import React from 'react';
import './Inventory.css';

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
                                    <button onClick={() => handleViewClick(item.category)}>View</button>
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
