import { useState } from 'react';
import './listOrderType.css';
import CartPage from '../CartPage/CartPage';      // Import the CartPage component
import DiamondOrder from '../PurchaseOrderList/diamondOrder';
import GoldOrder from '../PurchaseOrderList/goldOrder';
import JewelryOrder from '../PurchaseOrderList/jewelryOrder';
import SentPage from '../ListOrderSended/SentPage';
import History from '../History/History';

export default function ListOrderType({ product }) {
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
                        onClick={() => handleClick('Cart')}
                    >
                        Cart
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Sent' ? 'active' : ''}`}
                        onClick={() => handleClick('Sent')}
                    >
                        Sent
                    </span>
                    {/* <span
                        className={`button-nor ${isActive === 'History' ? 'active' : ''}`}
                        onClick={() => handleClick('History')}
                    >
                        History
                    </span> */}
                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <JewelryOrder />}
                {isActive === 'Gold' && <GoldOrder />}
                {isActive === 'Diamond' && <DiamondOrder />}
                {/* {isActive === 'Cart' && <CartPage />}       
                {isActive === 'Sent' && <SentPage />}    */}
            </div>
        </div>
    );
}
