import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FadeLoader from 'react-spinners/FadeLoader'
import axios from 'axios'
import Validation from '../Validation';
import '../User/User.css'

function UserRegister() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [spinner, setSpinner] = useState(false)

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = Validation({email, password})
        setErrors(errs)
        if (Object.keys(errs).length > 0) {
            return;
        }
        setSpinner(true);
        axios.post('https://api.stocktaker.net/signup', { username, email, password })
            .then(res => { if (res.data.status) { navigate('/') } })
            .catch(err => {
                console.log(err);
                alert('Something went wrong. Please try again later.');
            })
            .finally(() => {
                setSpinner(false); // Ensure spinner stops in all cases
            });
    }
    return (
        <div className='user-container'>
            <div className="signup-box">
                <img src="/images/newuser.png" alt="" />
                <div className='entry-logo'>
                    <img src="/images/icon.png" alt="" />
                </div>
                <div className='spinner'>{spinner && <FadeLoader color="#29ab87" loading={spinner} height={20} />}</div>
                <h4>New user? Register here</h4>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="uname">User Name</label>
                    <input type="text" placeholder="" required onChange={(e) => { setUsername(e.target.value) }} />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="" onChange={(e) => { setEmail(e.target.value) }} />
                    {errors.email && <span className='valid-error'>{errors.email}</span>}
                    <label htmlFor="pass">Password</label>
                    <input type="password" placeholder="************" onChange={(e) => { setPassword(e.target.value) }} />
                    {errors.password && <span className='valid-error'>{errors.password}</span>}
                    <button type="submit">Submit</button>
                </form>
                <p>By clicking Submit, you agree to our<br />
                    <a href="/terms-conditions">Terms and Conditions</a> and <a href="/policy-privacy">Policy and Privacy</a></p>
            </div>
            <p className="login-path">Already have an account? <Link to="/">Login here</Link></p>

        </div>
    )
}

export default UserRegister
