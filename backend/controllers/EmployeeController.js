const pool = require('../db/connectDB')();

class EmployeeController {

    static store = async (req, res) => {
        try {
            const { 
                employeeName,
                employeeEmail,
                employeePhone,
                employeeAddress,
            } = req.body;

            if (employeeName == '' || employeeEmail == '' || employeePhone == '' || employeeAddress == '') {
                res.status(401).json({ 'status': 'failed', 'message': 'All Fields Are Reuired' });
            } else {
                
                const [employeeData] = await pool.query('SELECT * FROM employees WHERE employeeEmail = ?', [employeeEmail]);
                
                if (employeeData.length == 0) {
                    const [dataSaved] = await pool.query('INSERT INTO employees SET ?', {
                        employeeName,
                        employeeEmail,
                        employeePhone,
                        employeeAddress,
                    });
    
                    if (dataSaved.affectedRows > 0) {
                        res.status(201).json({ 'status': 'success', 'message': 'Employee Details Added Successfully' });
                    } else {
                        res.status(401).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(403).json({ 'status': 'failed', 'message': 'Employee Already Exist with this Email' });
                }
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const [data] = await pool.query(`SELECT * FROM employees ORDER BY id DESC`);
    
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
            const [data] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
            if (data.length > 0) {
                res.status(200).json({
                    success: true,
                    data: data[0]
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Employee not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { 
                employeeName,
                employeeEmail,
                employeePhone,
                employeeAddress, 
            } = req.body;

            const [employeeData] = await pool.query('SELECT * FROM employees WHERE employeeEmail = ? AND id != ?', [employeeEmail, req.params.id]);

            if (employeeData.length == 0) {
                const [data] = await pool.query('UPDATE employees SET ? WHERE id = ?', [{
                    employeeName,
                    employeeEmail,
                    employeePhone,
                    employeeAddress,
                }, req.params.id]);
    
                if (data.affectedRows > 0) {
                    res.status(200).json({ 'status': 'success', 'message': 'Employee Details Updated Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Employee Already Exist' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const [data] = await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);

            if (data.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': 'Employee Record Deleted Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = EmployeeController;