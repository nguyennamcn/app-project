import React, { useState } from 'react';

const Inventory = () => {
    const [items] = useState([
        { id: 1, category: 'Gold', quantity: 69 },
        { id: 2, category: 'Diamond', quantity: 70 },
        { id: 3, category: 'Jewelry', quantity: 108 }
    ]);//tạm data ảo

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
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Categories</th>
                        <th>Quantity of items</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button onClick={() => handleViewClick(item.category)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                .inventory-container {
                    margin: 20px;
                    font-family: 'Arial', sans-serif;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }

                th {
                    background-color: #f2f2f2;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Inventory;
