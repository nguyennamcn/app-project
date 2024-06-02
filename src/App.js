
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage'
import Layout from './Layout/Layout'
import LoginPage from './Pages/LoginPage/LoginPage';
import TestPage from './Pages/TestPage/TestPage';
import ListProduct from './Pages/DetailPage/ListProduct';
import AdminPage from './Pages/AdminPage/AdminPage';
import Feedbacks from './Pages/Feedbacks/Feedbacks';
import JewelryPage from './Pages/JewelryPage/JewelryPage';
import DetailPage from './Pages/DetailPage/DetailPage';
import BuyProductPage from './Pages/BuyJewelry/BuyJewelry'
import BuyListProduct from './Pages/BuyJewelry/BuyListProduct';
import CashierListOrder from './Pages/CashierPage/ListOrderPage';
import CashierOrderDetail from './Pages/CashierPage/CashierOrderDetail';

function App() {
  return (
    <div className="min-h-screen">

       <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/adminPage' element={<AdminPage />} />
          {/* <Route path='/detail' element={<DetailPage />} /> */}
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/test' element={<Layout Component={TestPage} />} />
          <Route path='/feedbacks' element={<Layout Component={Feedbacks} />} />
          <Route path='/homePage' element={<Layout Component={ListProduct} />} />
          <Route path='/detail/:productCode' element={<Layout Component={DetailPage} />} />
          <Route path='/buyproducts' element={<Layout Component={BuyListProduct} />} />
          <Route path='/cashierListOrder' element={<Layout Component={CashierListOrder} />} />
          <Route path='/cashierOrderDetail/:orderKey' element={<Layout Component={CashierOrderDetail} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

