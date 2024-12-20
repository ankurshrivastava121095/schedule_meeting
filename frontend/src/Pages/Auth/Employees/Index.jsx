/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { Box, Button, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '500px',
    minWidth: '280px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const EmployeeIndex = () => {
    const [handleFormModal, setHandleFormModal] = useState(false);
    const [data, setData] = useState({
        employeeName: '',
        employeeEmail: '',
        employeePhone: '',
        employeeAddress: ''
    });
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchEmployeesList = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("scheduleMeetingToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "x-authorization": `Bearer ${user_id}`,
                }
            });

            const result = await response.json();

            if (response.ok) {
                setList(result?.data || []);
            } else {
                alert(result.message || 'Failed to fetch employee list');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const validateFields = () => {
        const { employeeName, employeeEmail, employeePhone, employeeAddress } = data;

        if (!employeeName.trim()) {
            alert('Employee name is required.');
            return false;
        }

        if (!employeeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeEmail)) {
            alert('Valid email is required.');
            return false;
        }

        if (!employeePhone.trim() || !/^\d{10}$/.test(employeePhone)) {
            alert('Phone number must be 10 digits and must be number.');
            return false;
        }

        if (!employeeAddress.trim()) {
            alert('Address is required.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        setLoading(true);

        try {
            const token = Cookies.get("scheduleMeetingToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-authorization": `Bearer ${user_id}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setHandleFormModal(false);
                fetchEmployeesList();
            } else {
                alert(result.message || 'Unknown Error Occurred');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesList();
    }, []);

    const filteredList = list.filter(employee => {
        return (
            employee?.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee?.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const displayedEmployees = filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <Header />

            <div className="container">
                <div className="row">
                    <div className="col-md-12 mt-5">
                        <Box sx={{ boxShadow: 8, borderRadius: 8, p: 4 }}>
                            <Typography variant='h6' color='secondary'>Employee List</Typography>
                            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 my-4'>
                                <TextField
                                    type='search'
                                    id="outlined-basic"
                                    label="Search"
                                    variant="outlined"
                                    size='small'
                                    color="secondary"
                                    sx={{ maxWidth: '320px' }}
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button type='button' variant="contained" color='secondary' startIcon={<AddIcon />} onClick={() => setHandleFormModal(true)}>Add New</Button>
                            </div>
                            <div className='mt-3' style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>NAME</th>
                                            <th>EMAIL</th>
                                            <th>PHONE</th>
                                            <th>ADDRESS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedEmployees.length > 0 ? (
                                            displayedEmployees.map((employee, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                                                    <td>{employee?.employeeName}</td>
                                                    <td>{employee?.employeeEmail}</td>
                                                    <td>{employee?.employeePhone}</td>
                                                    <td>
                                                        <Tooltip title={employee?.employeeAddress}>
                                                            <IconButton>
                                                                <LocationOnIcon sx={{ cursor: 'pointer' }} color='secondary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <Button variant="contained" color="secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                                <Typography variant="body2">Page {currentPage} of {totalPages}</Typography>
                                <Button variant="contained" color="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
                            </div>
                        </Box>
                    </div>
                </div>
            </div>

            <Modal
                open={handleFormModal}
                onClose={() => setHandleFormModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ADD NEW EMPLOYEE
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                id="name-input"
                                label="Name"
                                variant="outlined"
                                size='small'
                                color="secondary"
                                sx={{ mb: 2 }}
                                name='employeeName'
                                value={data?.employeeName}
                                onChange={handleInput}
                                fullWidth
                            />
                            <TextField
                                id="email-input"
                                label="Email"
                                variant="outlined"
                                size='small'
                                color="secondary"
                                sx={{ mb: 2 }}
                                name='employeeEmail'
                                value={data?.employeeEmail}
                                onChange={handleInput}
                                fullWidth
                            />
                            <TextField
                                id="phone-input"
                                label="Phone"
                                variant="outlined"
                                size='small'
                                color="secondary"
                                sx={{ mb: 2 }}
                                name='employeePhone'
                                value={data?.employeePhone}
                                onChange={handleInput}
                                fullWidth
                            />
                            <TextField
                                id="outlined-multiline-static"
                                label="Address"
                                multiline
                                color="secondary"
                                name='employeeAddress'
                                value={data?.employeeAddress}
                                onChange={handleInput}
                                rows={4}
                                fullWidth
                            />
                            <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                                <Button type='button' variant="contained" color='error' onClick={() => setHandleFormModal(false)}>Cancel</Button>
                                <Button type={!loading ? 'submit' : 'button'} variant={!loading ? 'contained' : 'outlined'} color='secondary' startIcon={<SaveIcon />}>{!loading ? 'Save' : 'Processing...'}</Button>
                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default EmployeeIndex;