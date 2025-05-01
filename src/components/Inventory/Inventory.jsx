import React, { useEffect, useState, useRef } from 'react'
import './Inventory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faMagnifyingGlass, faArrowUpFromBracket, faPenToSquare, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import AddProduct from '../AddProduct/AddProduct'
import * as XLSX from 'xlsx'
import Controls from '../Controls/Controls'
import Iconbar from '../Iconbar/Iconbar'
import FadeLoader from 'react-spinners/FadeLoader'

function Inventory() {
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [prodname, setProdname] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [order, setOrder] = useState('')
    const [editId, setEditId] = useState('')
    const [sortorder, setSortorder] = useState('ASC')
    const [fileData, setFileData] = useState(null)
    //const [fileName, setFileName] = useState("");
    const [spinner, setSpinner] = useState(false)
    const tableRef = useRef(null)
    const searchRef = useRef(null)
    const fileInputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found, please log in.");
            return;
        }
        setSpinner(true);
        axios.get('https://api.stocktaker.net/getProducts', {
            headers: { Authorization: `Bearer ${token}` } // Send token
        })
            .then(res => {
                console.log("Products received:", res.data);
                setData(res.data);
                setSpinner(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err.response?.data || err.message);
                setSpinner(false);
            });
    }, []);


    const calculateStock = () => {
        try {
            const calculatedStock = eval(stock);
            setStock(calculatedStock);
        } catch (err) {
            setStock('invalid input', err);
        }
    };

    const calculateOrder = () => {
        try {
            const calculatedOrder = eval(order);
            setOrder(calculatedOrder);
        } catch (err) {
            setOrder('invalid input', err);
        }
    };


    const handleEdit = (id) => {
        axios.get(`https://api.stocktaker.net/getProduct/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })                                                                         
            .then(res => {
                setProdname(res.data.name)
                setCategory(res.data.category)
                //setStock(res.data.stock)
                setStock(res.data.difference);
                setOrder(res.data.order)
                setEditId(id)
            })
            .catch(err => { console.log(err); })
    }

    const handleUpdate = () => {
        const difference = parseInt(stock) - parseInt(order);
        const updatedData = {
            date: new Date().toLocaleString() + "",
            name: prodname,
            category: category,
            stock: stock,
            order: order,
            difference: difference
        }
        axios.put(`https://api.stocktaker.net/updateProduct/${editId}`, updatedData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                console.log(res.data);
                setData(prevData => prevData.map(item => item._id === editId ? { ...item, ...updatedData } : item));
                setProdname('');
                setCategory('');
                setStock('');
                setOrder('');
                setEditId(null)
            })
            .catch(err => console.log(err));
    }

    const cancelUpdate = () => {
        setProdname('');
        setCategory('');
        setStock('');
        setOrder('');
        setEditId(null);
    }


    const getStatus = (difference) => {
        if (difference <= 0) return 'no-stock';
        else if (difference > 0 && difference <= 10) return 'low-stock';
        else return 'available';
    };


    const handleDelete = (id) => {
        if (window.confirm("Deleted data cannot be reverted! Are you sure you want to delete this product?")) {
            axios.delete(`https://api.stocktaker.net/deleteProduct/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => {
                    console.log(res);
                    window.location.reload();
                })
                .catch(err => { console.log(err); })
        }
    }


    const options = [{ label: '- Select -', value: 1 }, { label: 'Whole Cakes', value: 2 }, { label: 'Individual Tarts', value: 3 }, { label: 'Individual Slices', value: 4 }, { label: 'Banana Breads', value: 5 }, { label: 'Muffins', value: 6 }, { label: 'Cookies', value: 7 }, { label: 'MATER', value: 8 }, { label: 'Frozen', value: 9 }, { label: 'Gluten Free', value: 10 }, { label: 'New Product', value: 11 }, { label: 'Promotion', value: 12 }]


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

    // Function to handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Assuming your Excel sheet has headers like 'id', 'stock', 'order'
            const updatedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1).map(row => ({
                id: row[0], // Adjust index if ID column is different
                order: row[2], // Adjust index if order column is different
            }));

            setFileData(updatedData);
        };
        reader.readAsArrayBuffer(file);
    };

    // Function to update table data with file data and push changes to the database
    const updateTableWithFileData = () => {
        if (fileData) {
            setSpinner(true);
            const updatedColumns = {};

            // Parse the file data and create an object with IDs as keys and updated values
            fileData.forEach(row => {
                const id = row.id; // Assuming ID is a property of each row
                const order = Number(row.order);
                updatedColumns[id] = { order };
            });

            // Update the specific columns (stock and order) in the table data based on IDs
            const updatedTableData = data.map(row => {
                const updatedValues = updatedColumns[row.id];
                if (updatedValues) {
                    const difference = row.stock - updatedValues.order;
                    return {
                        ...row,
                        order: updatedValues.order,
                        difference: difference
                    };
                }
                return row;
            });
            // Now, send an HTTP request to update data in the database
            setTimeout(() => {
                axios.post('https://api.stocktaker.net/updateData', {updatedTableData}, 
                {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
                    .then(res => {
                        setData(res.data);
                        setFileData(null);
                        window.location.reload();
                        setSpinner(false);
                        
                        if (fileInputRef.current) {            // **Reset file input field after upload completes**
                            fileInputRef.current.value = "";
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        setSpinner(false);
                    }); // Handle any errors

            }, 3000); // 3 seconds delay
        }
    };

    const handleOrderReset = () => {
        setSpinner(true);
        axios.put("https://api.stocktaker.net/resetOrders", {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
            .then(res => {
                console.log(res.data);
                setData(prevData => prevData.map(item => ({
                    ...item,
                    order: 0,
                    stock: item.difference
                })));
                setSpinner(false);
            })
            .catch(err => {
                console.log(err);
                setSpinner(false);
            });
    };

    return (
        <div>
            <div>
                <Iconbar tableRef={tableRef} searchRef={searchRef} />
            </div>
            <div>
                <Controls />
            </div>
            <div className="upload_file">
                <input type="file" className='upload_box' ref={fileInputRef} onChange={handleFileUpload} required />
                <button className="upload-btn" onClick={updateTableWithFileData}><FontAwesomeIcon icon={faArrowUpFromBracket} className='icon' />Upload</button>
                <button className="refresh-btn" onClick={handleOrderReset} > <FontAwesomeIcon icon={faPenToSquare} className='icon' />Reset</button>
                <p>*accepted file formats .xlsx .csv</p>
            </div>

            <div className="search_box">
                <input type="text" id="search-input" placeholder="Filter table by Product Name" ref={searchRef} onChange={(e) => setSearch(e.target.value)} />
                <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
            </div>

            <AddProduct />

            <div className='spinner'>{spinner && <FadeLoader color="#29ab87" loading={spinner} height={20} />}</div>

            <div className="wrapper">
                <div className="table_wrap">
                    <table className="prod_table" ref={tableRef}>
                        <thead className="table_header">
                            <tr className="item">
                                <th>Updated_On</th>
                                <th>SKU:</th>
                                <th onClick={() => sortCol('name')}>Product_Description <FontAwesomeIcon icon={faSort} className='icon' /></th>
                                <th onClick={() => sortCol('category')}>Category <FontAwesomeIcon icon={faSort} className='icon' /></th>
                                <th>Qty_In</th>
                                <th>Qty_Out</th>
                                <th>Stock</th>
                                <th>Status <FontAwesomeIcon icon={faSort} className='icon' /></th>
                                <th>File</th>
                                <th className='no-print'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.filter((item) => { return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search) }).map((product, index) => (
                                    product._id === editId ?
                                        <tr>
                                            <td data-label="Date">{product.date}</td>
                                            <td data-label="Product ID">{product.id}</td>
                                            <td data-label="Product Name"><input type="text" value={prodname} onChange={e => setProdname(e.target.value)} /></td>
                                            <td data-label="Category"><select onChange={e => setCategory(e.target.value)}> {options.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                                            <td data-label="Qty_In"><input type="text" value={stock} onChange={e => setStock(e.target.value)} onBlur={calculateStock} /></td>
                                            <td data-label="Qty_Out"><input type="text" value={order} onChange={e => setOrder(e.target.value)} onBlur={calculateOrder} /></td>
                                            <td data-label="Level" className={getStatus(product.difference)}><p>{product.difference}</p></td>
                                            <td data-label="Status" className={getStatus(product.difference)}><p>{getStatus(product.difference)}</p></td>
                                            <td data-label="File" className='download-btn'><FontAwesomeIcon icon={faArrowUpRightFromSquare} className='icon' /></td>
                                            <td>
                                                <button onClick={handleUpdate} className='update-btn'>Update</button>
                                                <button onClick={cancelUpdate} className='remove-btn'>Cancel</button>
                                            </td>
                                        </tr>
                                        :
                                        <tr key={index}>
                                            <td data-label="Date">{product.date}</td>
                                            <td data-label="Product ID">{product.id}</td>
                                            <td data-label="Product Name">{product.name}</td>
                                            <td data-label="Category">{product.category}</td>
                                            <td data-label="Qty_In">{product.stock}</td>
                                            <td data-label="Qty_Out">{product.order}</td>
                                            <td data-label="Level" className={getStatus(product.difference)}><p>{product.difference}</p></td>
                                            <td data-label="Status" className={getStatus(product.difference)}><p>{getStatus(product.difference)}</p></td>
                                            <td data-label="File" className='download-btn'><FontAwesomeIcon icon={faArrowUpRightFromSquare} className='icon' /></td>
                                            <td className='no-print'>
                                                <button className='view-btn'>View</button>
                                                <button onClick={() => handleEdit(product._id)} className='edit-btn'>Edit</button>
                                                <button onClick={() => handleDelete(product._id)} className='remove-btn'>Trash</button>
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

export default Inventory
