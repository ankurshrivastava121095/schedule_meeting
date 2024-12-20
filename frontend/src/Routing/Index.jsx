/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Guest/Login'
import DashboardIndex from '../Pages/Auth/Dashboard/Index'
import EmployeeIndex from '../Pages/Auth/Employees/Index'
import ScheduleIndex from '../Pages/Auth/Schedule/Index'

const RoutingIndex = () => {
    return (
        <>
            <Routes>
                {/* Guest Route */}
                <Route path='/' element={<Login />} />

                {/* Protected Route */}
                <Route path='/admin/dashboard' element={<DashboardIndex />} />
                <Route path='/admin/employee' element={<EmployeeIndex />} />
                <Route path='/admin/schedule' element={<ScheduleIndex />} />
            </Routes>
        </>
    )
}

export default RoutingIndex