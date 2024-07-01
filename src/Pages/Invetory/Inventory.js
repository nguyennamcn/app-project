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

            <style>{`
                .inventory-container {
                    padding: 20px;
                    margin: 20px;
                    font-family: 'Arial', sans-serif;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #fff;
                    border-radius: 10px;
                    overflow: hidden;
                }

                th, td {
                    border: 2px solid #e0e0e0;
                    text-align: left;
                    padding: 12px 15px;
                }

                th {
                    background-color: #6AC4EA;
                    color: white;
                }

                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }

                tr:hover {
                    background-color: #ddd;
                }

                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background-color: #0056b3;
                }
            `}</style>
        </div>
    );
};

export default Inventory;
