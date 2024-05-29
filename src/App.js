
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
          <Route path='/detail' element={<Layout Component={DetailPage} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

