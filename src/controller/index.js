const {Router} = require('express')
const userController = require('./user')
const studentController = require('./student')

module.exports = async function initControllers(){
    const router =  Router()
    router.use('/api/user', await userController())
    router.use('/api/student', await studentController())
    return router
}