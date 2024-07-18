import { useState } from 'react';
import './ListProduct.css';
import CartPage from '../CartPage/CartPage';
import DiamondPage from '../DiamondPage/DiamondPage';
import GoldPage from '../GoldPage/GoldPage';
import JewelryPage from '../JewelryPage/JewelryPage';
import SentPage from '../ListOrderSended/SentPage';
import { useSelector } from 'react-redux';

export default function ListProduct({ product }) {
    const [isActive, setIsActive] = useState('Jewelry');
    const userInfo = useSelector((state) => state.userReducer.userInfo);
    const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
    const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
    const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');
    const isStaff = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_SALES_STAFF');

    const handleClick = (tab) => {
        setIsActive(tab);
    };

    return (
        <div className='list_product_page'>
            <div>
                <div className="list-product">
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
                    {isStaff && (
                        <span
                            className={`button-nor ${isActive === 'Cart' ? 'active' : ''}`}
                            onClick={() => handleClick('Cart')}
                        >
                            Giỏ Hàng
                        </span>
                    )}
                    {isStaff && (
                        <span
                            className={`button-nor ${isActive === 'Sent' ? 'active' : ''}`}
                            onClick={() => handleClick('Sent')}
                        >
                            Đơn đã gửi
                        </span>
                    )}
                </div>
                <hr style={{ zIndex: '2', color: 'black' }} />
            </div>
            <div style={{ padding: '20px' }}>
                {isActive === 'Jewelry' && <JewelryPage />}
                {isActive === 'Gold' && <GoldPage />}
                {isActive === 'Diamond' && <DiamondPage />}
                {isActive === 'Cart' && <CartPage />}
                {isActive === 'Sent' && <SentPage />}
            </div>
        </div>
    );
}
