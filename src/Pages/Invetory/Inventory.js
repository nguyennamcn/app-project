import React, { useState } from 'react';
import './Inventory.css';  // Đảm bảo bạn đã nhập đúng tệp CSS

const Inventory = () => {
    
    const [items, setItems] = useState([
        { id: 1, category: 'Gold', quantity: 69 },
        { id: 2, category: 'Diamond', quantity: 70 },
        { id: 3, category: 'Jewelry', quantity: 108 }
    ]);

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
                            <td><button>View</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
