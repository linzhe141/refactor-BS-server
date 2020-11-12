const { Router } = require('express')
const teachgradeService = require('../service/teachgrade')
const classgradeService = require('../service/classgrade')
var util = require('../util')

class TeachgradeController{
    // teachgradeService
    async init(){
        this.teachgradeService = await teachgradeService()
        this.classgradeService = await classgradeService()
        this.util = await util()
        const router = Router()
        router.get('/teachgradeList',this.teachgradeList)
        router.post('/',this.createTeachgradeMapping)
        router.get('/',this.find)
        router.put('/',this.updateTeachgradeMapping)
        router.delete('/',this.deleteTeachgradeMapping)
        
        return router
    }
    
    /**
     * 获取所有授课关系
     * @route GET /api/teachgrade/teachgradeList
     * @summary 获取所有授课关系
     * @group teachgradeMapping - 授课管理模块
     */
    teachgradeList = async(req, res) => {
        const teachgradeList = await this.teachgradeService.findAll()
        return res.send({success: true, data: teachgradeList})
    }

    /**
     * 创建授课关系
     * @route POST /api/teachgrade/
     * @summary 创建授课关系
     * @group teachgradeMapping - 授课管理模块
     * @param {Number} tchId.formData - 请输入教工id
     * @param {Number} classgradeId.formData - 请输入班级id
     */
    createTeachgradeMapping = async(req, res) => {
        const {tchId,classgradeId} = req.body
        const validation = await this.util.validaRequiredFields({tchId,classgradeId})
        if(validation !== true){
            return res.send(validation)
        }
        const newTeachgradeMapping = await this.teachgradeService.create({tchId,classgradeId})
        if(newTeachgradeMapping.errors){
            return res.send({success: false, error: newTeachgradeMapping.errors}) 
        }
        
        return res.send({success: true, data: newTeachgradeMapping})
    }

    /**
     * 查找授课关系
     * @route GET /api/teachgrade/
     * @summary 查找授课关系
     * @group teachgradeMapping - 授课管理模块
     * @param {Number} tchId.query - 请输入教工id
     * @param {Number} classgradeId.query - 请输入班级id
     */
    find = async(req, res) => {
        let {tchId,classgradeId} = req.query
        tchId = tchId || ''
        classgradeId = classgradeId || ''
        const result = await this.teachgradeService.find({tchId,classgradeId})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        const data = []
        for(let item of result){
            const value = (await this.classgradeService.find({id:item.classgradeId}))[0] 
            data.push({
                id:value.id,
                classNum: value.classNum,
                className: value.className,
            }) 
        }
        return res.send({success: true, data: data})
    }

    /**
     * 更新授课关系
     * @route PUT /api/teachgrade/
     * @summary 更新授课关系
     * @group teachgradeMapping - 授课管理模块
     * @param {Number} tchId.formData - 请输入教工id
     * @param {Number} classgradeId.formData - 请输入班级id
     */
    updateTeachgradeMapping = async(req, res) => {
        let {tchId,classgradeId} = req.body 
        const validation = await this.util.validaRequiredFields({tchId,classgradeId})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.teachgradeService.update({tchId,classgradeId})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除授课关系
     * @route DELETE /api/teachgrade/
     * @summary 删除授课关系
     * @group teachgradeMapping - 授课管理模块
     * @param {Number} tchId.formData - 请输入教工id
     * @param {Number} classgradeId.formData - 请输入班级id
     */
    deleteTeachgradeMapping = async(req, res) => {
        const {tchId,classgradeId} = req.body
        const teachgradeMapping = await this.teachgradeService.find({tchId,classgradeId})
        if(teachgradeMapping.length){
            const deleteteachgradeMapping = await this.teachgradeService.delete({tchId,classgradeId})
            res.send({success: true, data: deleteteachgradeMapping})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new TeachgradeController();
    return await c.init();
};