import React, { useEffect, useState } from 'react'
import '../AddProduct/AddProduct.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

function AddProduct() {

  const [newID, setNewID] = useState('')
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newStock, setNewStock] = useState(0)
  const [newOrder, setNewOrder] = useState(0)
  //const [newFile, setNewFile] = useState()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Please log in.");
    } else {
      axios.get('https://stocktaker-server.onrender.com/getProducts', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => { console.log(res.data); })
        .catch(err => { console.error("Request Error:", err.response?.data || err.message); })
    }
  }, [])

  const handleAdd = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
    //const formData = new FormData()
    //formData.append('file', newFile)
    const addedData = {
      date: new Date().toLocaleString() + "",
      id: newID,
      name: newName,
      category: newCategory,
      stock: newStock,
      order: newOrder,
      difference: newStock - newOrder
    }
    //formData.append('productData', JSON.stringify(addedData));

    axios.post('https://stocktaker-server.onrender.com/addProduct', addedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        //'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res.data);
        window.location.reload()
      }).catch(err => {
        console.log(err);
      })
  }

  const handleCancel = () => {
    window.location.reload()
  }

  const options = [{ label: '- Select -', value: 1 }, { label: 'Savoury', value: 2 }, { label: 'Vegan', value: 3 }, { label: 'Ind Tarts', value: 4 }, { label: 'Ind Slices', value: 5 }, { label: 'Muffins', value: 6 }, { label: 'Sweet', value: 7 }]

  return (
    <div className="add-container">
      <form onSubmit={handleAdd}>
        <div className="form-field">
          <div className="input-field">
            <label htmlFor="pid">SKU:</label>
            <input type="text" placeholder="SKU" required onChange={e => setNewID(e.target.value)} /><br />
          </div>
          <div className="input-field">
            <label htmlFor="pname">Name:</label>
            <input type="text" placeholder="Description" required onChange={e => setNewName(e.target.value)} /><br />
          </div>
          <div className="select-field">
            <label htmlFor="pcategory">Category:</label>
            <select onChange={e => setNewCategory(e.target.value)}> {options.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select><br />
          </div>
          <div className="input-field">
            <label htmlFor="pstockin">Quantity In:</label>
            <input type="text" placeholder="Qty In" onChange={e => setNewStock(e.target.value)} /><br />
          </div>
          <div className="input-field">
            <label htmlFor="pstockout">Quantity Out:</label>
            <input type="text" placeholder="Qty Out" onChange={e => setNewOrder(e.target.value)} /><br />
          </div>
          <div className="upload-field">
            <label htmlFor="pfile">File(Optional):</label>
            <input type="file" accept='application/pdf' /* onChange={(e) => setNewFile(e.target.files[0])}  */ /><br />
          </div>
          <div className="control-field">
            <button className="add-btn"><FontAwesomeIcon icon={faFileCirclePlus} className='icon' /> Add</button>
            <button className="clear-btn" onClick={handleCancel}><FontAwesomeIcon icon={faEraser} className='icon' /> Clear</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
