import React from 'react';
import './Inventory.css';
import { NavLink } from 'react-router-dom';

const Inventory = () => {
    const items = [
        { id: 1, category: 'Vàng', quantity: 69 },
        { id: 2, category: 'Kim Cương', quantity: 70 },
        { id: 3, category: 'Trang sức', quantity: 108 }
    ];

    const handleViewClick = (category) => {
        switch (category.toLowerCase()) {
            case 'vàng':
                window.location.href = '/ManageGold';
                break;
            case 'kim cương':
                window.location.href = '/ManageDiamond';
                break;
            case 'trang sức':
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
                }}>Vật liệu</h2>
            </NavLink>
            <h2 className="inventory-title">Sản phẩm</h2>
            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Loại</th>
                            <th></th>
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
                                        }} onClick={() => handleViewClick(item.category)}>Xem</button>
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