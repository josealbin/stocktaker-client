import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../User/User.css'

function UserLogin({ setUser }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('https://stocktaker-server.vercel.app/api/login', { email, password })
            .then(res => {
                if (res.data.status) {
                    setUser(res.data.username);
                    localStorage.setItem('username', res.data.username);
                    setEmail('');
                    setPassword('');
                    navigate('/inventory');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => { console.error(err); })
    }
    return (
        <div className='user-container'>
            <div className="login-box">
                <img src="/images/user.png" alt="" />
                <div className='entry-logo'>
                    <img src="/images/icon.png" alt="" />
                </div>
                <h4>Login here</h4>
                <form action='' onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} placeholder="" required onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="pass">Password</label>
                    <input type="password" value={password} placeholder="************" required onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit'>Login</button>
                </form>
            </div>
            <p className="login-path">New User? <Link to="/signup">Register here</Link></p>


        </div>
    )
}

export default UserLogin
