import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Modal } from 'antd';

export default function DetailPage() {
    const [product, setProduct] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImageSrc, setMainImageSrc] = useState('https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png');
    const [stock, setStock] = useState({
        12: 10,
        13: 15,
        14: 20,
        15: 5,
        16: 8,
        17: 12,
        18: 7,
        19: 3,
        20: 9,
        21: 6,
    });
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        adornicaServ.getDetailProduct()
            .then((res) => {
                setProduct(res.data.content);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const handleImageClick = (newSrc) => {
        setMainImageSrc(newSrc);
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            return newQuantity > 0 ? newQuantity : 1;
        });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ display: 'flex', height: '50vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '1300px', display: 'flex' }}>
                    <div>
                        <div style={{
                            display: 'flex'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', }}>
                                <img
                                    style={{ cursor: 'pointer', width: '100px', height: '100px', marginBottom: '20px', border: '1px solid #000', marginTop: '20px' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png"
                                    alt="h1"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-1.png")}
                                />
                                <img
                                    style={{ cursor: 'pointer', width: '100px', height: '100px', border: '1px solid #000', marginBottom: '20px' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-2.png"
                                    alt="h2"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-2.png")}
                                />
                                <img
                                    style={{ cursor: 'pointer', width: '100px', height: '100px', border: '1px solid #000' }}
                                    src="https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-3.png"
                                    alt="h3"
                                    onClick={() => handleImageClick("https://cdn.pnj.io/images/detailed/189/sp-gn0000y002531-nhan-vang-24k-pnj-3.png")}
                                />
                            </div>
                            {/* Main Image */}
                            <img
                                style={{ width: '350px', height: '350px', marginLeft: '30px' }}
                                src={mainImageSrc}
                                alt="Main product image"
                            />
                        </div>
                        {/* Product Information */}
                        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
                            <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Product information</span>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ fontSize: '15px', marginRight: '150px' }}>
                                    <div>ID: {product.id}</div>
                                    <div>Gender: {product.gender}</div>
                                    <div>Category: {product.category}</div>
                                </div>
                                <div style={{ fontSize: '15px' }}>
                                    <div>Weight: 140g</div>
                                    <div>Material: đang làm</div>
                                    <div style={{
                                        cursor: 'pointer',
                                        color: 'blue'
                                    }} onClick={showModal} >Gem: {product.gemName}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {/* Title with Close Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '250px' }}>
                            <p style={{ fontSize: '35px', fontWeight: '500', marginBottom: '5%' }}>White gold rings 12057</p>
                            <button style={{ background: 'red', borderRadius: '100%', width: '40px', height: '40px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                X
                            </button>
                        </div>
                        {/* Description and Pricing Details */}
                        <div style={{ marginLeft: '100px' }}>
                            <div style={{ display: 'flex', marginBottom: '15px' }}>
                                <p style={{ fontSize: '23px', fontWeight: 'bold', marginRight: '50px' }}>Price of the product:</p>
                                <h1 style={{ fontSize: '45px', color: 'red', fontWeight: 'bold' }}>{product.productionCost} $</h1>
                            </div>
                            <div style={{ fontSize: '23px', marginBottom: '10px' }}>
                                <p style={{ fontWeight: 'bold', }}>Description</p>
                                <span>Model XMXMw000128 is designed with a youthful, pure white tone and is studded with luxurious ECZ stones.</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '23px', fontWeight: 'bold', marginTop: '0px' }}>Size</p>
                                <div style={{ fontSize: '15px', display: 'flex', alignItems: 'center', marginLeft: '170px' }}>
                                    {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(size => (
                                        <button
                                            key={size}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: '1px solid #000',
                                                margin: '0 5px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedSize === size ? 'lightblue' : 'white',
                                            }}
                                            onClick={() => handleSizeClick(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize !== null && (
                                    <div style={{ marginTop: '20px', fontSize: '18px', marginLeft: '170px' }}>
                                        <p>Available Stock for Size {selectedSize}: {stock[selectedSize]}</p>
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
                            <button style={{ background: 'red', color: '#fff', fontSize: '20px', padding: '10px 50px', border: 'none', cursor: 'pointer', marginTop: '30px', marginLeft: '175px' }}>ADD</button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right side: Description and Price */}
            {/* < style={{ flex: 1 }}>
                {/* Title with Close Button */}

            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
}
