import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import Layout from './Layout/Layout';
import LoginPage from './Pages/LoginPage/LoginPage';
import TestPage from './Pages/TestPage/TestPage';
import ListProduct from './Pages/DetailPage/ListProduct';
import AdminPage from './Pages/AdminPage/AdminPage';
import Feedbacks from './Pages/Feedbacks/Feedbacks';
import JewelryPage from './Pages/JewelryPage/JewelryPage';
import DetailPage from './Pages/DetailPage/DetailPage';
import BuyProductPage from './Pages/BuyJewelry/BuyJewelry';
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
import StoreSelection from './Pages/BuyStoreProduct/BuyStoreProduct';
import Inventory from './Pages/Invetory/Inventory';
import ManageGold from './Pages/ManageProduct/ManageGold';
import ManageDiamond from './Pages/ManageProduct/ManageDiamond';
import ManageJewelry from './Pages/ManageProduct/ManageJewelry';
import GoldPrice from './Pages/GoldPrice/GoldPrice';
import UpdateProduct from './Pages/Update Product/UpdateProduct';
import AddProduct from './Pages/Addproduct/Addproduct';
import BillBuying from './Pages/BillBuying/BillBuying';
import AddMoreGold from './Pages/BuyGold/AddMoreGold';
import { ProductProvider } from './contexts/ProductContext'; 

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <ProductProvider> 
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
            <Route path='/goldprice' element={<Layout Component={GoldPrice} />} />
            <Route path='/updateproduct' element={<Layout Component={UpdateProduct} />} />
            <Route path='/addproduct' element={<Layout Component={AddProduct} />} />
            <Route path='/billbuyng' element={<Layout Component={BillBuying} />} />
            <Route path='/bill' element={<Layout Component={BillBuying} />} />
            <Route path='/addMoreGold' element={<Layout Component={AddMoreGold} />} />
          </Routes>
        </ProductProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
