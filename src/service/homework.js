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
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({hwName,hwDesc,endDate,hwFile,type,teacherId}){
        if(hwName && endDate && teacherId){
            let result
            try { 
                result = await Homework.create({hwName,hwDesc,endDate,hwFile, type, teacherId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,hwName,endDate, type, teacherId}){
        let result
        if(id || hwName || endDate || type){
            id = id || ''
            hwName = hwName || ''
            endDate = endDate || ''
            type = type || ''
            teacherId = teacherId || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    hwName: {[Op.like]: `%${hwName}%`},
                    endDate: {[Op.like]: `%${endDate}%`},
                    type: {[Op.like]: `%${type}%`},
                    teacherId: {[Op.like]: `%${teacherId}%`},
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

    async update({id,hwName,hwDesc,endDate,hwFile,type,teacherId}){
        let result
        try {
            result = await Homework.update({
                hwName,hwDesc,endDate,hwFile,type,teacherId
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
    service = new HomeworkService();
  }
  return service;
};