import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LoginNavbar from './components/LoginNavbar/LoginNavbar';
import Inventory from './components/Inventory/Inventory';
import UserLogin from './components/User/UserLogin';
import UserRegister from './components/User/UserRegister';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminLogin from './components/Admin/AdminLogin'
import AdminPage from './components/Admin/AdminPage';


function App() {
  const [user, setUser] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    const storedUser = localStorage.getItem('username');
    if(storedUser){
      setUser(storedUser);
    }
  },[])
  
  useEffect(() => {
    const isAuthRoute = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/admin-login';
    const isAuthenticated = localStorage.getItem('username');
    if (!isAuthenticated && !isAuthRoute) {
      navigate('/');
    }
  }, [location, navigate]);

  const isLoginPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/admin-login';

  return (
    <div>
      {isLoginPage ? <LoginNavbar /> : <Navbar user={user} setUser={setUser}/>}
      <Routes>
        <Route path='/' element={<UserLogin setUser={setUser}/>}></Route>
        <Route path='/signup' element={<UserRegister />}></Route>
        <Route path='/admin-login' element={<AdminLogin setUser={setUser} />}></Route>
        <Route path='/inventory' element={<PrivateRoute><Inventory /></PrivateRoute>}></Route>
        <Route path='/admin-panel' element={<PrivateRoute><AdminPage /></PrivateRoute>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
