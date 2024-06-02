import {https} from "./config"

export const adornicaServ = {
    getDetailProduct: (productCode) => {
        return https.get(`/api/v1/products/${productCode}`);
    },

    getListGold: () => {
        return https.get(`/api/v1/products?categoryType=GOLD`);
    },

    getListDiamond: () => {
        return https.get(`/api/v1/products?categoryType=DIAMOND`);
    },

    getListJewelry: () => {
        return https.get(`/api/v1/products?categoryType=JEWELRY`);
    },

    postOrder: (orderData) => {
        console.log(orderData)
        return https.post(`/api/v1/orders/pre-order-product`, orderData);
    },

    getListOrder: () => {
        return https.get(`/api/v1/orders/get-key-pre-order`);
    },

    getListOrderDetail: (orderKey) => {
        console.log(orderKey)
        return https.get(`/api/v1/orders/get-pre-order-product/${orderKey}`);
    },
}
