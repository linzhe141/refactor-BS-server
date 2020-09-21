const { Router } = require('express')
const homeworkService = require('../service/homework')
const courseService = require('../service/course')
const fs = require('fs')
const path = require('path')
var util = require('../util')
const formidable = require('formidable')

class HomeworkController{
    // homeworkService
    async init(){
        this.homeworkService = await homeworkService()
        this.courseService = await courseService()
        this.util = await util()
        const router = Router()
        router.get('/homeworkList',this.homeworkList)
        router.post('/',this.createHomework)
        router.get('/',this.find)
        router.put('/',this.updateHomework)
        router.delete('/',this.deleteHomework)
        
        return router
    }
    
    /**
     * 获取所有作业
     * @route GET /api/homework/homeworkList
     * @summary 获取所有作业
     * @group homework - 作业管理模块
     */
    homeworkList = async(req, res) => {
        const homeworkList = await this.homeworkService.findAll()
        return res.send({success: true, data: homeworkList})
    }

    /**
     * 创建作业
     * @route POST /api/homework/
     * @summary 创建作业
     * @group homework - 作业管理模块
     * @param {string} hwName.formData - 请输入作业名
     * @param {string} hwDesc.formData - 请输入作业描述
     * @param {string} endDate.formData - 请输入截止日期
     * @param {string} hwFile.formData - 请上传作业文件
     * @param {Number} courseId.formData - 请选择课程id
     */
    createHomework = async(req, res) => {
        const form = new formidable.IncomingForm()
        const _this = this
        form.parse(req, async function (err, fields, files) {
            const {hwName,hwDesc,endDate,courseId} = fields
            const validation = await _this.util.validaRequiredFields({hwName,endDate,courseId})
            if(validation !== true){
                return res.send(validation)
            }
            const courseItem = await _this.courseService.find({id: courseId})
            if(courseItem.length == 0){
                return res.send({success: false, msg: '请先创建课程'})
            }
            const hwFile = files.hwFile.name
            if(hwFile){
                const fname = (new Date()).getTime() + '-' + hwFile
                const uploadDir = path.join(__dirname, '../upload/homework/'+fname);
                fs.rename(files.hwFile.path, uploadDir , async function(err){
                    if(err){
                        console.log(err)
                        return res.send({success: false, msg: '文件上传失败'})
                    }
                    const newHomework = await _this.homeworkService.create({hwName,hwDesc,endDate,courseId,hwFile:uploadDir})
                    if(newHomework.errors){
                        return res.send({success: false, error: newHomework.errors}) 
                    }
                    return res.send({success: true, data: newHomework})
                })
            } else{
                const newHomework = await _this.homeworkService.create({hwName,hwDesc,endDate,courseId,hwFile:''})
                if(newHomework.errors){
                    return res.send({success: false, error: newHomework.errors}) 
                }
                return res.send({success: true, data: newHomework})
            }
        })
    }

    /**
     * 查找作业
     * @route GET /api/homework/
     * @summary 查找作业
     * @group homework - 作业管理模块
     * @param {Number} id.query - 请输入作业id
     * @param {string} hwName.query - 请输入作业名
     * @param {string} endDate.query - 请输入截止日期
     * @param {Number} courseId.query - 请输入课程id
     */
    find = async(req, res) => {
        let {id,hwName,endDate,courseId} = req.query
        id = id || ''
        hwName = hwName || ''
        endDate = endDate || ''
        courseId = courseId || ''
        const result = await this.homeworkService.find({id,hwName,endDate,courseId})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 更新作业
     * @route PUT /api/homework/
     * @summary 更新作业
     * @group homework - 作业管理模块
     * @param {string} id.formData - 请输入id
     * @param {string} hwName.formData - 请输入作业名
     * @param {string} hwDesc.formData - 请输入作业描述
     * @param {string} endDate.formData - 请输入截止日期
     * @param {string} hwFile.formData - 请上传作业文件
     * @param {Number} courseId.formData - 请选择课程id
     */
    updateHomework = async(req, res) => {
        console.log('start---->')
        const form = new formidable.IncomingForm()
        const _this = this
        form.parse(req, async function (err, fields, files) {
            const {id,hwName,hwDesc,endDate,courseId} = fields
            const validation = await _this.util.validaRequiredFields({id,hwName,endDate,courseId})
            if(validation !== true){
                return res.send(validation)
            }
            const courseItem = await _this.courseService.find({id: courseId})
            if(courseItem.length == 0){
                return res.send({success: false, msg: '请先创建课程'})
            }
            const oldFile = await _this.homeworkService.find({id})
            if(oldFile.length && oldFile[0].hwFile){
                const oldFileItem = oldFile[0].hwFile+1
                console.log(oldFileItem)
                fs.unlink(oldFileItem,function(err){
                    if(err){
                        return res.send({success: false, msg: '更新作业失败'})
                    }
                })
            }
            const hwFile = files.hwFile.name
            if(hwFile){
                const fname = (new Date()).getTime() + '-' + hwFile
                const uploadDir = path.join(__dirname, '../upload/homework/'+fname);
                console.log({id,hwName,hwDesc,endDate,courseId,hwFile:uploadDir})
                fs.rename(files.hwFile.path, uploadDir , async function(err){
                    if(err){
                        console.log(err)
                        return res.send({success: false, msg: '文件上传失败'})
                    }
                    const result = await _this.homeworkService.update({id,hwName,hwDesc,endDate,courseId,hwFile:uploadDir})
                    if(result.errors){
                        return res.send({success: false, error: result.errors}) 
                    }
                    return res.send({success: true, msg: '更新成功'})
                })
            } else {
                const result = await _this.homeworkService.update({id,hwName,hwDesc,endDate,courseId,hwFile:''})
                if(result.errors){
                    return res.send({success: false, error: result.errors}) 
                }
                return res.send({success: true, msg: '更新成功'})
            }
        })
    }

    /**
     * 删除作业
     * @route DELETE /api/homework/
     * @summary 删除作业
     * @group homework - 作业管理模块
     * @param {Number} id.formData - 请输入id
     */
    deleteHomework = async(req, res) => {
        const {id} = req.body
        const homework = await this.homeworkService.find({id})
        if(homework.length){
            const hwid = homework[0].id
            const fileItem = homework[0].hwFile
            console.log('hwid---->',hwid)
            console.log('fileItem---->',fileItem)
            fs.unlink(fileItem,function(err){
                if(err){
                    console.log(err)
                    return res.send({success: false, msg: '删除作业失败'})
                }
            }) 
            const deletehw = await this.homeworkService.deleteById({id})
            return res.send({success: true, data: deletehw})
        } else {
            return res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new HomeworkController();
    return await c.init();
};