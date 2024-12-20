/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SaveIcon from '@mui/icons-material/Save';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { Box, Button, Checkbox, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';

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

const ScheduleIndex = () => {
    const [handleFormModal, setHandleFormModal] = useState(false);
    const [handleEmployeeModal, setHandleEmployeeModal] = useState(false);
    const [scheduleList, setScheduleList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [scheduleData, setScheduleData] = useState({
        scheduleDate: '',
        scheduleTime: '',
        scheduleComment: '',
    });
    const [loading, setLoading] = useState(false);

    // Fetch schedule list
    const fetchSchedulesList = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("scheduleMeetingToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schedule`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "x-authorization": `Bearer ${user_id}`,
                }
            });

            const result = await response.json();

            if (response.ok) {
                setScheduleList(result?.data || []);
            } else {
                alert(result.message || 'Failed to fetch schedules');
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch employees list
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
                setEmployees(result?.data || []);
            } else {
                alert(result.message || 'Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeCheckboxChange = (employee) => {
        setSelectedEmployees((prevState) => {
            const alreadySelected = prevState?.some(emp => emp?.employeeEmail === employee?.employeeEmail);
            const updatedSelection = alreadySelected
                ? prevState.filter(emp => emp?.employeeEmail !== employee?.employeeEmail)
                : [...prevState, employee];

            return updatedSelection;
        });
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();

        const selectedDateTime = new Date(`${scheduleData.scheduleDate}T${scheduleData.scheduleTime}`);
        const currentDateTime = new Date();

        if (isNaN(selectedDateTime.getTime()) || selectedDateTime <= currentDateTime) {
            alert("Please select a future date and time.");
            return;
        }

        if (selectedEmployees?.length === 0) {
            alert('Please select at least one employee');
            return;
        }

        setLoading(true);

        try {
            const token = Cookies.get("scheduleMeetingToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const payload = {
                employees: selectedEmployees,
                scheduleDate: scheduleData?.scheduleDate,
                scheduleTime: scheduleData?.scheduleTime,
                scheduleComment: scheduleData?.scheduleComment,
            };

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-authorization": `Bearer ${user_id}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setHandleFormModal(false);
                setHandleEmployeeModal(false);
                setScheduleData({
                    scheduleDate: '',
                    scheduleTime: '',
                    scheduleComment: '',
                })
                setSelectedEmployees([])
                fetchSchedulesList();
            } else {
                alert(result.message || 'Failed to schedule');
            }
        } catch (error) {
            console.error('Error scheduling:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedulesList();
    }, []);

    return (
        <>
            <Header />

            <div className="container">
                <div className="row">
                    <div className="col-md-12 mt-5">
                        <Box sx={{ boxShadow: 8, borderRadius: 8, p: 4 }}>
                            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 my-4'>
                                <Typography variant='h6' color='secondary'>Schedule List</Typography>
                                <Button
                                    type='button'
                                    variant="contained"
                                    color='secondary'
                                    startIcon={<DateRangeIcon />}
                                    onClick={() => {
                                        setHandleEmployeeModal(true);
                                        fetchEmployeesList();
                                    }}
                                >
                                    Schedule
                                </Button>
                            </div>
                            <div className='mt-3' style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>EMPLOYEE NAME</th>
                                            <th>EMPLOYEE EMAIL</th>
                                            <th>EMPLOYEE PHONE</th>
                                            <th>SCHEDULE DATE</th>
                                            <th>SCHEDULE TIME</th>
                                            <th>COMMENT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scheduleList.length > 0 ? (
                                            scheduleList.map((schedule, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}.</td>
                                                    <td>{schedule?.employeeName}</td>
                                                    <td>{schedule?.employeeEmail}</td>
                                                    <td>{schedule?.employeePhone}</td>
                                                    <td>{schedule?.scheduleDate}</td>
                                                    <td>{schedule?.scheduleTime}</td>
                                                    <td>{schedule?.scheduleComment}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">No records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Box>
                    </div>
                </div>
            </div>

            <Modal
                open={handleEmployeeModal}
                onClose={() => setHandleEmployeeModal(false)}
                aria-labelledby="employee-modal-title"
                aria-describedby="employee-modal-description"
            >
                <Box sx={style}>
                    <Typography id="employee-modal-title" variant="h6" component="h2">
                        Select Employees
                    </Typography>
                    <div className='mt-3' style={{ overflowX: 'auto', maxHeight: '300px' }}>
                        <table className='table table-bordered table-hover'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>EMPLOYEE NAME</th>
                                    <th>EMPLOYEE EMAIL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((employee, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Checkbox
                                                    color="secondary"
                                                    checked={selectedEmployees.some(emp => emp?.employeeEmail === employee?.employeeEmail)}
                                                    onChange={() => handleEmployeeCheckboxChange(employee)}
                                                />
                                            </td>
                                            <td>{employee?.employeeName}</td>
                                            <td>{employee?.employeeEmail}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No employees found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                        <Button type='button' variant="contained" color='error' onClick={() => setHandleEmployeeModal(false)}>Cancel</Button>
                        <Button type='button' variant="contained" color='secondary' onClick={() => {
                            setHandleEmployeeModal(false);
                            setHandleFormModal(true);
                        }}>Next</Button>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={handleFormModal}
                onClose={() => setHandleFormModal(false)}
                aria-labelledby="schedule-modal-title"
                aria-describedby="schedule-modal-description"
            >
                <Box sx={style}>
                    <Typography id="schedule-modal-title" variant="h6" component="h2">
                        Schedule Details
                    </Typography>
                    <form onSubmit={handleScheduleSubmit}>
                        <TextField
                            label="Schedule Date"
                            variant="outlined"
                            size="small"
                            color="secondary"
                            sx={{ my: 2 }}
                            name="scheduleDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={scheduleData?.scheduleDate}
                            onChange={(e) => setScheduleData({ ...scheduleData, scheduleDate: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Schedule Time"
                            variant="outlined"
                            size="small"
                            color="secondary"
                            sx={{ my: 2 }}
                            name="scheduleTime"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={scheduleData?.scheduleTime}
                            onChange={(e) => setScheduleData({ ...scheduleData, scheduleTime: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Comment"
                            variant="outlined"
                            size="small"
                            color="secondary"
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                            name="scheduleComment"
                            value={scheduleData?.scheduleComment}
                            onChange={(e) => setScheduleData({ ...scheduleData, scheduleComment: e.target.value })}
                        />
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            <Button
                                type="button"
                                variant="contained"
                                color="error"
                                onClick={() => setHandleFormModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type={!loading ? 'submit' : 'button'} variant={!loading ? 'contained' : 'outlined'} startIcon={<SaveIcon />} color="secondary">
                                {!loading ? 'Save' : 'Processing...'}
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default ScheduleIndex;