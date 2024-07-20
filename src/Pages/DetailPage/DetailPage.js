import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Descriptions, Modal, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './DetailPage.css';
import Spinner from '../../Components/Spinner/Spinner';

export default function DetailPage() {
    const [product, setProduct] = useState({});
    const [mainImageSrc, setMainImageSrc] = useState();
    const [quantity, setQuantity] = useState(1);
    const { productCode } = useParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.userReducer.userInfo);
    const isAdmin = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_ADMIN');
    const isManager = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_MANAGER');
    const isCashier = userInfo && userInfo.roleUsers && userInfo.roleUsers.includes('ROLE_CASHIER_STAFF');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adornicaServ.getDetailProduct(productCode)
            .then((res) => {
                setProduct(res.data.metadata);
                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false); // Đánh dấu đã tải xong
              });
    }, [productCode]);

    useEffect(() => {
        if (product && product.productAsset && product.productAsset.img1) {
            setMainImageSrc(product.productAsset.img1);
        }
    }, [product]);

    const handleImageClick = (newSrc) => {
        setMainImageSrc(newSrc);
    };

    const showModalnotify = (message) => {
        setModalMessage(message);
        setIsModalVisible(true);
    };

    const handleNotificationAddToCart = () => {
        notification.warning({
            message: 'Bạn không thể thực thi tính năng đó !',
            description:'Chỉ nhân viên bán hàng mới có thể thực hiện tính năng đó.',
        });
        
    }

    const handleAddToCart = () => {
        const item = {
            productId: product.id,
            productCode: product.productCode,
            name: product.productName,
            size: product.size,
            quantity,
            price: product.totalPrice,
            totalPrice: quantity * product.totalPrice
        };
        console.log(item);
        // Get existing cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the item is already in the cart
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode);

        if(product.totalPrice < 1){
            showModalnotify(<center className='notice__content'><i className="error__icon fa-solid fa-question" ></i><h1>Giá không xác định!</h1></center>);
            return;
          }

        if (existingItemIndex > -1) {
            showModalnotify(<center className='notice__content'><i className="error__icon fa-solid fa-circle-xmark"></i><h1>Sản phẩm đã được thêm từ trước!</h1></center>);
        } else {
            // Add new item to the cart
            cartItems.push(item);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Save updated cart items to local storage
            showModalnotify(<center className='notice__content'><i className="check__icon fa-solid fa-circle-check"></i><h1>Thêm sản phẩm thành công !</h1></center>);
        }
    };

    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Undefined';
    };

    return (
        <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="detail-page">
            <div className="main-section">
                <div className="image-info-section">
                    <div className="image-section">
                        <div className="thumbnail-images">
                            <img
                                className="thumbnail"
                                src={product.productAsset ? product.productAsset.img1 : ''}
                                alt="h1"
                                onClick={() => handleImageClick(product.productAsset ? product.productAsset.img1 : '')}
                            />
                            <img
                                className="thumbnail"
                                src={product.productAsset ? product.productAsset.img2 : ''}
                                alt="h2"
                                onClick={() => handleImageClick(product.productAsset ? product.productAsset.img2 : '')}
                            />
                            <img
                                className="thumbnail"
                                src={product.productAsset ? product.productAsset.img3 : ''}
                                alt="h3"
                                onClick={() => handleImageClick(product.productAsset ? product.productAsset.img3 : '')}
                            />
                        </div>
                        <img
                            className="main-image"
                            src={mainImageSrc}
                            alt="Main product image"
                        />
                    </div>
                    <div className="info-section">
                            <button className="close-button" type="button" onClick={() => navigate(-1)}>
                                X
                            </button>
                        <div className="product-header" style={{whiteSpace:'no'}}>
                            <p className="product-name">{product.productName}</p>
                            {/* <button className="close-button" type="button" onClick={() => navigate(-1)}>
                                X
                            </button> */}
                        </div>
                        {product.totalPrice < 1 ?
                            <p className="product-price">Giá sản phẩm: <span className="price-amount">Không xác định</span></p> :
                            <p className="product-price">Giá sản phẩm: <span className="price-amount">{formatPrice(product.totalPrice)}</span></p>
                        }
                        <div className="product-description">
                        </div>
                        {isAdmin || isCashier || isManager ? (
                            <button className="add-to-cart-button" type="button" onClick={handleNotificationAddToCart}>
                            Thêm sản phẩm
                        </button>
                        ) : (
                            <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>
                            Thêm sản phẩm
                        </button>
                        )}
                        

                    </div>
                    <div className="product-information">
                        <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Thông tin sản phẩm</span>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ fontSize: '15px', marginRight: '150px' }}>
                                <div style={{ marginTop: '5px' }}>ID: {product.id}</div>
                                <div style={{ marginTop: '5px' }}>Giới tính: {product.gender}</div>
                                <div style={{ marginTop: '5px' }}>Loại: {product.category}</div>
                                <div style={{ marginTop: '5px' }}>Kích cỡ: {product.size}</div>
                            </div>
                            <div style={{ fontSize: '15px' }}>
                                {product.materials?.map((mt, index) => (
                                    <div key={index}>
                                        <div>Vật liệu: {mt.name}</div>
                                    </div>
                                ))}

                                {product.gem?.map((sp, index) => (
                                    <div key={index}>
                                        <div style={{ marginTop: '5px' }}>Kim cương: {sp.gemName}</div>
                                        <div style={{ marginTop: '5px' }}>Độ tinh khiết: {sp.clarity}</div>
                                        <div style={{ marginTop: '5px' }}>Màu sắc: {sp.color}</div>
                                        <div style={{ marginTop: '5px' }}>Khối lượng: {sp.carat} ct</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal-detail"
            >
                <div>{modalMessage}</div>
            </Modal>
        </div>
      )
    }
</>
        
    );
}
