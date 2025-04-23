import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faGear, faBell } from '@fortawesome/free-solid-svg-icons'
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
                    <p><button><Link to="/admin-login"><FontAwesomeIcon icon={faGear} className='tools-icon' />settings |</Link></button></p>
                    <button><Link to="/information"><FontAwesomeIcon icon={faBell} className='tools-icon' /></Link></button>
                    <button><Link to="/information"><FontAwesomeIcon icon={faCircleInfo} className='tools-icon' /></Link></button>
                </nav>
            </div>
        </div>
    )
}
export default LoginNavbar
