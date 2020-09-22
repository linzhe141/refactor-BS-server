const { Router } = require('express')
const scoreService = require('../service/score')
var util = require('../util')

class ScoreController{
    // scoreService
    async init(){
        this.scoreService = await scoreService()
        this.util = await util()
        const router = Router()
        router.get('/scoreList',this.scoreList)
        router.post('/',this.createscore)
        router.get('/',this.find)
        router.put('/',this.updatescore)
        router.delete('/',this.deletescore)
        
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
     * 创建成绩
     * @route POST /api/score/
     * @summary 创建成绩
     * @group scoreMapping - 成绩管理模块
     * @param {Number} stuid.formData - 请输入学生id
     * @param {Number} hwid.formData - 请输入作业id
     * @param {string} score.formData - 请输入成绩
     * @param {string} resultFile.formData - 请输入批改后的文件地址
     */
    createscore = async(req, res) => {
        const {stuid,hwid,score,resultFile} = req.body
        const validation = await this.util.validaRequiredFields({stuid,hwid,score,resultFile})
        if(validation !== true){
            return res.send(validation)
        }
        const newscore = await this.scoreService.create({stuid,hwid,score,resultFile})
        if(newscore.errors){
            return res.send({success: false, error: newscore.errors}) 
        }
        
        return res.send({success: true, data: newscore})
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
     */
    updatescore = async(req, res) => {
        let {stuid,hwid,score,resultFile} = req.body 
        const validation = await this.util.validaRequiredFields({stuid,hwid,score,resultFile})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.scoreService.update({stuid,hwid,score,resultFile})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除成绩
     * @route DELETE /api/score/
     * @summary 删除成绩
     * @group scoreMapping - 成绩管理模块
     * @param {Number} stuid.formData - 请输入学生id
     * @param {Number} hwid.formData - 请输入作业id
     */
    deletescore = async(req, res) => {
        const {stuid,hwid} = req.body
        const scoreMapping = await this.scoreService.find({stuid,hwid})
        if(scoreMapping.length){
            const deletescoreMapping = await this.scoreService.delete({stuid,hwid})
            res.send({success: true, data: deletescoreMapping})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new ScoreController();
    return await c.init();
};