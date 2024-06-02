import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal } from 'antd';
import { NavLink, useParams } from 'react-router-dom';

export default function DetailPage() {
    const [product, setProduct] = useState({});
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImageSrc, setMainImageSrc] = useState('https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png');
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
        setSelectedSize(size);
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
        if (selectedSize) {
            const selectedProduct = product.sizeProducts.find(sp => sp.size === selectedSize);
            const item = {
                productCode,
                name: product.productName,
                size: selectedSize,
                quantity,
                price: product.productionCost,
                totalPrice: quantity * product.productionCost
            };

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
        } else {
            alert('Please select a size');
        }
    };

    const selectedProduct = selectedSize ? product.sizeProducts?.find(sp => sp.size === selectedSize) : null;

    return (
        <div style={{ display: 'flex', height: '50vh', marginTop: '1%', marginLeft: '5%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ maxWidth: '1300px', display: 'flex' }}>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <img
                                    style={{ cursor: 'pointer', maxWidth: '100px', height: '100px', marginBottom: '20px', border: '1px solid #000', marginTop: '20px' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png"
                                    alt="h1"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png")}
                                />
                                <img
                                    style={{ cursor: 'pointer', maxWidth: '100px', height: '100px', border: '1px solid #000', marginBottom: '20px' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-2.png"
                                    alt="h2"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-2.png")}
                                />
                                <img
                                    style={{ cursor: 'pointer', maxWidth: '100px', height: '100px', border: '1px solid #000' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-3.png"
                                    alt="h3"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-3.png")}
                                />
                            </div>
                            <img
                                style={{ maxWidth: '350px', height: '350px', marginLeft: '30px' }}
                                src={mainImageSrc}
                                alt="Main product image"
                            />
                        </div>
                        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
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
                                    <div style={{ cursor: 'pointer', color: 'blue' }} onClick={showModal}>Gem: {product.gemName}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '250px' }}>
                            <p style={{ fontSize: '35px', fontWeight: '500', marginBottom: '5%' }}>{product.productName}</p>
                            
                                <NavLink to='/homePage'>
                                <button style={{ background: 'red', borderRadius: '100%', width: '40px', height: '40px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} type="button">
                                    X
                                </button>
                                </NavLink>
                            
                        </div>
                        <div style={{ marginLeft: '100px' }}>
                            <div style={{ display: 'flex', marginBottom: '15px' }}>
                                <p style={{ fontSize: '23px', fontWeight: 'bold', marginRight: '50px' }}>Price of the product:</p>
                                <h1 style={{ fontSize: '45px', color: 'red', fontWeight: 'bold' }}>{product.productionCost} $</h1>
                            </div>
                            <div style={{ fontSize: '23px', marginBottom: '10px' }}>
                                <p style={{ fontWeight: 'bold' }}>Description</p>
                                <span>Model XMXMw000128 is designed with a youthful, pure white tone and is studded with luxurious ECZ stones.</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '23px', fontWeight: 'bold', marginTop: '0px' }}>Size</p>
                                <div style={{ fontSize: '15px', display: 'flex', alignItems: 'center', marginLeft: '170px' }}>
                                    {product.sizeProducts?.map((sp) => (
                                        <button
                                            key={sp.id}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: '1px solid #000',
                                                margin: '0 5px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedSize === sp.size ? 'lightblue' : 'white',
                                            }}
                                            onClick={() => handleSizeClick(sp.size)}
                                        >
                                            {sp.size}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize !== null && (
                                    <div style={{ marginTop: '20px', fontSize: '18px', marginLeft: '170px' }}>
                                        <p>Available Stock for Size: {selectedProduct?.diameter}</p>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                    <p style={{ fontSize: '23px', fontWeight: 'bold', marginRight: '75px' }}>Quantity</p>
                                    <button
                                        style={{ width: '30px', height: '30px', border: '1px solid #000', margin: '0 5px', cursor: 'pointer' }}
                                        onClick={() => handleQuantityChange(-1)}
                                    >
                                        -
                                    </button>
                                    <input type="text" value={quantity} style={{ width: '50px', textAlign: 'center' }} readOnly />
                                    <button
                                        style={{ width: '30px', height: '30px', border: '1px solid #000', margin: '0 5px', cursor: 'pointer' }}
                                        onClick={() => handleQuantityChange(1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button style={{ background: 'red', color: '#fff', fontSize: '20px', padding: '10px 50px', border: 'none', cursor: 'pointer', marginTop: '30px', marginLeft: '175px' }} type="button" onClick={handleAddToCart}>
                                ADD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
}
