const { Router } = require('express')
const studentService = require('../service/student')

class StudentController{
    // studentService
    async init(){
        this.studentService = await studentService()
        const router = Router()
        
        return router
    }

    
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};