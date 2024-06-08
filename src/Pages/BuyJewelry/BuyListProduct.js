// BuyListProduct.js
import React, { useState } from 'react';
import './BuyListProduct.css';
import BuyJewelry from './BuyJewelry';
import BuyGold from '../BuyGold/BuyGold';
import BuyDiamond from '../BuyDiamond/BuyDiamond';
import BuyStoreProduct from '../BuyStoreProduct/BuyStoreProduct';
import History from '../History/History';

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
                        Detail Buy
                    </span>
                    <span
                        className={`button-nor ${isActive === 'History' ? 'active' : ''}`}
                        onClick={() => handleClick('History')}
                    >
                        History
                    </span>
                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <BuyJewelry />}
                {isActive === 'History' && <History />}
            </div>
        </div>
    );
}
