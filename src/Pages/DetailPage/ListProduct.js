import { useState } from 'react';
import './ListProduct.css'
import CartPage from '../CartPage/CartPage';      // Import the CartPage component
import DiamondPage from '../DiamondPage/DiamondPage';
import GoldPage from '../GoldPage/GoldPage';
import JewelryPage from '../JewelryPage/JewelryPage';

export default function ListProduct({ product }) {
    const [isActive, setIsActive] = useState('Jewelry');

    const handleClick = (tab) => {
        setIsActive(tab);
    };

    return (
        <div>
            {/* <img src={phim.} alt="image product" /> */}
            <div>
                <div className='list-product'>
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
                        className={`button-nor ${isActive === 'Cart' ? 'active' : ''}`}
                        onClick={() => handleClick('Cart')}s
                    >
                        Cart
                    </span>
                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <JewelryPage />}
                {isActive === 'Gold' && <GoldPage />}
                {isActive === 'Diamond' && <DiamondPage />}
                {isActive === 'Cart' && <CartPage />}       
            </div>
        </div>
    );
}
