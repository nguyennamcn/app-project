// BuyListProduct.js
import React, { useState } from 'react';
import './BuyListProduct.css';
import BuyJewelry from './BuyJewelry';
import BuyGold from '../BuyGold/BuyGold';
import BuyDiamond from '../BuyDiamond/BuyDiamond';
import StoreSelection from '../BuyStoreProduct/BuyStoreProduct';
import PurchaseOrderByStaffId from '../PurchaseOrderList/purchaseOrdersByStaffId';

export default function BuyListProduct({ product }) {
    const [isActive, setIsActive] = useState('Jewelry');

    const handleClick = (tab) => {
        setIsActive(tab);
    };

    return (
        <div>
            {/* <img src={phim.} alt="image product" /> */}
            <div>
                <div className='list-product2'>
                    <span
                        className={`button-nor ${isActive === 'Jewelry' ? 'active' : ''}`}
                        onClick={() => handleClick('Jewelry')}
                    >
                        Trang sức
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Gold' ? 'active' : ''}`}
                        onClick={() => handleClick('Gold')}
                    >
                        Vàng
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Diamond' ? 'active' : ''}`}
                        onClick={() => handleClick('Diamond')}
                    >
                        Kim cương
                    </span>
                    <span
                        className={`button-nor ${isActive === 'StoreSelection' ? 'active' : ''}`}
                        onClick={() => handleClick('StoreSelection')}
                    >
                        Sản phẩm của cửa hàng
                    </span>
                    <span
                        className={`button-nor ${isActive === 'History' ? 'active' : ''}`}
                        onClick={() => handleClick('History')}
                    >
                        Lịch sử 
                    </span>

                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <BuyJewelry />}
                {isActive === 'Gold' && <BuyGold />}
                {isActive === 'Diamond' && <BuyDiamond />}
                {isActive === 'StoreSelection' && <StoreSelection />}
                {isActive === 'History' && <PurchaseOrderByStaffId />}
            </div>
        </div>
    );
}
