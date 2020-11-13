var Homework = require('../model/homework')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class HomeworkService{
    async findAll(){
        let result
        try {
            result = await Homework.findAll()
        } catch(error){
            return error
        }
        return result
    }

    async create({hwName,hwDesc,endDate,hwFile,type,teacherId,classgradeId}){
        if(hwName && endDate && teacherId){
            let result
            try { 
                result = await Homework.create({hwName,hwDesc,endDate,hwFile, type, teacherId,classgradeId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,hwName,endDate, type, teacherId,classgradeId}){
        let result
        if(id || hwName || endDate || type || classgradeId){
            id = id || ''
            hwName = hwName || ''
            endDate = endDate || ''
            type = type || ''
            teacherId = teacherId || ''
            classgradeId = classgradeId || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    hwName: {[Op.like]: `%${hwName}%`},
                    endDate: {[Op.like]: `%${endDate}%`},
                    type: {[Op.like]: `%${type}%`},
                    teacherId: {[Op.like]: `%${teacherId}%`},
                    classgradeId: {[Op.like]: `%${classgradeId}%`},
                }
                result = await Homework.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({id,hwName,hwDesc,endDate,hwFile,type,teacherId,classgradeId}){
        let result
        try {
            result = await Homework.update({
                hwName,hwDesc,endDate,hwFile,type,teacherId,classgradeId
            },
            {
                where: {id}
            })
        } catch (error) {   
            return error
        }
        return result
    }

    async deleteById({id}){
        let result 
        try {
            result = await Homework.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
            return error
        }
        return result
    }
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new HomeworkService();
  }
  return service;
};