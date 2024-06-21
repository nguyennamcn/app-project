import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailPage() {
    const [product, setProduct] = useState({});
    const [mainImageSrc, setMainImageSrc] = useState();
    const [quantity, setQuantity] = useState(1);
    const { productCode } = useParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        adornicaServ.getDetailProduct(productCode)
            .then((res) => {
                setProduct(res.data.metadata);
                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
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
            showModalnotify(<div className='notice__content'><i className="error__icon fa-solid fa-question" ></i><h1>Product has not been priced yet !</h1></div>);
            return;
          }

        if (existingItemIndex > -1) {
            showModalnotify(<div className='notice__content'><i className="error__icon fa-solid fa-circle-xmark"></i><h1>Product was added !</h1></div>);
        } else {
            // Add new item to the cart
            cartItems.push(item);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Save updated cart items to local storage
            showModalnotify(<div className='notice__content'><i className="check__icon fa-solid fa-circle-check"></i><h1>Product added successfully !</h1></div>);
        }
    };

    return (
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
                    <div className="product-information">
                        <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Product information</span>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ fontSize: '15px', marginRight: '150px' }}>
                                <div style={{ marginTop: '5px' }}>ID: {product.id}</div>
                                <div style={{ marginTop: '5px' }}>Gender: {product.gender}</div>
                                <div style={{ marginTop: '5px' }}>Category: {product.category}</div>
                                <div style={{ marginTop: '5px' }}>Size: {product.size}</div>
                            </div>
                            <div style={{ fontSize: '15px' }}>
                                {product.materials?.map((mt, index) => (
                                    <div key={index}>
                                        <div>Material: {mt.name}</div>
                                    </div>
                                ))}

                                {product.gem?.map((sp, index) => (
                                    <div key={index}>
                                        <div style={{ marginTop: '5px' }}>Diamond: {sp.gemName}</div>
                                        <div style={{ marginTop: '5px' }}>Clarity: {sp.clarity}</div>
                                        <div style={{ marginTop: '5px' }}>Color: {sp.color}</div>
                                        <div style={{ marginTop: '5px' }}>Carat: {sp.carat} ct</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="info-section" style={{ position: 'absolute', right: '8%', top: '9%' }}>
                    <div className="product-header">
                        <p className="product-name">{product.productName}</p>
                        <button className="close-button" type="button" onClick={() => navigate(-1)}>
                            X
                        </button>
                    </div>
                    <p className="product-price">Price of the product: <span className="price-amount">{product.totalPrice} $</span></p>
                    <div className="product-description">
                        {/* <p className="description-title">Description</p>
                        <span>Model XMXMw000128 is designed with a youthful, pure white tone and is studded with luxurious ECZ stones.</span> */}
                    </div>
                    <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>
                        ADD
                    </button>
                </div>
            </div>
            <Modal
                title="Notification"
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal"
            >
                <div>{modalMessage}</div>
            </Modal>
            <style jsx>{`
                .detail-page {
                    display: flex;
                    flex-direction: column;
                    margin: 1% 5%;
                }

                .main-section {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }

                .image-info-section {
                    display: flex;
                    flex-direction: column;
                    margin-right: 20px;
                }

                .image-section {
                    display: flex;
                }

                .thumbnail-images {
                    display: flex;
                    flex-direction: column;
                    margin-right: 10px;
                }

                .thumbnail {
                    cursor: pointer;
                    max-width: 100px;
                    height: 100px;
                    border: 1px solid #000;
                    margin-bottom: 10px;
                }

                .main-image {
                    max-width: 350px;
                    height: 350px;
                }

                .info-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    max-width: 600px;
                }

                .product-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .product-name {
                    font-size: 30px;
                    font-weight: 500;
                }

                .close-button {
                    background: red;
                    border-radius: 100%;
                    width: 40px;
                    height: 40px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }

                .product-price {
                    font-size: 20px;
                    font-weight: bold;
                }

                .price-amount {
                    font-size: 45px;
                    color: red;
                    font-weight: bold;
                }

                .product-description {
                    margin: 10px 0;
                }

                .description-title {
                    font-weight: bold;
                }

                .product-size-quantity {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .product-size {
                    margin: 20px 0;
                }

                .size-title {
                    font-size: 20px;
                    font-weight: bold;
                }

                .size-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .size-button {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #000;
                    margin: 5px;
                    cursor: pointer;
                    background-color: white;
                    color: black;
                }

                .size-button.selected {
                    background-color: black;
                    color: white;
                }

                .available-stock {
                    margin-top: 10px;
                    font-size: 18px;
                }

                .product-quantity {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .quantity-title {
                    font-size: 20px;
                    font-weight: bold;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                }

                .quantity-button {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #000;
                    margin: 0 5px;
                    cursor: pointer;
                }

                .quantity-input {
                    width: 50px;
                    text-align: center;
                    border: 1px solid #000;
                }

                .add-to-cart-button {
                    background: red;
                    color: #fff;
                    font-size: 16px; /* Reduced font size */
                    padding: 5px 5px; /* Reduced padding */
                    border: none;
                    cursor: pointer;
                    margin-top: 10px;
                    border-radius: 5px; /* Add border radius for smoother look */
                }

                .product-information {
                    margin-top: 3px;
                }

                @media (max-width: 768px) {
                    .main-section {
                        flex-direction: column;
                        align-items: center;
                    }

                    .image-info-section {
                        align-items: center;
                    }

                    .image-section {
                        flex-direction: column;
                        align-items: center;
                    }

                    .thumbnail-images {
                        flex-direction: row;
                        margin-bottom: 10px;
                    }

                    .thumbnail {
                        margin-right: 10px;
                    }

                    .main-image {
                        margin-bottom: 20px;
                    }

                    .info-section {
                        align-items: center;
                        text-align: center;
                    }

                    .product-header {
                        flex-direction: column;
                        align-items: center;
                    }

                    .product-name {
                        margin-bottom: 10px;
                    }

                    .close-button {
                        margin-top: 10px;
                    }

                    .product-description, .product-size, .product-quantity {
                        text-align: center;
                    }

                    .product-size-quantity {
                        flex-direction: column;
                    }

                    .add-to-cart-button {
                        align-self: center;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .main-section {
                        flex-direction: column;
                        align-items: center;
                    }

                    .image-info-section {
                        align-items: center;
                    }

                    .image-section {
                        flex-direction: column;
                        align-items: center;
                    }

                    .thumbnail-images {
                        flex-direction: row;
                        margin-bottom: 10px;
                    }

                    .thumbnail {
                        margin-right: 10px;
                    }

                    .main-image {
                        margin-bottom: 20px;
                    }

                    .info-section {
                        align-items: center;
                        text-align: center;
                    }

                    .product-header {
                        flex-direction: column;
                        align-items: center;
                    }

                    .product-name {
                        margin-bottom: 10px;
                    }

                    .close-button {
                        margin-top: 10px;
                    }

                    .product-description, .product-size, .product-quantity {
                        text-align: center;
                    }

                    .product-size-quantity {
                        flex-direction: column;
                    }

                    .add-to-cart-button {
                        align-self: center;
                    }
                }
            `}</style>
        </div>
    );
}
