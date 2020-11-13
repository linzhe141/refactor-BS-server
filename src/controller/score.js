const { Router } = require('express')
const scoreService = require('../service/score')
const studentService = require('../service/student')
const homeworkService = require('../service/homework')
const teacherService = require('../service/teacher')
const courseService = require('../service/course')

var util = require('../util')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
class ScoreController{
    // scoreService
    async init(){
        this.scoreService = await scoreService()
        this.studentService = await studentService()
        this.homeworkService = await homeworkService()
        this.teacherService = await teacherService()
        this.courseService = await courseService()
        this.util = await util()
        const router = Router()
        router.get('/scoreList',this.scoreList)
        router.get('/',this.find)
        router.put('/upload',this.upload)
        router.put('/correct',this.correct)
        return router
    }
    
    /**
     * 获取所有成绩
     * @route GET /api/score/scoreList
     * @summary 获取所有成绩
     * @group score - 成绩管理模块
     */
    scoreList = async(req, res) => {
        const scoreList = await this.scoreService.findAll()
        return res.send({success: true, data: scoreList})
    }

    
    /**
     * 查找成绩
     * @route GET /api/ /
     * @summary 查找成绩
     * @group score - 成绩管理模块
     * @param {Number} stuid.query - 请输入学生id
     * @param {Number} hwid.query - 请输入作业id
     * @param {string} score.query - 请输入成绩
     */
    find = async(req, res) => {
        let {stuid,hwid,score} = req.query
        stuid = stuid || ''
        hwid = hwid || ''
        score = score || ''
        const result = await this.scoreService.find({stuid,hwid,score})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        const data = []
        for(let item of result){
            const value = (await this.studentService.find({id:item.stuid}))[0]
            const teacherId = (await this.homeworkService.find({id:item.hwid}))[0].teacherId
            const hwName = (await this.homeworkService.find({id:item.hwid}))[0].hwName
            const hwDesc = (await this.homeworkService.find({id:item.hwid}))[0].hwDesc
            const endDate = (await this.homeworkService.find({id:item.hwid}))[0].endDate
            const hwFile = (await this.homeworkService.find({id:item.hwid}))[0].hwFile

            const courseId = (await this.teacherService.find({id:teacherId}))[0].courseId
            const courseName = (await this.courseService.find({id:courseId}))[0].courseName
            data.push({
                stuName: value.stuName,
                stuid: item.stuid,
                courseName,
                state: item.state,  
                score: item.score,
                comments: item.comments,
                hwName,
                hwDesc,
                endDate,
                hwFile,
                resultFile: item.resultFile,
                stuFile: item.stuFile
            })
        }
        return res.send({success: true, data: data})
    }

    /**
     * 上传作业
     * @route PUT /api/score/upload
     * @summary 上传作业
     * @group score - 成绩管理模块
     * @param {Number} stuid.formData - 请输入学生id
     * @param {Number} hwid.formData - 请输入作业id
     * @param {file} stuFile.formData - 请输入学生上传的作业文件地址
     */
    upload = async(req, res) => {
        const form = new formidable.IncomingForm()
        const _this = this
        form.parse(req, async function (err, fields, files) {
            const {stuid,hwid,score} = fields
            const stuFile = files.stuFile && files.stuFile.name
            const validation = await _this.util.validaRequiredFields({stuid,hwid,stuFile})
            if(validation !== true){
                return res.send(validation)
            }
            const oldItem = await _this.scoreService.find({stuid,hwid})
            let resultFile = ''
            if(oldItem.length){
                resultFile = oldItem[0].resultFile 
                if(oldItem[0].stuFile){
                    fs.unlink(oldItem[0].stuFile,function(err){
                        if(err){
                            return res.send({success: false, msg: '更新失败'})
                        }
                    })
                }
            }

            const fname = (new Date()).getTime() + '-' + stuFile
            const uploadDir = path.join(__dirname, '../upload/completion/'+fname);
            fs.rename(files.stuFile.path, uploadDir , async function(err){
                if(err){
                    return res.send({success: false, msg: '文件上传失败'})
                }
                const result = await _this.scoreService.update({stuid,hwid,score,resultFile,stuFile:uploadDir})
                if(result.errors){
                    return res.send({success: false, error: result.errors}) 
                }
                return res.send({success: true, msg: '更新成功'})
            })
        })
    }

    /**
     * 批改作业
     * @route PUT /api/score/correct
     * @summary 批改作业
     * @group score - 成绩管理模块
     * @param {Number} stuid.formData - 请输入学生id
     * @param {Number} hwid.formData - 请输入作业id
     * @param {Number} state.formData - 请输入是否完成 1表示完成，0表示未完成
     * @param {string} score.formData - 请输入成绩
     * @param {string} comments.formData - 请输入评语
     * @param {file} resultFile.formData - 请输入批改后的文件地址
     */
    correct = async(req, res) => {
        const form = new formidable.IncomingForm()
        const _this = this
        form.parse(req, async function (err, fields, files) {
            const {stuid,hwid,score,state,comments} = fields
            const resultFile = files.resultFile && files.resultFile.name || ''
            const validation = await _this.util.validaRequiredFields({stuid,hwid,state,score})
            if(validation !== true){
                return res.send(validation)
            }
            const oldItem = await _this.scoreService.find({stuid,hwid})
            let stuFile = ''
            if(oldItem.length){
                stuFile = oldItem[0].stuFile
                if(oldItem[0].resultFile){
                    fs.unlink(oldItem[0].resultFile,function(err){
                        if(err){
                            return res.send({success: false, msg: '更新失败'})
                        }
                    })
                }
            }
            if(resultFile){
                const fname = (new Date()).getTime() + '-' + resultFile
                const uploadDir = path.join(__dirname, '../upload/correct/'+fname);
                fs.rename(files.resultFile.path, uploadDir , async function(err){
                    if(err){
                        return res.send({success: false, msg: '文件上传失败'})
                    }
                    const result = await _this.scoreService.update({stuid,hwid,score,state,comments,resultFile:uploadDir,stuFile})
                    if(result.errors){
                        return res.send({success: false, error: result.errors}) 
                    }
                    return res.send({success: true, msg: '更新成功'})
                })
            } else{
                const result = await _this.scoreService.update({stuid,hwid,score,state,comments,resultFile,stuFile})
                if(result.errors){
                    return res.send({success: false, error: result.errors}) 
                }
                return res.send({success: true, msg: '更新成功'})
            }
        })
    }
}
module.exports = async () => {
    const c = new ScoreController();
    return await c.init();
};