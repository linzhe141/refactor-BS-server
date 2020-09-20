const { Router } = require('express')
const classgradeService = require('../service/classgrade')
var util = require('../util')

class ClassGradeController{
    // classgradeService
    async init(){
        this.classgradeService = await classgradeService()
        this.util = await util()
        const router = Router()
        router.get('/classgradeList',this.classgradeList)
        router.post('/',this.createClassgrade)
        router.get('/',this.find)
        router.put('/',this.updateClassgrade)
        router.delete('/',this.deleteClassgrade)
        
        return router
    }
    
    /**
     * 获取所有班级
     * @route GET /api/classgrade/classgradeList
     * @summary 获取所有班级
     * @group class - 班级管理模块
     */
    classgradeList = async(req, res) => {
        const classgradeList = await this.classgradeService.findAll()
        return res.send({success: true, data: classgradeList})
    }

    /**
     * 创建班级
     * @route POST /api/classgrade/
     * @summary 创建班级
     * @group class - 班级管理模块
     * @param {string} classNum.formData - 请输入班级编号
     * @param {string} className.formData - 请输入班级姓名
     */
    createClassgrade = async(req, res) => {
        const {classNum,className} = req.body
        const validation = await this.util.validaRequiredFields({classNum,className})
        if(validation !== true){
            return res.send(validation)
        }
        const newClassgrade = await this.classgradeService.create({classNum,className})
        if(newClassgrade.errors){
            return res.send({success: false, error: newClassgrade.errors}) 
        }
        
        return res.send({success: true, data: newClassgrade})
    }

    /**
     * 查找班级
     * @route GET /api/classgrade/
     * @summary 查找班级
     * @group class - 班级管理模块
     * @param {string} classNum.query - 请输入班级编号
     * @param {string} className.query - 请输入班级名
     */
    find = async(req, res) => {
        let {classNum,className} = req.query
        classNum = classNum || ''
        className = className || ''
        const result = await this.classgradeService.find({classNum,className})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 更新班级
     * @route PUT /api/classgrade/
     * @summary 更新班级
     * @group class - 班级管理模块
     * @param {string} id.formData - 请输入id
     * @param {string} classNum.formData - 请输入班级编号
     * @param {string} className.formData - 请输入班级姓名
     */
    updateClassgrade = async(req, res) => {
        let {id,classNum,className} = req.body 
        const validation = await this.util.validaRequiredFields({id,classNum,className})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.classgradeService.update({id,classNum,className})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除班级
     * @route DELETE /api/classgrade/
     * @summary 删除班级
     * @group class - 班级管理模块
     * @param {Number} id.formData - 请输入id
     */
    deleteClassgrade = async(req, res) => {
        const {id} = req.body
        const classgrade = await this.classgradeService.find({id})
        if(classgrade.length){
            const classid = classgrade[0].id
            const deleteclass = await this.classgradeService.deleteById({id: classid})
            res.send({success: true, data: deleteclass})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new ClassGradeController();
    return await c.init();
};