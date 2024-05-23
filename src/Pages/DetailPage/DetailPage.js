import React, { useEffect, useState } from 'react'
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
            })
    }, [])
    return (
        <div>
            <div>
                <p
                    style={{
                        fontSize: '38px',
                        fontWeight: '600',
                        marginLeft: '100px',
                        marginTop: '10px'
                    }}
                >
                    {sanPham.productName}
                </p>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <div>
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                background: 'red'
                            }}
                            src="" alt="h1" />
                        <img src="" alt="h2" />
                        <img src="" alt="h3" />
                    </div>
                    <img src="" alt="h4" />
                </div>
                <div
                    style={{
                        marginLeft: '30px',
                        marginTop: '10px'
                    }}
                >
                    <span>ee</span>
                    <span
                        style={{
                            fontSize: '22px',
                            marginLeft: '5px'
                        }}
                    >Product</span>
                </div>
                <div>
                    <div>
                        {/* <span>ID: {sanPham.productCode}</span>
                        <span>Gender: {sanPham.gender}</span>
                        <span>Category: {sanPham.category}</span> */}
                    </div>
                    <div>
                        {/* <span>Weight: {sanPham.gem.weight}</span>
                        <span>Material: {sanPham.materials}</span>
                        <span>Gem: {sanPham.gem.gemName}</span> */}
                    </div>
                </div>
            </div>
            <div>
                <button>X</button>
                <p>Price of the product</p>
                <h1
                    style={{
                        color: 'red',
                        fontSize: '40px'
                    }}
                >
                    7000
                </h1>
                <p>Description</p>
                <span>sdfsdffs</span>
                <p>Size</p>
                
            </div>
        </div>
    )
}
