const { Router } = require('express')
const studentService = require('../service/student')
const userService = require('../service/user')

class StudentController{
    // studentService
    async init(){
        this.studentService = await studentService()
        this.userService = await userService()
        const router = Router()
        router.get('/studentList',this.studentList)
        router.post('/',this.createStudent)
        
        return router
    }

    studentList = async(req, res) => {
        const studentList = await this.studentService.findAll()
        res.send({success: true, data: studentList})
    }

    createStudent = async(req, res) => {
        const {stuID,stuName,stuAge,stuGender,classID} = req.body
        console.log(userService)
        // let newStudent
        // try {
        //     newStudent = await this.studentService.create({stuID,stuName,stuAge,stuGender,classID})
        //     const username = stuID
        //     const password = stuID
        //     const permissions = 2
        //     const newUser = await this.userService.create({username, password, permissions})
        // } catch (error) {
        //     // console.log('error----fdsafdsaf---->',error)
        //     res.send({success: false, error: error.errors})
        //     return 
        // }
        const newStudent = await this.studentService.create({stuID,stuName,stuAge,stuGender,classID})
        console.log(newStudent)
        if(newStudent.errors){
            return res.send({success: false, error: newStudent.errors})
        }
        const username = stuID
        const password = stuID
        const permissions = 2
        const newUser = await this.userService.create({username, password, permissions})
        res.send({success: true, data: newStudent})
    }
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};