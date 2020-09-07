const { Router } = require('express')
const studentService = require('../service/student')

class StudentController{
    // studentService
    async init(){
        this.studentService = await studentService()
        const router = Router()
        router.get('/studentList',this.studentList)
        
        return router
    }

    studentList = async(req, res) => {
        const studentList = await this.studentService.findAll()
        res.send({success: true, data: studentList})
    }
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};