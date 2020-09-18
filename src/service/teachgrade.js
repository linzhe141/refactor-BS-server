var TeachGradeMapping = require('../model/teachgradeMappling')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class TeachGradeMappingService{
    async findAll(){
        let result
        try {
            result = await TeachGradeMapping.findAll()
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({tchId,classgradeId}){
        if(tchId && classgradeId){
            let result
            try { 
                result = await TeachGradeMapping.create({tchId,classgradeId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({tchId,classgradeId}){
        let result
        if(tchId || classgradeId){
            tchId = tchId || ''
            classgradeId = classgradeId || ''
            try {
                const params = {
                    tchId: {[Op.like]: `%${tchId}%`},
                    classgradeId: {[Op.like]: `%${classgradeId}%`},
                }
                result = await TeachGradeMapping.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({tchId, classgradeId}){
        let result
        try {
            result = await TeachGradeMapping.update({
                classgradeId
            },
            {
                where: {tchId}
            })
        } catch (error) {   
            return error
        }
        return result
    }

    async delete({tchId,classgradeId}){
        let result 
        try {
            result = await TeachGradeMapping.destroy({
                where: {
                    tchId,classgradeId
                }
            })
        } catch (error) {
            console.log('error--',error)
            return error
        }
        return result
    }
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new TeachGradeMappingService();
  }
  return service;
};