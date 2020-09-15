const { Router } = require('express')
const studentService = require('../service/student')
const userService = require('../service/user')
var util = require('../util')

class StudentController{
    // studentService
    async init(){
        this.studentService = await studentService()
        this.userService = await userService()
        this.util = await util()
        const router = Router()
        router.get('/studentList',this.studentList)
        router.post('/',this.createStudent)
        router.get('/',this.find)
        router.put('/:stuID',this.updateStudent)
        router.delete('/:stuID',this.deleteStudent)
        
        return router
    }

    studentList = async(req, res) => {
        const studentList = await this.studentService.findAll()
        return res.send({success: true, data: studentList})
    }

    createStudent = async(req, res) => {
        const {stuID,stuName,stuAge,stuGender/* ,classID */} = req.body
        const validation = await this.util.validaRequiredFields({stuID,stuName,stuAge,stuGender/* ,classID */})
        if(validation !== true){
            return res.send(validation)
        }
        const username = stuID
        const password = stuID
        const permissions = 2
        const newUser = await this.userService.create({username, password, permissions})
        
        const newStudent = await newUser.createStudent({stuID,stuName,stuAge,stuGender/* ,classID */})
        if(newStudent.errors){
            return res.send({success: false, error: newStudent.errors}) 
        }
        
        return res.send({success: true, data: newStudent})
    }

    find = async(req, res) => {
        let {stuID,stuName,stuAge,stuGender/* ,classID */} = req.query
        stuID = stuID || ''
        stuName = stuName || ''
        stuAge = stuAge || ''
        stuGender = stuGender || ''
       /*  classID = classID || '' */
        const result = await this.studentService.find({stuID, stuName, stuAge, stuGender/* ,classID */})
        console.log(result)
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    updateStudent = async(req, res) => {
        let {stuID} = req.params
        let {stuName,stuAge,stuGender,classID} = req.body
        const validation = await this.util.validaRequiredFields({stuID,stuName,stuAge,stuGender,classID})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.studentService.update({stuID, stuName, stuAge, stuGender,classID})
        console.log(result)
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    deleteStudent = async(req, res) => {
        const {stuID} = req.params
        console.log(stuID)
        const student = await this.studentService.find({stuID})
        if(student.length){
            const userid = student[0].userId
            const studentid = student[0].id
            const deleteuser = await this.userService.deleteById({id:userid})
            const deletestudent = await this.studentService.deleteById({id: studentid})
            res.send({success: true, data: deletestudent})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};