
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage'
import Layout from './Layout/Layout'
import LoginPage from './Pages/LoginPage/LoginPage';
import TestPage from './Pages/TestPage/TestPage';
import ListProduct from './Pages/DetailPage/ListProduct';
import AdminPage from './Pages/AdminPage/AdminPage';
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
import GoldPrice from './Pages/GoldPrice/GoldPrice';
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

function App() {
  return (
    <div className="min-h-screen">

       <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/adminPage' element={<AdminPage />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/test' element={<Layout Component={TestPage} />} />
          <Route path='/feedbacks' element={<Layout Component={Feedbacks} />} />
          <Route path='/homePage' element={<Layout Component={ListProduct} />} />
          <Route path='/detail/:productCode' element={<Layout Component={DetailPage} />} />
          <Route path='/buyProduct' element={<Layout Component={BuyListProduct} />} />
          <Route path='/cashierListOrder' element={<Layout Component={CashierListOrder} />} />
          <Route path='/cashierOrderDetail/:orderKey' element={<Layout Component={CashierOrderDetail} />} />
          <Route path='/CartPage' element={<Layout Component={CartPage} />} />
          <Route path='/detailOrderSended/:orderKey' element={<Layout Component={DetailOrderSended} />} />
          <Route path='/listOrderSent' element={<Layout Component={SentPagee} />} />
          <Route path='/storeProductDetail/:orderCode' element={<Layout Component={StoreProductDetail} />} />
          <Route path='/cashierDelivered' element={<Layout Component={CashierDelivered} />} />
          <Route path='/buyDetail' element={<Layout Component={BuyDetail} />} />
          <Route path='/cashierUpdateOrder/:orderKey' element={<Layout Component={CashierUpdateOrder} />} />
          <Route path='/inventory' element={<Layout Component={Inventory} />} />
          <Route path='/manageGold' element={<Layout Component={ManageGold} />} />
          <Route path='/manageDiamond' element={<Layout Component={ManageDiamond} />} />
          <Route path='/manageJewelry' element={<Layout Component={ManageJewelry} />} />
          <Route path='/gold-price' element={<Layout Component={GoldPrice} />} />
          <Route path='/add-diamond' element={<Layout Component={AddDiamond} />} />
          <Route path='/add-jewelry' element={<Layout Component={AddJewelry} />} />
          <Route path='/add-gold' element={<Layout Component={AddGold} />} />
          <Route path='/bill-gold' element={<Layout Component={BillGold} />} />
          <Route path='/employee' element={<Layout Component={Employee} />} />
          <Route path='/add-employee' element={<Layout Component={AddEmployee} />} />
          <Route path='/view-employee' element={<Layout Component={ViewEmployee} />} />
          <Route path='/view-employee/:id' element={<Layout Component={ViewEmployee} />} />
          <Route path='/edit-employee' element={<Layout Component={EditEmployee} />} />
          <Route path='/profile' element={<Layout Component={Profile} />} />
          <Route path='/customer' element={<Layout Component={CustomerDetails} />} />
          <Route path='/dashboard' element={<Layout Component={DashBoard} />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='/service' element={<Service />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/about-system' element={<AboutSystem />} />
          <Route path='/policy-login' element={<PolicyLogin />} />
          <Route path='/service-login' element={<ServiceLogin />} />
          <Route path='/shop-login' element={<ShopLogin />} />
          <Route path='/about-system-login' element={<AboutSystemLogin />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;