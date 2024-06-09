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
        return https.post(`/api/v1/orders/pre-order-products`, orderData);
    },

    getListOrder: () => {
        return https.get(`/api/v1/orders/key-pre-order`);
    },

    getListOrderDetail: (orderKey) => {
        return https.get(`/api/v1/orders/pre-order-product/${orderKey}`);
    },

    postOrderCode: (phone, orderCode) => {
        const data = {
          phone: phone,
          orderCode: orderCode
        };
        return https.post(`/api/v1/purchases/validate-order`, data);
    },
    
    postSummit: (orderData) => {
        console.log(orderData)
        return https.post(`/api/v1/orders/order-product`, orderData);
    },

    postCustomerPhone: (phoneData) => {
        console.log(phoneData)
        return https.post(`/api/v1/customers/${phoneData}`);
    },

    postPurchaseOrderCode: (purchaseOrderCode) => {
        return https.post(`/api/v1/purchases/create`, purchaseOrderCode);
    },

    deletePreOrder: (OrderCode) => {
        return https.delete(`/api/v1/orders/pre-order/${OrderCode}`);
    },

    
    updatePreOrder: (orderData) => {
        return https.put(`/api/v1/orders/pre-order?key=${orderData.keyProOrder}`, orderData);
    },


    getHistoryOrders: () => {
        return https.get(`/api/v1/orders/all-history-orders`);
    },

    getPriceMaterial: () => {
        return https.get(`/api/v1/prices/materials`);
    },

    postUpdateDeliveryOrder: (orderID) => {
        console.log(orderID)
        return https.post(`/api/v1/orders/delivery/${orderID}`);
    },
}
