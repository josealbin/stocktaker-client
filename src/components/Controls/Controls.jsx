import React from 'react'
import '../Controls/Controls.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faCubes, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'

function Controls() {
  const location = useLocation();
  return (
    <div className='control-pane'>
      <nav className="nav">
        <Link to='/inventory'><FontAwesomeIcon icon={faCubes} className='icon' /> Inventory</Link>
        <div className='display_path'>
        <p>{location.pathname}</p>
        </div>
      </nav>

    </div>
  )
}

export default Controls
