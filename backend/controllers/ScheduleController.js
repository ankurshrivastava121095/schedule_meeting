const pool = require('../db/connectDB')();
const nodemailer = require("nodemailer");

class ScheduleController {

    static store = async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { 
                employees,
                scheduleDate,
                scheduleTime,
                scheduleComment,
            } = req.body;
    
            // Validate input
            if (!employees || !Array.isArray(employees) || employees.length === 0) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Employees list is required and must be a non-empty array',
                });
            }
    
            if (!scheduleDate) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Schedule date is required',
                });
            }
    
            // Check if scheduleDate is a future date
            const currentDate = new Date();
            const inputDate = new Date(scheduleDate);
    
            if (inputDate <= currentDate) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Schedule date must be a future date',
                });
            }
    
            // Start transaction
            await connection.query('START TRANSACTION');
    
            let allRowsAffected = true;
    
            for (let employee of employees) {
                const {
                    id,
                    employeeName,
                    employeeEmail,
                    employeePhone,
                    employeeAddress,
                } = employee;
    
                // Validate employee fields
                if (!id || !employeeName || !employeeEmail || !employeePhone || !employeeAddress) {
                    allRowsAffected = false;
                    break;
                }

                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    // port: 587,
                    port: 465,
                    auth: {
                        user: 'your_email_address',
                        pass: 'your_passkey'
                    },
                });

                await transporter.sendMail({
                    from: '"firm_name" <your_email_address>',
                    to: employeeEmail,
                    subject: `New Schedule`,
                    text: `New Schedule at ${scheduleDate} ${scheduleTime}`,
                    html: `<b>Received a new schedule for the date ${scheduleDate} at ${scheduleTime}.</b>`,
                });
    
                const [result] = await connection.query('INSERT INTO schedule_meetings SET ?', {
                    employeeId: id,
                    employeeName,
                    employeeEmail,
                    employeePhone,
                    employeeAddress,
                    scheduleDate,
                    scheduleTime,
                    scheduleComment,
                });
    
                if (result.affectedRows === 0) {
                    allRowsAffected = false;
                    break;
                }
            }
    
            if (allRowsAffected) {
                await connection.query('COMMIT');
                res.status(201).json({
                    status: 'success',
                    message: 'Meeting Scheduled Successfully',
                });
            } else {
                await connection.query('ROLLBACK');
                res.status(500).json({
                    status: 'failed',
                    message: 'Failed to schedule meetings. Check input data.',
                });
            }
        } catch (err) {
            await connection.query('ROLLBACK');
            res.status(500).json({
                status: 'failed',
                message: `Error: ${err.message}`,
            });
        } finally {
            connection.release();
        }
    }      

    static fetchAll = async (req, res) => {
        try {
            const [data] = await pool.query(`SELECT * FROM schedule_meetings ORDER BY id DESC`);
    
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM schedule_meetings WHERE id = ?', [req.params.id]);
            if (data.length > 0) {
                res.status(200).json({
                    success: true,
                    data: data[0]
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Record not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = ScheduleController;