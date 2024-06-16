import {https} from "./config"

export const adornicaServ = {
    getDetailProduct: (productCode) => {
        return https.get(`/api/v1/products/${productCode}`);
    },

    getOrderDetail: (orderCode) => {
        console.log(orderCode)
        return https.get(`/api/v1/orders/order/detail/${orderCode}`);
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
        return https.post(`/api/v1/orders/order`, orderData);
    },

    getListOrderByStaffID: (staffID) => {
        return https.get(`/api/v1/orders/order/${staffID}`);
    },

    getListOrderDetail: (orderKey) => {
        console.log(orderKey)
        return https.get(`/api/v1/orders/order/detail/${orderKey}`);
    },

    getPhoneCustomer: (phone) => {
        console.log(phone)
        return https.post(`/api/v1/customers/${phone}`);
    },

    postOrderCode: (phone, orderCode) => {
        const data = {
          phone: phone,
          orderCode: orderCode
        };
        return https.post(`/api/v1/purchases/validate-order`, data);
    },
    
    postPaidSummit: (orderData) => {
        console.log(orderData)
        return https.post(`/api/v1/orders/payment`, orderData);
    },

    postCustomerPhone: (phoneData) => {
        console.log(phoneData)
        return https.post(`/api/v1/customers/${phoneData}`);
    },

    postPurchaseOrderCode: (purchaseOrderCode) => {
        return https.post(`/api/v1/purchases/create`, purchaseOrderCode);
    },

    deletePreOrder: (OrderCode) => {
        return https.delete(`/api/v1/orders/order/delete/${OrderCode}`);
    },

    
    updatePreOrder: (orderData) => {
        return https.put(`/api/v1/orders/order/update`, orderData);
    },


    getHistoryOrders: () => {
        return https.get(`/api/v1/orders/order/history`);
    },

    getPriceMaterial: () => {
        return https.get(`/api/v1/prices/materials`);
    },

    getDiamondPrice: () => {
        return https.get(`/api/v1/prices/gems`);
    },

    postUpdateDeliveryOrder: (orderID) => {
        console.log(orderID)
        return https.post(`/api/v1/orders/delivery/${orderID}`);

    },

    getPurchaseDiamondPrice: (cut, carat, clarity, color, origin) => {
        return https.get(`/api/v1/purchases/prices?cut=${cut}&carat=${carat}&clarity=${clarity}&color=${color}&origin=${origin}`);
    },
    
    getCustomerDetails: () => {
        return https.get(`/api/v1/customers`);
    },
    getEmployee: () => {
        return https.get(`/api/v1/users/staff`);
    },
    getViewEmployee: (staffId) => {
        console.log(staffId)
        return https.get(`/api/v1/users/staff/{id}?id=${staffId}`);
    },
    getProfile: () => {
        return https.get(`/api/v1/users/profile`);
    },
}
