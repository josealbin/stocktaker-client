import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader'
import axios from 'axios'
import Validation from '../Validation';
import '../User/User.css'

function UserLogin({ setUser }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = Validation({email})
        setErrors(errs)
        if (Object.keys(errs).length > 0) {
            return;
        }
        setSpinner(true);
        axios.post('https://stocktaker-server.onrender.com/login', { email, password })
            .then(res => {
                console.log("Login Response:", res.data); // Log response to check for token
                if (res.data.status && res.data.token) {
                    setUser(res.data.username);
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('token', res.data.token); // Store JWT Token
                    setEmail('');
                    setPassword('');
                    navigate('/inventory');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => { 
                console.error("Login Error:", err.response?.data || err.message); 
                setSpinner(false);
            })
    }
    return (
        <div className='user-container'>
            <div className="login-box">
                <img src="/images/user.png" alt="" />
                <div className='entry-logo'>
                    <img src="/images/icon.png" alt="" />
                </div>
                <h4>Login here</h4>
                <div className='spinner'>{spinner && <FadeLoader color="#29ab87" loading={spinner} height={20} />}</div>
                <form action='' onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span className='valid-error'>{errors.email}</span>}
                    <label htmlFor="pass">Password</label>
                    <input type="password" value={password} placeholder="************" onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span className='valid-error'>{errors.password}</span>}
                    <button type='submit'>Login</button>
                </form>
            </div>
            <p className="login-path">New User? <Link to="/signup">Register here</Link></p>


        </div>
    )
}

export default UserLogin
