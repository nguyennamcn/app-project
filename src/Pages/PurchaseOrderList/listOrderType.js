import { useState } from 'react';
import './listOrderType.css';
import CartPage from '../CartPage/CartPage';      // Import the CartPage component
import PurchaseOrder from './purchaseOrders';


export default function ListOrderType({ product }) {
    const [isActive, setIsActive] = useState('Purchase');

    const handleClick = (tab) => {
        setIsActive(tab);
    };

    return (
        <div>
            {/* <img src={phim.} alt="image product" /> */}
            <div>
                <div className='list-product'>
                    <span
                        className={`button-nor ${isActive === 'Purchase' ? 'active' : ''}`}
                        onClick={() => handleClick('Purchase')}
                    >
                        Purchase
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Sell' ? 'active' : ''}`}
                        onClick={() => handleClick('Sell')}
                    >
                        Sell
                    </span>
                    {/* <span
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
                    </span> */}
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
                {isActive === 'Purchase' && <PurchaseOrder />}
                {/* {isActive === 'Cart' && <CartPage />}       
                {isActive === 'Sent' && <SentPage />}    */}
            </div>
        </div>
    );
}
