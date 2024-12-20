const express = require('express')
const UserController = require('../controllers/UserController')
const middleWare = require('../middleware/Auth')
const EmployeeController = require('../controllers/EmployeeController')
const ScheduleController = require('../controllers/ScheduleController')
const router = express.Router()



// UserController
router.post('/login', UserController.login)

// EmployeeController
router.post('/employee', middleWare, EmployeeController.store)
router.get('/employee', middleWare, EmployeeController.fetchAll)
router.get('/employee/:id', middleWare, EmployeeController.fetchSingle)
router.put('/employee/:id', middleWare, EmployeeController.update)
router.delete('/employee/:id', middleWare, EmployeeController.delete)

// ScheduleController
router.post('/schedule', middleWare, ScheduleController.store)
router.get('/schedule', middleWare, ScheduleController.fetchAll)
router.get('/schedule/:id', middleWare, ScheduleController.fetchSingle)


module.exports = router