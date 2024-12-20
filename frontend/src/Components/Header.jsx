/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {

    const { pathname } = useLocation()

    const [activeMenu, setActiveMenu] = useState('')

    useEffect(()=>{
        if (pathname == '/admin/dashboard') {
            setActiveMenu('dashboard')
        }
        if (pathname == '/admin/employee') {
            setActiveMenu('employee')
        }
        if (pathname == '/admin/schedule') {
            setActiveMenu('schedule')
        }
    },[])

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white" style={{ borderBottom: '1px solid #a927b0' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/admin/dashboard"><Typography variant='h6' color='secondary'>Schedule Meeting</Typography></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className={`nav-link ${activeMenu == 'dashboard' ? 'activeMenuClass' : ''}`} to="/admin/dashboard"><Typography>Dashboard</Typography></Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${activeMenu == 'employee' ? 'activeMenuClass' : ''}`} to="/admin/employee"><Typography>Employee</Typography></Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${activeMenu == 'schedule' ? 'activeMenuClass' : ''}`} to="/admin/schedule"><Typography>Schedule</Typography></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header