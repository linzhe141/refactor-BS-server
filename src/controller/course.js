const { Router } = require('express')
const courseService = require('../service/course')
var util = require('../util')

class CourseController{
    // courseService
    async init(){
        this.courseService = await courseService()
        this.util = await util()
        const router = Router()
        router.get('/courseList',this.courseList)
        router.post('/',this.createCourse)
        router.get('/',this.find)
        router.put('/',this.updateCourse)
        router.delete('/',this.deleteCourse)
        
        return router
    }
    
    /**
     * 获取所有课程
     * @route GET /api/course/courseList
     * @summary 获取所有课程
     * @group course - 课程管理模块
     */
    courseList = async(req, res) => {
        const courseList = await this.courseService.findAll()
        return res.send({success: true, data: courseList})
    }

    /**
     * 创建课程
     * @route POST /api/course/
     * @summary 创建课程
     * @group course - 课程管理模块
     * @param {string} courseNum.formData - 请输入课程编号
     * @param {string} courseName.formData - 请输入课程名
     */
    createCourse = async(req, res) => {
        const {courseNum,courseName} = req.body
        const validation = await this.util.validaRequiredFields({courseNum,courseName})
        if(validation !== true){
            return res.send(validation)
        }
        const newCourse = await this.courseService.create({courseNum,courseName})
        if(newCourse.errors){
            return res.send({success: false, error: newCourse.errors}) 
        }
        
        return res.send({success: true, data: newCourse})
    }

    /**
     * 查找课程
     * @route GET /api/course/
     * @summary 查找课程
     * @group course - 课程管理模块
     * @param {string} courseNum.query - 请输入课程编号
     * @param {string} courseName.query - 请输入课程名
     */
    find = async(req, res) => {
        let {courseNum,courseName} = req.query
        courseNum = courseNum || ''
        courseName = courseName || ''
        const result = await this.courseService.find({courseNum, courseName})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 更新课程
     * @route PUT /api/course/
     * @summary 更新课程
     * @group course - 课程管理模块
     * @param {string} id.formData - 请输入id
     * @param {string} courseNum.formData - 请输入课程编号
     * @param {string} courseName.formData - 请输入课程名
     */
    updateCourse = async(req, res) => {
        let {id,courseNum,courseName} = req.body
        const validation = await this.util.validaRequiredFields({id,courseNum,courseName})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.courseService.update({id, courseNum, courseName})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除课程
     * @route DELETE /api/course/
     * @summary 删除课程
     * @group course - 课程管理模块
     * @param {string} id.formData - 请输入id
     */
    deleteCourse = async(req, res) => {
        const {id} = req.body
        const course = await this.courseService.find({id})
        if(course.length){
            const courseid = course[0].id
            const deletecourse = await this.courseService.deleteById({id: courseid})
            res.send({success: true, data: deletecourse})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new CourseController();
    return await c.init();
};