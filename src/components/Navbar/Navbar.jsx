import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import '../Navbar/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'


function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('username');
        setUser('');
        navigate('/');
    }
    return (
        <div className='header'>
            <div className="container">
                <div className='logo_block'>
                    <Link to="/inventory"><img src="/images/form.png" alt="" /></Link>
                    <Link to="/inventory" className="logo-header">StockTaker.</Link>
                </div>
                <nav className='user_block'>
                    <p><FontAwesomeIcon icon={faUserCircle} className='icon' />{user} |</p>  
                    <Link to="/"><button onClick={handleLogout}>Logout<FontAwesomeIcon icon={faPowerOff} className='log-icon' /></button></Link>
                </nav>
            </div>
        </div>
    )
}
export default Navbar
