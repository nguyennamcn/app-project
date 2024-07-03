import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from './redux/action/userAction';

import Layout from './Layout/Layout';
import LoginPage from './Pages/LoginPage/LoginPage';
import ListProduct from './Pages/DetailPage/ListProduct';
import Feedbacks from './Pages/Feedbacks/Feedbacks';
import DetailPage from './Pages/DetailPage/DetailPage';
import BuyListProduct from './Pages/BuyJewelry/BuyListProduct';
import CashierListOrder from './Pages/CashierPage/CashierListOrder';
import CashierOrderDetail from './Pages/CashierPage/CashierOrderDetail';
import CartPage from './Pages/CartPage/CartPage';
import DetailOrderSended from './Pages/ListOrderSended/DetialOrderSended';
import SentPagee from './Pages/ListOrderSended/SentPage';
import StoreProductDetail from './Pages/BuyStoreProduct/StoreProductDetail';
import CashierDelivered from './Pages/CashierPage/CashierDelivered';
import BuyDetail from './Pages/BuyCustomerProduct/BuyDetail';
import CashierUpdateOrder from './Pages/CashierPage/CashierUpdateOrder';
import Inventory from './Pages/Invetory/Inventory';
import ManageGold from './Pages/ManageProduct/ManageGold';
import ManageDiamond from './Pages/ManageProduct/ManageDiamond';
import ManageJewelry from './Pages/ManageProduct/ManageJewelry';
import GoldPrice from './Pages/Price/GoldPrice';
import DiamondPrice from './Pages/Price/DiamondPrice';
import AddJewelry from './Pages/Addproduct/AddJewelry';
import AddGold from './Pages/Addproduct/AddGold';
import AddDiamond from './Pages/Addproduct/AddDiamonds';
import Employee from './Pages/Employee/Employee';
import AddEmployee from './Pages/Employee/AddEmployee';
import ViewEmployee from './Pages/Employee/ViewEmployee';
import EditEmployee from './Pages/Employee/EditEmployee';
import Profile from './Pages/Profile/Profile';
import CustomerDetails from './Pages/Customer/Customer';
import DashBoard from './Pages/DashBoard/DashBoard';
import BillGold from './Pages/BillBuying/BillGold';
import Policy from './Pages/Header/Policy';
import Service from './Pages/Header/Service';
import Shop from './Pages/Header/Shop';
import AboutSystem from './Pages/Header/AboutSystem';
import PolicyLogin from './Pages/LoginHeader/Header/PolicyLogin';
import ServiceLogin from './Pages/LoginHeader/Header/ServiceLogin';
import ShopLogin from './Pages/LoginHeader/Header/ShopLogin';
import AboutSystemLogin from './Pages/LoginHeader/Header/AboutSystemLogin';
import BillDiamond from './Pages/BillBuying/BillDiamond';
import BillJewelry from './Pages/BillBuying/BillJewelry';
import PurchaseDetail from './Pages/PurchaseOrderList/purchaseDetail';
import HistoryOrder from './Pages/HistoryOrder/HistoryOrder';
import UpGold from './Pages/UpdateProduct/UpGold';
import UpDiamonds from './Pages/UpdateProduct/UpDiamonds';
import UpJewelry from './Pages/UpdateProduct/UpJewelry';
import purchaseDetailHistory from './Pages/PurchaseOrderList/purchaseDetailHistory';
import Material from './Pages/Invetory/Material';

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userReducer.userInfo);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('USER_INFO');
    if (savedUserInfo) {
      dispatch(setUserInfo(JSON.parse(savedUserInfo)));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Route to LoginPage if userInfo does not exist */}
          {!userInfo ? (
            <Route path="/*" element={<Navigate to="/login" replace />} />
          ) : (
            <Route path="/*" element={<Navigate to="/homePage" replace />} />
          )}

          <Route path="/login" element={<LoginPage />} />
          {/* Private Routes - Require authentication */}
          {userInfo && (
            <>
              
              <Route path="/feedbacks" element={<Layout Component={Feedbacks} />} />
              <Route path="/homePage" element={<Layout Component={ListProduct} />} />
              <Route path="/detail/:productCode" element={<Layout Component={DetailPage} />} />
              <Route path="/buyProduct" element={<Layout Component={BuyListProduct} />} />
              <Route path="/cashierListOrder" element={<Layout Component={CashierListOrder} />} />
              <Route path="/cashierOrderDetail/:orderKey" element={<Layout Component={CashierOrderDetail} />} />
              <Route path="/CartPage" element={<Layout Component={CartPage} />} />
              <Route path="/detailOrderSended/:orderKey" element={<Layout Component={DetailOrderSended} />} />
              <Route path="/listOrderSent" element={<Layout Component={SentPagee} />} />
              <Route path="/storeProductDetail/:orderCode" element={<Layout Component={StoreProductDetail} />} />
              <Route path="/cashierDelivered" element={<Layout Component={CashierDelivered} />} />
              <Route path="/buyDetail" element={<Layout Component={BuyDetail} />} />
              <Route path="/cashierUpdateOrder/:orderKey" element={<Layout Component={CashierUpdateOrder} />} />
              <Route path="/inventory" element={<Layout Component={Inventory} />} />
              <Route path="/inventory/material" element={<Layout Component={Material} />} />
              <Route path="/manageGold" element={<Layout Component={ManageGold} />} />
              <Route path="/manageDiamond" element={<Layout Component={ManageDiamond} />} />
              <Route path="/manageJewelry" element={<Layout Component={ManageJewelry} />} />
              <Route path="/gold-price" element={<Layout Component={GoldPrice} />} />
              <Route path="/diamond-price" element={<Layout Component={DiamondPrice} />} />
              <Route path="/add-diamond" element={<Layout Component={AddDiamond} />} />
              <Route path="/add-jewelry" element={<Layout Component={AddJewelry} />} />
              <Route path="/add-gold" element={<Layout Component={AddGold} />} />
              <Route path="/update-gold/:productCode" element={<Layout Component={UpGold} />} />
              <Route path="/update-diamond/:productCode" element={<Layout Component={UpDiamonds} />} />
              <Route path="/update-jewelry/:productCode" element={<Layout Component={UpJewelry} />} />
              <Route path="/bill-gold" element={<Layout Component={BillGold} />} />
              <Route path="/bill-diamond" element={<Layout Component={BillDiamond} />} />
              <Route path="/bill-jewelry" element={<Layout Component={BillJewelry} />} />
              <Route path="/payment-bill/:orderCode" element={<Layout Component={PurchaseDetail} />} />
              <Route path="/payment-history/:orderCode" element={<Layout Component={purchaseDetailHistory} />} />
              <Route path="/employee" element={<Layout Component={Employee} />} />
              <Route path="/add-employee" element={<Layout Component={AddEmployee} />} />
              <Route path="/view-employee" element={<Layout Component={ViewEmployee} />} />
              <Route path="/view-employee/:staffId" element={<Layout Component={ViewEmployee} />} />
              <Route path="/edit-employee/:id" element={<Layout Component={EditEmployee} />} />
              <Route path="/profile" element={<Layout Component={Profile} />} />
              <Route path="/customer" element={<Layout Component={CustomerDetails} />} />
              <Route path="/dashboard" element={<Layout Component={DashBoard} />} />
              <Route path="/policy" element={<Layout Component={Policy} />} />
              <Route path="/service" element={<Layout Component={Service} />} />
              <Route path="/shop" element={<Layout Component={Shop} />} />
              <Route path="/about-system" element={<Layout Component={AboutSystem} />} />
              <Route path="/policy-login" element={<Layout Component={PolicyLogin} />} />
              <Route path="/service-login" element={<Layout Component={ServiceLogin} />} />
              <Route path="/shop-login" element={<Layout Component={ShopLogin} />} />
              <Route path="/about-system-login" element={<Layout Component={AboutSystemLogin} />} />
              <Route path="/historyOrder" element={<Layout Component={HistoryOrder} />} />
            </>
          )}

          {/* Not found page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
