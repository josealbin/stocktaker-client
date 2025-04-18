import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader'
import axios from 'axios'
import '../Admin/Admin.css'

function AdminLogin({ setUser }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('');
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        setSpinner(true);
        setLoginError(''); 
        axios.post('https://api.stocktaker.net/admin-login', { email, password })
            .then(res => {
                console.log("Login Response:", res.data); // Log response to check for token
                if (res.data.status && res.data.token) {
                    setUser(res.data.username);
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('token', res.data.token); // Store JWT Token
                    setEmail('');
                    setPassword('');
                    navigate('/admin-panel');
                } else {
                    setLoginError(res.data.message);
                    setSpinner(false);
                }
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || "Something went wrong.";
                setLoginError(errorMsg);
                setSpinner(false);
            });
    }
    return (
        <div className='admin-container'>
            <div className="login-box">
                <div className='entry-logo'>
                    <img src="/images/icon.png" alt="" />
                </div>
                <h4>Admin Login</h4>
                <div className='spinner'>{spinner && <FadeLoader color="#29ab87" loading={spinner} height={20} />}</div>
                <form action='' onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="pass">Password</label>
                    <input type="password" value={password} placeholder="************" required onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit'>Login</button>
                    {loginError && <p className="login-error">{loginError}</p>}
                </form>
            </div>
            <p className="login-path"><Link to="/login">User Login?</Link></p>
        </div>
    )
}

export default AdminLogin
