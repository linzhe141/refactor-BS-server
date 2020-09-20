const {Router} = require('express')
const userController = require('./user')
const studentController = require('./student')
const teacherController = require('./teacher')

module.exports = async function initControllers(){
    const router =  Router()
    router.use('/api/user', await userController())
    router.use('/api/student', await studentController())
    router.use('/api/teacher', await teacherController())
    return router
}