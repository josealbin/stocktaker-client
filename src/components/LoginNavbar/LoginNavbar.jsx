import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faGear } from '@fortawesome/free-solid-svg-icons'
import '../LoginNavbar/LoginNavbar.css'
import { Link } from 'react-router-dom'


function LoginNavbar() {
    return (
        <div className='header'>
            <div className="container">
                <div className='logo_block'>
                    <Link to="/"><img src="/images/form.png" alt="" /></Link>
                    <Link to="/" className="logo-header">StockTaker.</Link>
                </div>
                <nav className='user_block'>
                    <button><Link to="/admin-login"><FontAwesomeIcon icon={faGear} className='log-icon' /></Link></button> 
                    <button><Link to="/information"><FontAwesomeIcon icon={faCircleInfo} className='log-icon' /></Link></button>
                </nav>
            </div>
        </div>
    )
}
export default LoginNavbar
