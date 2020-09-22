const { Router } = require('express')
const scoreService = require('../service/score')
var util = require('../util')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
class ScoreController{
    // scoreService
    async init(){
        this.scoreService = await scoreService()
        this.util = await util()
        const router = Router()
        router.get('/scoreList',this.scoreList)
        router.get('/',this.find)
        router.put('/',this.updatescore)
        return router
    }
    
    /**
     * 获取所有成绩
     * @route GET /api/score/scoreList
     * @summary 获取所有成绩
     * @group scoreMapping - 成绩管理模块
     */
    scoreList = async(req, res) => {
        const scoreList = await this.scoreService.findAll()
        return res.send({success: true, data: scoreList})
    }

    
    /**
     * 查找成绩
     * @route GET /api/score/
     * @summary 查找成绩
     * @group scoreMapping - 成绩管理模块
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
        return res.send({success: true, data: result})
    }

    /**
     * 更新成绩
     * @route PUT /api/score/
     * @summary 更新成绩
     * @group scoreMapping - 成绩管理模块
     * @param {Number} stuid.formData - 请输入学生id
     * @param {Number} hwid.formData - 请输入作业id
     * @param {string} score.formData - 请输入成绩
     * @param {string} resultFile.formData - 请输入批改后的文件地址
     * @param {string} stuFile.formData - 请输入学生上传的作业文件地址
     */
    updatescore = async(req, res) => {
        const form = new formidable.IncomingForm()
        const _this = this
        form.parse(req, async function (err, fields, files) {
            const {stuid,hwid,score} = fields
            const stuFile = files.stuFile && files.stuFile.name
            const resultFile = files.resultFile && files.resultFile.name
            const validation = await _this.util.validaRequiredFields({stuid,hwid})
            if(validation !== true){
                return res.send(validation)
            }
            const oldItem = await _this.scoreService.find({stuid,hwid})
            if(oldItem.length){
                console.log('stuFile--->',oldItem[0].stuFile)
                console.log('resultFile--->',oldItem[0].resultFile)
                if(oldItem[0].stuFile){
                    fs.unlink(oldItem[0].stuFile,function(err){
                        if(err){
                            return res.send({success: false, msg: '更新失败'})
                        }
                    })
                }
                if(oldItem[0].resultFile){
                    fs.unlink(oldItem[0].resultFile,function(err){
                        if(err){
                            return res.send({success: false, msg: '更新失败'})
                        }
                    })
                }
            }
            if(stuFile){
                const fname = (new Date()).getTime() + '-' + stuFile
                const uploadDir = path.join(__dirname, '../upload/completion/'+fname);
                fs.rename(files.stuFile.path, uploadDir , async function(err){
                    if(err){
                        console.log(err)
                        return res.send({success: false, msg: '文件上传失败'})
                    }
                    const result = await _this.scoreService.update({stuid,hwid,score,resultFile,stuFile:uploadDir})
                    if(result.errors){
                        return res.send({success: false, error: result.errors}) 
                    }
                    return res.send({success: true, msg: '更新成功'})
                })
            } 
            if(resultFile){
                const fname = (new Date()).getTime() + '-' + resultFile
                const uploadDir = path.join(__dirname, '../upload/completion/'+fname);
                fs.rename(files.resultFile.path, uploadDir , async function(err){
                    if(err){
                        console.log(err)
                        return res.send({success: false, msg: '文件上传失败'})
                    }
                    const result = await _this.scoreService.update({stuid,hwid,score,resultFile,stuFile:uploadDir})
                    if(result.errors){
                        return res.send({success: false, error: result.errors}) 
                    }
                    return res.send({success: true, msg: '更新成功'})
                })
            } 
            if(!stuFile && !resultFile) {
                const result = await _this.scoreService.update({stuid,hwid,score,resultFile,stuFile})
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