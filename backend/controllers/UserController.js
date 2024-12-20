const bcrypt = require('bcrypt');
const pool = require('../db/connectDB')();
var jwt = require('jsonwebtoken');

class UserController {

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check if email and password are provided and not empty
            if (!email || !password) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email and Password are required',
                });
            }
    
            // Trim spaces from email and password
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
    
            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedEmail)) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid Email format',
                });
            }
    
            // Query the database for the user
            const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [trimmedEmail]);
    
            if (user.length > 0) {
                // Compare the provided password with the stored hashed password
                const isPasswordMatched = await bcrypt.compare(trimmedPassword, user[0].password);
    
                if (isPasswordMatched) {
                    // Generate a JWT token for the user
                    const token = jwt.sign({
                            id: user[0].id,
                            name: user[0].name,
                            email: user[0].email,
                            mobileNumber: user[0].mobileNumber,
                            alternateNumber: user[0].alternateNumber,
                            pincode: user[0].pincode,
                            city: user[0].city,
                            state: user[0].state,
                            country: user[0].country,
                            role: user[0].role,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '30 days' }
                    );
    
                    return res.status(200).json({
                        status: 'success',
                        message: 'Login Successfully',
                        token,
                    });
                } else {
                    return res.status(401).json({
                        status: 'failed',
                        message: 'Invalid Email or Password',
                    });
                }
            } else {
                return res.status(401).json({
                    status: 'failed',
                    message: 'User not Found',
                });
            }
        } catch (err) {
            // Handle unexpected errors
            return res.status(500).json({
                status: 'failed',
                message: `Error: ${err.message}`,
            });
        }
    };    

}

module.exports = UserController;