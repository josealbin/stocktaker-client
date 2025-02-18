import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faChalkboard, faBell } from '@fortawesome/free-solid-svg-icons'
import '../Navbar/Navbar.css'
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
                    <p><FontAwesomeIcon icon={faChalkboard} className='icon' />admin?</p> 
                    <p><FontAwesomeIcon icon={faBell} className='icon' /></p>
                    <button><Link to="/information"><FontAwesomeIcon icon={faCircleInfo} className='log-icon' /></Link></button>
                </nav>
            </div>
        </div>
    )
}
export default LoginNavbar
