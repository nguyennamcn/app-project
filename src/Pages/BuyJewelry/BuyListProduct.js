// BuyListProduct.js
import React, { useState } from 'react';
import './BuyListProduct.css';
import BuyJewelry from './BuyJewelry';
import BuyGold from '../BuyGold/BuyGold';
import BuyDiamond from '../BuyDiamond/BuyDiamond';
import StoreSelection from '../BuyStoreProduct/BuyStoreProduct';

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
                        Jewelry
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Gold' ? 'active' : ''}`}
                        onClick={() => handleClick('Gold')}
                    >
                        Gold
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Diamond' ? 'active' : ''}`}
                        onClick={() => handleClick('Diamond')}
                    >
                        Diamond
                    </span>
                    <span
                        className={`button-nor ${isActive === 'StoreSelection' ? 'active' : ''}`}
                        onClick={() => handleClick('StoreSelection')}
                    >
                        StoreSelection
                    </span>

                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <BuyJewelry />}
                {isActive === 'Gold' && <BuyGold />}
                {isActive === 'Diamond' && <BuyDiamond />}
                {isActive === 'StoreSelection' && <StoreSelection />}
            </div>
        </div>
    );
}
