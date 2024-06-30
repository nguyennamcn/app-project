import { useState } from 'react';
import ListOrderPage from '../CashierPage/CashierListOrder';    
import PurchaseOrder from '../PurchaseOrderList/purchaseOrders';    

export default function HistoryOrder({ product }) {
    const [isActive, setIsActive] = useState('Sell');

    const handleClick = (tab) => {
        setIsActive(tab);
    };

    return (
        <div>
            {/* <img src={phim.} alt="image product" /> */}
            <div>
                <div className='list-product'>
                    <span
                        className={`button-nor ${isActive === 'Sell' ? 'active' : ''}`}
                        onClick={() => handleClick('Sell')}
                    >
                        Sell
                    </span>
                    <span
                        className={`button-nor ${isActive === 'Purchase' ? 'active' : ''}`}
                        onClick={() => handleClick('Purchase')}
                    >
                        Purchase
                    </span>
                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Sell' && <ListOrderPage />}
                {isActive === 'Purchase' && <PurchaseOrder />}
            </div>
        </div>
    );
}
