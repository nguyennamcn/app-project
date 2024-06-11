import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal } from 'antd';
import { NavLink, useParams } from 'react-router-dom';

export default function DetailPage() {
    const [product, setProduct] = useState({});
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [mainImageSrc, setMainImageSrc] = useState("https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/white/Photoroom_white_background_extremely_fine_texture_only_white_co_d4046f3b-0a21-404a-891e-3f8d37c5aa94.jpg");
    const [quantity, setQuantity] = useState(1);
    const { productCode } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleSizeClick = (size) => {
        const selectedProduct = product.sizeProducts.find(sp => sp.size === size);
        setSelectedSize(size);
        setSelectedId(selectedProduct ? selectedProduct.id : null);
        setQuantity(1); // Reset quantity when a new size is selected
    };

    const handleImageClick = (newSrc) => {
        setMainImageSrc(newSrc);
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            const availableStock = selectedProduct ? selectedProduct.diameter : Infinity;
            return newQuantity > 0 && newQuantity <= availableStock ? newQuantity : prevQuantity;
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleAddToCart = () => {
        const selectedProduct = product.sizeProducts.find(sp => sp.size === selectedSize);
        const item = {
            productId: product.id,
            productCode: product.productCode,
            name: product.productName,
            size: selectedSize,
            sizeId: selectedId,
            quantity,
            price: product.totalPrice,
            totalPrice: quantity * product.totalPrice
        };
        console.log(item);
        // Get existing cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the item is already in the cart
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productCode === item.productCode && cartItem.size === item.size);

        if (existingItemIndex > -1) {
            // Update the quantity if the item exists
            cartItems[existingItemIndex].quantity += item.quantity;
            cartItems[existingItemIndex].totalPrice += item.totalPrice;
        } else {
            // Add new item to the cart
            cartItems.push(item);
        }

        // Save updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        alert('Added to cart');
    };

    const selectedProduct = selectedSize ? product.sizeProducts?.find(sp => sp.size === selectedSize) : null;

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
                                <div>ID: {product.id}</div>
                                <div>Gender: {product.gender}</div>
                                <div>Category: {product.category}</div>
                            </div>
                            <div style={{ fontSize: '15px' }}>
                                {product.materials?.map((mt, index) => (
                                    <div key={index}>
                                        <h1>{mt.name}</h1>
                                    </div>
                                ))}
                                <div style={{ cursor: 'pointer', color: 'blue' }} onClick={showModal}>Gem:</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="info-section" style={{position: 'absolute', right:'8%', top:'9%'}}>
                    <div className="product-header">
                        <p className="product-name">{product.productName}</p>
                        <NavLink to='/homePage'>
                            <button className="close-button" type="button">
                                X
                            </button>
                        </NavLink>
                    </div>
                    <p className="product-price">Price of the product: <span className="price-amount">{product.totalPrice} $</span></p>
                    <div className="product-description">
                        <p className="description-title">Description</p>
                        <span>Model XMXMw000128 is designed with a youthful, pure white tone and is studded with luxurious ECZ stones.</span>
                    </div>
                    <div className="product-size-quantity">
                        <div className="product-size">
                            <p className="size-title">Size</p>
                            <div className="size-buttons">
                                {product.sizeProducts?.map((sp) => (
                                    <button
                                        key={sp.id}
                                        className={`size-button ${selectedSize === sp.size ? 'selected' : ''}`}
                                        onClick={() => handleSizeClick(sp.size)}
                                    >
                                        {sp.size}
                                    </button>
                                ))}
                            </div>
                            {selectedSize !== null && (
                                <p className="available-stock">Available Stock for Size: {selectedProduct?.diameter}</p>
                            )}
                        </div>
                       
                    </div>
                     <div className="product-quantity">
                            <p className="quantity-title">Quantity</p>
                            <div className="quantity-controls">
                                <button className="quantity-button" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="text" value={quantity} className="quantity-input" readOnly />
                                <button className="quantity-button" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>
                        <NavLink to='/homePage'>
                        <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>
                            ADD
                        </button>
                    </NavLink>
                </div>
            </div>
            <Modal title="Gem Detail" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {product.gem?.map((sp, index) => (
                    <div key={index}>
                        <h1 style={{ marginTop: '5px' }}>Name: {sp.gemName}</h1>
                        <h1 style={{ marginTop: '5px' }}>Clarity: {sp.clarity}</h1>
                        <h1 style={{ marginTop: '5px' }}>Color: {sp.color}</h1>
                        <h1 style={{ marginTop: '5px' }}>Carat: {sp.weight}</h1>
                    </div>
                ))}
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
                    font-size: 20px;
                    padding: 10px 50px;
                    border: none;
                    cursor: pointer;
                    margin-top: 30px;
                }

                .product-information {
                    margin-top: 20px;
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