/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const Login = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/admin/dashboard')
                Cookies.set('scheduleMeetingToken',result.token, { expires: 7 })
            } else {
                alert(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div style={{ height: '100vh', background: 'lightblue', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ background: '#fff', boxShadow: 24, borderRadius: 8, p: 3 }}>
                    <Typography color='secondary' variant='h5' sx={{ textAlign: 'center' }}><GroupsIcon fontSize="large" /> Schedule Meeting</Typography>
                    <Typography color='secondary' variant='h6' sx={{ textAlign: 'center', mb: 3 }}>Login</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField 
                            id="email-input" 
                            label="Email" 
                            variant="outlined" 
                            size='small'
                            sx={{ mb: 2 }}
                            name='email'
                            value={data?.email}
                            onChange={handleInput}
                            fullWidth
                        />
                        <TextField 
                            id="password-input" 
                            label="Password" 
                            variant="outlined" 
                            size='small'
                            type={showPassword ? "text" : "password"}
                            sx={{ mb: 2 }}
                            name='password'
                            value={data?.password}
                            onChange={handleInput}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type={!loading ? 'submit' : 'button'} variant={!loading ? 'contained' : 'outlined'} sx={{ fontWeight: 'bold' }} color='secondary' fullWidth endIcon={<LoginIcon />}>{ !loading ? 'Get Started' : 'Processing...'}</Button>
                    </form>
                </Box>
            </div>
        </>
    );
};

export default Login;