import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LoginNavbar from './components/LoginNavbar/LoginNavbar';
import Inventory from './components/Inventory/Inventory';
import Customers from './components/Customers/Customers';
import UserLogin from './components/User/UserLogin';
import UserRegister from './components/User/UserRegister';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


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
    const isAuthRoute = location.pathname === '/' || location.pathname === '/signup';
    const isAuthenticated = localStorage.getItem('username');
    if (!isAuthenticated && !isAuthRoute) {
      navigate('/');
    }
  }, [location, navigate]);

  const isAuthRoute = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div>
      {isAuthRoute ? <LoginNavbar /> : <Navbar user={user}/>}
      <Routes>
        <Route path='/' element={<UserLogin setUser={setUser}/>}></Route>
        <Route path='/signup' element={<UserRegister />}></Route>
        <Route path='/inventory' element={<PrivateRoute><Inventory /></PrivateRoute>}></Route>
        <Route path='/customers' element={<PrivateRoute><Customers /></PrivateRoute>}></Route>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
