const {Router} = require('express')
const userController = require('./user')
const studentController = require('./student')
const teacherController = require('./teacher')
const classgradeController = require('./classgrade')
const teachgradeController = require('./teachgrade')
const coourseController = require('./course')
const homeworkController = require('./homework')
const scoreController = require('./score')

module.exports = async function initControllers(){
    const router =  Router()
    router.use('/api/user', await userController())
    router.use('/api/student', await studentController())
    router.use('/api/teacher', await teacherController())
    router.use('/api/classgrade', await classgradeController())
    router.use('/api/teachgrade', await teachgradeController())
    router.use('/api/course', await coourseController())
    router.use('/api/homework', await homeworkController())
    router.use('/api/score', await scoreController())
    return router
}