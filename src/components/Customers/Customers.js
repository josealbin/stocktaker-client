import React, { useEffect, useState, useRef } from 'react'
import '../Customers/Customers.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import AddCustomer from '../AddCustomer/AddCustomer'
import Controls from '../Controls/Controls'
import Iconbar from '../Iconbar/Iconbar'

function Customers() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [custname, setCustname] = useState('')
  const [region, setRegion] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [editId, setEditId] = useState('')
  const [sortorder, setSortorder] = useState('ASC')
  const tableRef = useRef(null);
  const searchRef = useRef(null);


  useEffect(() => {
    axios.get('https://stocktaker-client.vercel.app/getCustomers')
      .then(res => { setData(res.data); })
      .catch(err => { console.log(err); })
  }, [])

  const handleEdit = (id) => {
    axios.get('https://stocktaker-client.vercel.app/getCustomer/' + id)
      .then(res => {
        setCustname(res.data.name)
        setRegion(res.data.region)
        setEmail(res.data.email)
        setWebsite(res.data.website)
        setPhone(res.data.phone)
        setStatus(res.data.status)
        setEditId(id)
      })
      .catch(err => { console.log(err); })
  }

  const handleUpdate = () => {
    const updatedData = {
      date: new Date().toLocaleString() + "",
      name: custname,
      region: region,
      email: email,
      website: website,
      phone: phone,
      status: status
    }
    axios.put('https://stocktaker-client.vercel.app/updateCustomer/' + editId, updatedData)
      .then(res => {
        window.location.reload();
        setEditId(null)
      })
      .catch(err => console.log(err));
  }

  const handleDelete = (id) => {
    if (window.confirm("Deleted data cannot be retrieved! Are you sure you want to delete this customer?")) {
      axios.delete('https://stocktaker-client.vercel.app/deleteCustomer/' + id)
        .then(res => {
          console.log(res);
          window.location.reload();
          alert('Customer deleted successfully');
        })
        .catch(err => { console.log(err); })
    }
  }

  const cancelUpdate = () => {
    window.location.reload();
  }

  const getStatus = (status) => {
    if (status === 'active') return 'active';
    else if (status === 'review') return 'review'
    else return 'inactive';
  };

  const regionOptions = [{ label: '- Select -', value: 1 }, { label: 'North Sunshine', value: 2 }, { label: 'South', value: 3 }, { label: 'Gold Coast', value: 4 }, { label: 'Ipswich Toowoomba', value: 5 }, { label: 'City 4000', value: 6 }]
  const statOptions = [{ label: '- Select -', value: 1 }, { label: 'active', value: 2 }, { label: 'inactive', value: 3 }, { label: 'review', value: 4 }]

  const sortCol = (col) => {
    if (sortorder === 'ASC') {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      )
      setData(sorted)
      setSortorder('DSC')
    }
    if (sortorder === 'DSC') {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      )
      setData(sorted)
      setSortorder('ASC')
    }
  }


  return (
    <div>
      <div>
        <Iconbar tableRef={tableRef} searchRef={searchRef} />
      </div>
      <div>
        <Controls />
      </div>
      <div className='control-icons'>
        <img className='print-logo' src="/images/print.png" alt="download" />
      </div>
      <div className="search_box">
        <input type="text" id="search-input" placeholder="Filter table by Customer Name" ref={searchRef} onChange={(e) => setSearch(e.target.value)} />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
      </div>

      <AddCustomer />

      <div className="wrapper">
        <div className="table_wrap">
          <table className="cust_table" ref={tableRef}>
            <thead className="table_header">
              <tr className="item">
                <th>Updated_On</th>
                <th onClick={() => sortCol('name')}>Customer_Description <FontAwesomeIcon icon={faSort} className='icon' /></th>
                <th onClick={() => sortCol('region')}>Region <FontAwesomeIcon icon={faSort} className='icon' /></th>
                <th>Email</th>
                <th>Website/Booking</th>
                <th>Ph_No</th>
                <th>Status</th>
                <th className='no-print'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                data.filter((item) => { return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search) }).map((customer, index) => (
                  customer._id === editId ?
                    <tr>
                      <td data-label="Date">{customer.date}</td>
                      <td data-label="Customer Name"><input type="text" value={custname} onChange={e => setCustname(e.target.value)} /></td>
                      <td data-label="Region"><select onChange={e => setRegion(e.target.value)}> {regionOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                      <td data-label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                      <td data-label="Website"><input type="url" value={website} onChange={e => setWebsite(e.target.value)} /></td>
                      <td data-label="Phone"><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></td>
                      <td data-label="Status" className={getStatus(customer.status)}><select onChange={e => setStatus(e.target.value)}> {statOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                      <td>
                        <button onClick={handleUpdate} className='view-btn'>Update</button>
                        <button onClick={cancelUpdate} className='remove-btn'>Cancel</button>
                      </td>
                    </tr>
                    :
                    <tr key={index}>
                      <td data-label="Date">{customer.date}</td>
                      <td data-label="Customer Name">{customer.name}</td>
                      <td data-label="Region">{customer.region}</td>
                      <td data-label="Email">{customer.email ? (<a href={`mailto:${customer.email}`}>{customer.email}</a>) : ('-')}</td>
                      <td data-label="Website">{customer.website ? (<a href={customer.website.startsWith('http://') || customer.website.startsWith('https://') ? customer.website : `http://${customer.website}`} target="_blank" rel="noopener noreferrer">{customer.website}</a>) : ('-')}</td>
                      <td data-label="Phone">{customer.phone ? `(+61) ${customer.phone}` : '-'}</td>
                      <td data-label="Status" className={getStatus(customer.status)}><p>{customer.status}</p></td>
                      <td className='no-print'>
                        <button className='view-btn'>View</button>
                        <button onClick={() => handleEdit(customer._id)} className='edit-btn'>Edit</button>
                        <button onClick={() => handleDelete(customer._id)} className='remove-btn'>Trash</button>
                      </td>
                    </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Customers
