import React, { useEffect, useState, useMemo } from 'react'
import Controls from '../Controls/Controls'
import '../Dashboard/Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes, faUsers, faFileLines, faList } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


function Dashboard() {

    const [prodData, setProdData] = useState([]);
    const [custData, setCustData] = useState([]);

    useEffect(() => {
        const fetchProducts = () => {
            axios.get('http://localhost:3001/getProducts')
                .then(res => { setProdData(res.data); })
                .catch(err => { console.log(err); })
        }
        const fetchCustomers = () => {
            axios.get('http://localhost:3001/getCustomers')
                .then(res => { setCustData(res.data) })
                .catch(err => { console.log(err); })
        }
        fetchProducts()
        fetchCustomers()
    }, [])

    const limitedProdData = useMemo(() => prodData.slice(0, 100), [prodData])

    return (
        <div>
            <div>
                <Controls />
            </div>
            <div className="dash-container">
                <div className="cards">
                    <div className="card">
                        <div className="card-content">
                            <div className="number">{prodData.length}</div>
                            <div className="card-name">Products</div>
                        </div>
                        <div className="icon-box">
                            <FontAwesomeIcon icon={faCubes} className='icon' />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-content">
                            <div className="number">{custData.length}</div>
                            <div className="card-name">Customers</div>
                        </div>
                        <div className="icon-box">
                            <FontAwesomeIcon icon={faUsers} className='icon' />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-content">
                            <div className="number">6</div>
                            <div className="card-name">Categories</div>
                        </div>
                        <div className="icon-box">
                            <FontAwesomeIcon icon={faList} className='icon' />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-content">
                            <div className="number">2</div>
                            <div className="card-name">Reports</div>
                        </div>
                        <div className="icon-box">
                            <FontAwesomeIcon icon={faFileLines} className='icon' />
                        </div>
                    </div>
                </div>
                <div className="charts">
                    <div className="chart" style={{ height: 400 }}>
                        <h2>Inventory</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={limitedProdData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="stock" stackId="a" fill="#8884d8" />
                                <Bar dataKey="order" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="difference" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                    <div className="chart" style={{ height: 400 }}>
                        <h2>Customers</h2>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default React.memo(Dashboard)
