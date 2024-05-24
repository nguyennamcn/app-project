import React, { useEffect, useState } from 'react';
import { adornicaServ } from '../../service/adornicaServ';

const onChange = (key) => {
    console.log(key);
};
const items = [
    {
        key: '1',
        label: `Tab 1`,
        children: `Content of Tab Pane 1`,
    },
];

export default function DetailPage() {
    const [sanPham, setSanPham] = useState([]);

    useEffect(() => {
        adornicaServ.getDetailProduct()
            .then((res) => {
                setSanPham(res.data.content);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div style={{ display: 'flex', marginTop: '10px', marginLeft:'70px' }}>
            {/* Left side: Images and Product Information */}
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                {/* Images Container */}
                <div style={{ display: 'flex' }}>
                    {/* Image Thumbnails */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                marginBottom: '20px',
                                border: '1px solid #000',
                                marginTop: '20px',
                            }}
                            src="https://cdn.pnj.io/images/detailed/206/on-gnddddw060595-nhan-kim-cuong-vang-trang-kim-cuong-pnj-1.jpg" alt="h1" />
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid #000',
                                marginBottom: '20px',
                            }}
                            src="https://cdn.pnj.io/images/detailed/205/sp-gnddddw060595-nhan-kim-cuong-vang-trang-kim-cuong-pnj-2.png" alt="h2" />
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid #000',
                            }}
                            src="https://cdn.pnj.io/images/detailed/205/sp-gnddddw060595-nhan-kim-cuong-vang-trang-kim-cuong-pnj-3.png" alt="h3" />
                    </div>
                    {/* Main Image */}
                    <img
                        style={{
                            width: '400px',
                            height: '400px',
                        }}
                        src="https://cdn.pnj.io/images/detailed/205/sp-gnddddw060595-nhan-kim-cuong-vang-trang-kim-cuong-pnj-1.png" alt="h4" />
                </div>
                {/* Product Information */}
                <div style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Product information</span>
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <div style={{ marginRight: '130px',fontSize:'20px' }}>
                            <div>ID: 120576</div>
                            <div>Gender: Female</div>
                            <div>Category: Ring</div>
                        </div>
                        <div style={{fontSize:'20px'}}>
                            <div>Weight: 140g</div>
                            <div>Material: White gold</div>
                            <div>Gem: Natural diamonds</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Description and Price */}
            <div style={{ flex: 1, marginLeft: '20px' }}>
                {/* Title with Close Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '40px', fontWeight: '500', marginLeft: '50px',marginBottom:'30px' }}>White gold rings 12057</p>
                    <button style={{    border: 'none', background: 'red', fontSize: '20px', fontWeight: 'bold', 
                                        cursor: 'pointer' ,marginRight:'150px',marginBottom:'30px',
                                        border: '1px solid #000',
                                        padding: '2px 5px',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        color : 'white'}}>X</button>
                </div>
                {/* Description and Pricing Details */}
                <div style={{marginLeft:'50px'}}>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom:'15px' }}>Price of the product:</p>
                    <h1 style={{ color: 'red', fontSize: '50px', marginBottom:'15px' }}>1900,37 $</h1>
                    <p style={{ fontSize: '20px', fontWeight: 'bold',marginBottom:'15px' }}>Description</p>
                    <span style={{ fontSize: '20px' ,marginBottom:'20px' }}>Model XMXMw000128 is designed with a youthful, pure white tone and is studded with luxurious ECZ stones.</span>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Size</p>
                    <div style={{ display: 'flex', alignItems: 'center' ,marginLeft:'170px'}}>
                        {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(size => (
                            <button key={size} style={{ width: '30px', height: '30px', border: '1px solid #000', margin: '0 5px', cursor: 'pointer' }}>{size}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '200px' }}>Quantity</p>
                        <button style={{ width: '30px', height: '30px', border: '1px solid #000', margin: '0 5px', cursor: 'pointer' }}>-</button>
                        <input type="text" value="1" style={{ width: '50px', textAlign: 'center' }} readOnly />
                        <button style={{ width: '30px', height: '30px', border: '1px solid #000', margin: '0 5px', cursor: 'pointer' }}>+</button>
                    </div>
                    <button style={{ background: 'red', color: '#fff', fontSize: '20px', padding: '10px 50px', border: 'none', cursor: 'pointer', marginTop: '30px', marginLeft:'280px' }}>ADD</button>
                </div>
            </div>
        </div>
    );
}


