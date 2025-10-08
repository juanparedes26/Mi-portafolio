import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './views/Home';
import injectContext from './js/store/appContext.jsx';
import './index.css';
import NotFound from './views/NotFound.jsx';
import About from './views/About.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './views/Login.jsx';
import Admin from './views/Admin.jsx';

const Layout = () => {
    const basename = import.meta.env.VITE_BASENAME || "";
  return (
    <div>
        <BrowserRouter basename={basename}>
            <Navbar />
            <Routes>
                <Route exact path='/' element={<Home/>} />
                <Route path='*' element={<NotFound/>} />
                <Route exact path='/about' element={<About/>} />
                <Route exact path='/admin-login' element={<Login/>} />
                <Route exact path='/admin' element={<Admin/>} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default injectContext(Layout);