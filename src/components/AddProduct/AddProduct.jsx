import React, { useEffect, useState } from 'react'
import '../AddProduct/AddProduct.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

function AddProduct() {

  const [newID, setNewID] = useState('')
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newStock, setNewStock] = useState('')
  const [newOrder, setNewOrder] = useState('')
  const [newPortions, setNewPortions] = useState('')
  const [newPrice, setNewPrice] = useState('')
  //const [newFile, setNewFile] = useState()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Please log in.");
    } else {
      axios.get('https://api.stocktaker.net/getProducts', {
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
      stock: Number(newStock),
      order: Number(newOrder),
      difference: Number(newStock) - Number(newOrder),
      portions: newPortions,
      price: newPrice
    }
    //formData.append('productData', JSON.stringify(addedData));

    axios.post('https://api.stocktaker.net/addProduct', addedData, {
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

  const handleCancel = (e) => {
    e.preventDefault();
    setNewID('');
    setNewName('');
    setNewCategory('');
    setNewStock('');
    setNewOrder('');
    setNewPortions('');
    setNewPrice('');
  }

  const options = [{ label: '- Select -', value: 1 }, { label: 'Whole Cakes', value: 2 }, { label: 'Individual Tarts', value: 3 }, { label: 'Individual Slices', value: 4 }, { label: 'Banana Breads', value: 5 }, { label: 'Muffins', value: 6 }, { label: 'Cookies', value: 7 }, { label: 'MATER', value: 8 }, { label: 'Frozen', value: 9 }, { label: 'Gluten Free', value: 10 }, { label: 'New Product', value: 11 }, { label: 'Promotion', value: 12 }]

  return (
    <div className="add-container">
      <form onSubmit={handleAdd}>
        <div className="form-field">
          <div id='sku' className="input-field">
            <label htmlFor="pid">SKU:</label>
            <input type="text" value={newID} placeholder="SKU" required onChange={e => setNewID(e.target.value)} /><br />
          </div>
          <div id='des' className="input-field">
            <label htmlFor="pname">Name:</label>
            <input type="text" value={newName} placeholder="Description" required onChange={e => setNewName(e.target.value)} /><br />
          </div>
          <div id='portions' className="input-field">
            <label htmlFor="pname">Portions:</label>
            <input type="text" value={newPortions} placeholder="Portions" required onChange={e => setNewPortions(e.target.value)} /><br />
          </div>
          <div id='select' className="select-field">
            <label htmlFor="pcategory">Category:</label>
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}> {options.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select><br />
          </div>
          <div id='price' className="input-field">
            <label htmlFor="pname">Price:</label>
            <input type="text" value={newPrice} placeholder="Price $" required onChange={e => setNewPrice(e.target.value)} /><br />
          </div>
          <div id='qin' className="input-field">
            <label htmlFor="pstockin">Qty In:</label>
            <input type="text" value={newStock} placeholder="Qty In" onChange={e => setNewStock(e.target.value)} /><br />
          </div>
          <div id='qout' className="input-field">
            <label htmlFor="pstockout">Qty Out:</label>
            <input type="text" value={newOrder} placeholder="Qty Out" onChange={e => setNewOrder(e.target.value)} /><br />
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
