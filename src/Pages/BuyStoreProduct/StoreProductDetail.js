import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, notification } from 'antd';
import { adornicaServ } from '../../service/adornicaServ';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import "./StoreProductDetail.css";
import { useSelector } from 'react-redux';

export default function StoreProductDetail() {
    const [sp, setSp] = useState({});
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { orderCode } = useParams();
    const userInfo = useSelector((state) => state.userReducer.userInfo);
    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [goldPrices, setGoldPrices] = useState([]);
    const [gemPrices, setGemPrices] = useState([]);
    const [totalSelectedPrice, setTotalSelectedPrice] = useState(0);

    const [goldPromotion, setGoldPromotion] = useState(0);
    const [gemPromotion, setGemPromotion] = useState(0);

    useEffect(() => {
        adornicaServ.getAllCategoryBbp()
            .then((res) => {
                const diamondCategory = res.data.metadata.find(category => category.id === 6);
                if (diamondCategory) {
                    setGemPromotion(diamondCategory.buyBackPromotion);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        adornicaServ.getAllCategoryBbp()
            .then((res) => {
                const goldCategory = res.data.metadata.find(category => category.id === 5);
                if (goldCategory) {
                    setGoldPromotion(goldCategory.buyBackPromotion);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const totalPrice = selectedProducts.reduce((sum, product) => {
            const materialPrice = calculateMaterialBuyPrice(product) || 0;
            const gemPrice = calculateGemBuyPrice(product) || 0;
            return sum + materialPrice + gemPrice;
        }, 0);
        setTotalSelectedPrice(totalPrice);
    }, [selectedProducts, products]);

    useEffect(() => {
        adornicaServ.getPriceMaterial()
            .then((res) => {
                setGoldPrices(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        adornicaServ.getPriceDiamond()
            .then((res) => {
                setGemPrices(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        adornicaServ.getOrderDetail(orderCode)
            .then((res) => {
                const orderDetail = res.data.metadata;
                setSp(orderDetail);
                setProducts(orderDetail.list);
                const calculatedTotalPrice = orderDetail.list.reduce((sum, product) => sum + (product.price || 0), 0);
                setTotalPrice(calculatedTotalPrice);

                fetchProductDetails(orderDetail.list);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [orderCode]);

    const fetchProductDetails = (productsList) => {
        const promises = productsList.map(product =>
            adornicaServ.getDetailProductNotActive(product.productId)
                .then((res) => {
                    const detailedProduct = res.data.metadata;
                    const updatedProduct = {
                        ...product,
                        ...detailedProduct,
                        materialBuyPrice: calculateMaterialBuyPrice(detailedProduct),
                        gemBuyPrice: calculateGemBuyPrice(detailedProduct)
                    };
                    console.log('Product details for', product.productId, ':', updatedProduct);
                    return updatedProduct;
                })
                .catch((err) => {
                    console.error('Error fetching details for product', product.productId, ':', err);
                    return null;
                })
        );

        Promise.all(promises).then((detailedProducts) => {
            setProducts(detailedProducts.filter(p => p !== null)); // Update products with detailed information
        });
    };

    const calculateMaterialBuyPrice = (product) => {
        if (product.materials && product.materials.length > 0) {
            const material = product.materials[0]; // Assuming only one material for simplicity
            const materialBuyPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialBuyPrice || 0;
            const materialSellPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialSellPrice || 0;
            const materialPrice = (materialBuyPrice + (materialSellPrice - materialBuyPrice) * parseFloat(goldPromotion || 0)) * parseFloat(material.weight || 0);
            return materialPrice;
        }
        return 0;
    };

    const calculateMaterialPromotion = (product) => {
        if (product.materials && product.materials.length > 0) {
            const material = product.materials[0]; // Assuming only one material for simplicity
            const materialBuyPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialBuyPrice || 0;
            const materialSellPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialSellPrice || 0;
            const materialPrice = ( (materialSellPrice - materialBuyPrice) * parseFloat(goldPromotion || 0)) * parseFloat(material.weight || 0);
            return materialPrice;
        }
        return 0;
    };

    const calculateMaterialNonPromo = (product) => {
        if (product.materials && product.materials.length > 0) {
            const material = product.materials[0]; // Assuming only one material for simplicity
            const materialBuyPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialBuyPrice || 0;
            const materialSellPrice = goldPrices.find(gp => gp.materialId === material.id)?.materialSellPrice || 0;
            const materialPrice = (materialBuyPrice) * parseFloat(material.weight || 0);
            return materialPrice;
        }
        return 0;
    };

    const calculateGemBuyPrice = (product) => {
        if (product.gem && product.gem.length > 0) {
            const gem = product.gem[0]; // Assuming only one gem for simplicity
            const gemBuyPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemBuyPrice || 0;
            const gemSellPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemSellPrice || 0;
            const gemPrice = ((gemBuyPrice + (gemSellPrice - gemBuyPrice) * parseFloat(gemPromotion))) || 0;
            return gemPrice;
        }
        return 0;
    };

    const calculateGemPromotion = (product) => {
        if (product.gem && product.gem.length > 0) {
            const gem = product.gem[0]; // Assuming only one gem for simplicity
            const gemBuyPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemBuyPrice || 0;
            const gemSellPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemSellPrice || 0;
            const gemPrice = (( (gemSellPrice - gemBuyPrice) * parseFloat(gemPromotion))) || 0;
            return gemPrice;
        }
        return 0;
    };

    const calculateGemNonPromo = (product) => {
        if (product.gem && product.gem.length > 0) {
            const gem = product.gem[0]; // Assuming only one gem for simplicity
            const gemBuyPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemBuyPrice || 0;
            const gemSellPrice = gemPrices.find(gp => gp.gemId === gem.id)?.gemSellPrice || 0;
            const gemPrice = (gemBuyPrice) || 0;
            return gemPrice;
        }
        return 0;
    };

    const generateRandomOrderCode = () => {
        return 'SP' + Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedProducts.length === 0) {
            notification.error({
                message: 'Không có sản phẩm nào được chọn',
                description: 'Bạn cần chọn ít nhất một sản phẩm để mua.',
            });
            return;
        }

        const formData = {
            staffId: userInfo.id,
            purchaseOrderCode: generateRandomOrderCode(),
            customerName: sp?.customerName,
            phone: sp?.customerPhone,
            list: selectedProducts.map(product => ({
                name: product.productName,
                productCode: product.productCode,
                price: product.materialBuyPrice + product.gemBuyPrice,


                materialId: product.materials?.[0]?.id || "",
                weight: product.materials?.[0]?.weight || 0,
                color: product.gem?.[0]?.color || "NONE",
                clarity: product.gem?.[0]?.clarity || "NONE",
                cut: product.gem?.[0]?.cut || "NONE",
                origin: product.gem?.[0]?.origin || "NONE",
                carat: product.gem?.[0]?.carat || 0,

            })),
            totalPrice: totalSelectedPrice,
            productStore: true
        };

        console.log('SelectedProduct:', selectedProducts);

        console.log('Form Data Submitted:', formData);

        try {
            const response = await adornicaServ.postPurchaseOrderCode(formData);
            console.log('Order sent successfully:', response.data);
            setModalTitle('Thành công');
            setModalMessage(<center><i className="home-jewelry-check-icon fa-solid fa-circle-check" ></i><h1 style={{marginTop:'20px'}}>Đơn hàng đã được gửi thành công !</h1></center>);
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
                navigate('/buyProduct');
            }, 2000);
        } catch (error) {
            console.error('There was an error sending the order:', error);
            if (error.response) {
                console.error('Response data:', error.response);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            setModalTitle('Error');
            setModalMessage('Failed to send order. Please check your input data.');
            setModalVisible(true);
        }
    };

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prevSelectedProducts) => {
            const isSelectedProduct = prevSelectedProducts.find(p => p.productCode === product.productCode);
            if (isSelectedProduct) {
                console.log(isSelectedProduct);
                return prevSelectedProducts.filter(p => p.productCode !== product.productCode);
            } else {
                const updatedProduct = {
                    ...product,

                    materialId: product.materials?.[0]?.id || "",
                    weight: product.materials?.[0]?.weight || 0,
                    color: product.gem?.[0]?.color || "NONE",
                    clarity: product.gem?.[0]?.clarity || "NONE",
                    cut: product.gem?.[0]?.cut || "NONE",
                    origin: product.gem?.[0]?.origin || "NONE",
                    carat: product.gem?.[0]?.carat || 0,

                    materialBuyPrice: calculateMaterialBuyPrice(product),
                    gemBuyPrice: calculateGemBuyPrice(product)
                };
                return [...prevSelectedProducts, updatedProduct];
            }
        });
    };

    const columnsProductInBill = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${formatPrice(text)} `,
        },
        {
            title: 'Lựa chọn',
            dataIndex: 'choose',
            key: 'choose',
            render: (_, record) => (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <input
                        type='checkbox'
                        style={{ width: '20px', height: '20px' }}
                        checked={selectedProducts.some(p => p.productCode === record.productCode)}
                        onChange={() => handleCheckboxChange(record)}
                    />
                </div>
            ),
        },
    ];

    const getPaid = (role) => {
        switch (role) {
          case 'CASH':
            return 'Tiền Mặt';
          case 'CREDIT':
            return 'VNPAY';
          case 'NONE':
            return 'Chưa Chọn Hình Thức';
          // Add more cases as needed
          default:
            return role;
        }
      };

    const buyBackItem = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Giá thu mua vật liệu',
            dataIndex: 'goldNonPromo',
            key: 'goldNonPromo',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatPrice(record.goldNonPromo)}</span>
                </div>
            ),
        },
        {
            title: 'Giá vàng khuyến mãi',
            dataIndex: 'goldPromoPrice',
            key: 'goldPromoPrice',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatPrice(record.goldPromoPrice)}</span>
                </div>
            ),
        },
        {
            title: 'Giá mua đá quý',
            dataIndex: 'gemNonPromo',
            key: 'gemNonPromo',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatPrice(record.gemNonPromo)}</span>
                </div>
            ),
        },
        {
            title: 'Giá khuyến mãi của đá quý',
            dataIndex: 'gemPromoPrice',
            key: 'gemPromoPrice',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatPrice(record.gemPromoPrice)}</span>
                </div>
            ),
        },
        {
            title: 'Tổng',
            dataIndex: 'total',
            key: 'total',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{`${formatPrice((record.materialBuyPrice + record.gemBuyPrice)) || 0} `}</span>
                </div>
            ),
        },
        {
            title: 'Xóa',
            dataIndex: 'remove',
            key: 'remove',
            render: (_, record) => (
                <div>
                    <Button type='primary' danger onClick={() => handleCheckboxChange(record)}>Xóa</Button>
                </div>
            ),
        },
    ];


    const dateSellFormatted = sp?.dateSell ? new Date(sp.dateSell).toLocaleDateString() : '';

    return (
        <div className='storeProductDetail'>
            <div className='title'>
                <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '500', margin: '10px 0 2px 0' }}>Mã Đơn Hàng: {sp?.orderCode}</h1>
                <div style={{ backgroundColor: 'black', width: '96%', height: '1px', marginLeft: '22px' }}></div>
            </div>
            <div className="container overflow-auto bg-white mt-2" style={{ width: '94%', boxShadow: 'rgba(0, 0, 0, 0.24) 3px 3px 3px', borderRadius: '20px' }}>
                <div
                style={{
                    display:'flex',
                    justifyContent:'center  '
                }}
                className="row justify-around bg-white pb-2">
                    <div className="product__table col-sm-11"
                        style={{
                            backgroundColor: 'white',
                            marginLeft: '16px',
                            width: '100%',
                            height: '400px',
                            padding: '0',
                        }}>
                        <div className='col-sm-1s'>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 0%' }}>
                                    Khách hàng : <span style={{ marginLeft: '4%' }}>{sp?.customerName}</span>
                                </h1>
                            </div>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 0%' }}>
                                    Số điện thoại : <span style={{ marginLeft: '4%' }}>{sp?.customerPhone}</span>
                                </h1>
                            </div>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 10px 0%' }}>
                                    Ngày : <span style={{ marginLeft: '4%' }}>{dateSellFormatted}</span>
                                </h1>
                            </div>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 0%' }}>
                                    Phương thức thanh toán : <span style={{ marginLeft: '4%' }}>{getPaid(sp?.paymentMethod)}</span>
                                </h1>
                            </div>
                        </div>
                        <Table style={{ width: '94%', border: '1px solid #ccc', }} dataSource={products} columns={columnsProductInBill} pagination={false} scroll={{ y: 120 }} />
                        <div className='col-sm-1' >
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                    Tổng sản phẩm : <span style={{ marginLeft: '4%' }}> {sp?.list ? sp.list.length : 0}</span>
                                </h1>
                            </div>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                    Tổng tiền : <span style={{ marginLeft: '4%' }}> {formatPrice(totalPrice)} </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='cart__table col-sm-11'
                        style={{
                            marginRight: '-24px',
                            backgroundColor: 'white',
                            width: '100%',
                            height: '400px',
                            padding: '0',
                        }}>
                        <div className='col-sm-12 mt-2'><h1>Sản phẩm thu mua</h1></div>
                        <Table style={{ width: '100%', border: '1px solid #ccc', }} dataSource={selectedProducts.map(product => ({
                            ...product,
                            goldPromoPrice: calculateMaterialPromotion(product),
                            goldNonPromo: calculateMaterialNonPromo(product),
                            materialBuyPrice: calculateMaterialBuyPrice(product),

                            gemPromoPrice: calculateGemPromotion(product),
                            gemNonPromo: calculateGemNonPromo(product),
                            gemBuyPrice: calculateGemBuyPrice(product)
                        }))} columns={buyBackItem} pagination={false} scroll={{ y: 168 }} />
                        <div className='col-sm-1' >
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                    Tổng sản phẩm:<span style={{ marginLeft: '4%' }}> {selectedProducts.length}</span>
                                </h1>
                            </div>
                            <div className="col-sm-12" style={{ whiteSpace: 'nowrap' }}>
                                <h1 style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0px 6px 11%' }}>
                                    Tổng tiền thu mua:<span style={{ marginLeft: '4%' }}> {formatPrice(totalSelectedPrice)} </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 flex justify-center mt-1">
                        <NavLink to={"/buyProduct"}>
                            <Button
                                style={{ padding: '0 56px 0 56px' }}
                                size="large"
                                danger
                            >Trở về</Button>
                        </NavLink>
                        <Button
                            size="large"
                            htmlType='submit'
                            onClick={handleSubmit}
                            style={{ padding: '0 46px', marginLeft: '50px' }}
                        >Thu mua</Button>
                    </div>
                </div>
            </div>
            <Modal
                title={<center><h1>{modalTitle}</h1></center>}
                visible={modalVisible}
                footer={null}
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
}