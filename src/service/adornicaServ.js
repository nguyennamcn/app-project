import {https} from "./config"

export const adornicaServ = {
    getDetailProduct: (productCode) => {
        console.log(productCode)
        return https.get(`/api/v1/products/${productCode}`);
    },

    getOrderDetail: (orderCode) => {
        console.log(orderCode)
        return https.get(`/api/v1/orders/detail/${orderCode}`);
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
        console.log(staffID)
        return https.get(`/api/v1/orders/order/${staffID}`);
    },

    getListOrderDetail: (orderKey) => {
        console.log(orderKey)
        return https.get(`/api/v1/orders/detail/${orderKey}`);
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
        return https.post(`/api/v1/purchases/validate`, data);
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

    deletePurchaseOrder: (OrderCode) => {
        return https.delete(`/api/v1/purchases/order/${OrderCode}`);
    },

    deletePreOrder: (OrderCode) => {
        return https.delete(`/api/v1/orders/order/delete/${OrderCode}`);
    },

    
    updatePreOrder: (orderData) => {
        console.log(orderData)
        return https.put(`/api/v1/orders/order/update`, orderData);
    },

    updateProduct: (code , orderData) => {
        console.log(code , orderData)
        return https.put(`/api/v1/products/update/${code}`, orderData);
    },

    getDetailPurchase: (OrderCode) => {
        console.log(OrderCode)
        return https.get(`/api/v1/orders/order/detail/${OrderCode}`);
    },

    getHistoryOrders: () => {
        return https.get(`/api/v1/orders/order/history`);
    },

    getPurchaseHistoryOrders: () => {
        return https.get(`/api/v1/purchases/all`);
    },

    getPriceMaterial: () => {
        return https.get(`/api/v1/prices/materials`);
    },
    getPriceDiamond: () => {
        return https.get(`/api/v1/prices/gems`);
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

    getViewStaff: (id) => {
        console.log(id)
        return https.get(`/api/v1/users/profile/${id}`);
    },
    getProfile: (id) => {
        console.log(id)
        return https.get(`/api/v1/users/profile/${id}`);
    },

    updateRole: (data) => {
        console.log(data)
        return https.put(`/api/v1/users/staff/change-role`, data);
    },

    delectAccount: (id) => {
        console.log(id)
        return https.delete(`/api/v1/users/delete/${id}`);
    },

    deleteProduct: (id) => {
        console.log(id)
        return https.delete(`/api/v1/products/delete/${id}`);
    },

    postImg: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        return https.put(`/api/v1/users/update-avatar/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      postProductImg: (id, file1, file2, file3, file4) => {
        const formData = new FormData();
        formData.append('image1', file1);
        formData.append('image2', file2);
        formData.append('image3', file3);
        formData.append('image4', file4);
      
        return https.post(`/api/v1/products/add-images/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },


    postUserUpdate: (id, data) => {
        console.log(id, data)
        return https.put(`/api/v1/users/update/${id}`, data);
    },

    postExport: (orderKey) => {
        console.log(orderKey);
        return https.post(`/api/v1/orders/export-pdf/${orderKey}`, {}, {
            responseType: 'blob'
        });
    },

    postPurchaseExport: (orderKey) => {
        console.log(orderKey);
        return https.post(`/api/v1/purchases/export-pdf/${orderKey}`, {}, {
            responseType: 'blob'
        });
    },

    getListOrderPurchase: (orderCode) => {
        console.log(orderCode)
        return https.get(`/api/v1/purchases/${orderCode}`);
    },

    postPayment: (data) => {
        console.log(data)
        return https.post(`/api/v1/purchases/payment`, data);
    },

    postCreateProduct: (data) => {
        console.log(data)
        return https.post(`/api/v1/products/create`, data);
    },

    getTotalYesterday: () => {
        return https.get(`/api/v1/dashboard/yesterday`);
    },
    getTotalToday: () => {
        return https.get(`/api/v1/dashboard/today`);
    },
    getTotalThisMonth: () => {
        return https.get(`/api/v1/dashboard/this-month`);
    },
    getTotalLastMonth: () => {
        return https.get(`/api/v1/dashboard/last-month`);
    },
    getMostStaff: () => {
        return https.get(`/api/v1/dashboard/staff-create-most-orders`);
    },
    getCategoryType: () => {
        return https.get(`/api/v1/dashboard/category-type-most-orders`);
    },

    postNewEmployee: (form) => {
        console.log(form)
        return https.post(`/api/v1/users/create`, form);
    },
}
