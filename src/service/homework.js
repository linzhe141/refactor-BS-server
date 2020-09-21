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

    async create({hwName,hwDesc,endDate,hwFile,courseId}){
        if(hwName && endDate && courseId){
            let result
            try { 
                result = await Homework.create({hwName,hwDesc,endDate,hwFile,courseId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,hwName,endDate,courseId}){
        let result
        if(id || hwName || endDate){
            id = id || ''
            hwName = hwName || ''
            endDate = endDate || ''
            courseId = courseId || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    hwName: {[Op.like]: `%${hwName}%`},
                    endDate: {[Op.like]: `%${endDate}%`},
                    courseId: {[Op.like]: `%${courseId}%`},
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

    async update({id,hwName,hwDesc,endDate,hwFile,courseId}){
        let result
        try {
            result = await Homework.update({
                hwName,hwDesc,endDate,hwFile,courseId
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