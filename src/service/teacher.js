var Teacher = require('../model/teacher')
var Classgrade = require('../model/classgrade')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class TeacherService{
    async findAll(){
        let result
        try {
            result = await Teacher.findAll({
                include: {
                    model: Classgrade
                }
            })
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({tchNum,tchName, tchAge, tchGender, courseId}){
        if(tchNum && tchName && tchAge && tchGender && courseId){
            let result
            try { 
                result = await Teacher.create({tchNum,tchName, tchAge, tchGender, courseId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,tchNum,tchName, tchAge, tchGender, userId,courseId}){
        let result
        if(id || tchNum || tchName || tchAge || tchGender || userId || courseId){
            id = id || ''
            tchNum = tchNum || ''
            tchName = tchName || ''
            tchAge = tchAge || ''
            tchGender = tchGender || ''
            userId = userId || ''
            courseId = courseId || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    tchNum: {[Op.like]: `%${tchNum}%`},
                    tchName: {[Op.like]: `%${tchName}%`},
                    tchAge: {[Op.like]: `%${tchAge}%`},
                    tchGender: {[Op.like]: `%${tchGender}%`},
                    userId: {[Op.like]: `%${userId}%`},
                    courseId: {[Op.like]: `%${courseId}%`}
                }
                result = await Teacher.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({id, tchNum,tchName, tchAge, tchGender,courseId}){
        let result
        try {
            result = await Teacher.update({
                tchNum,tchName, tchAge, tchGender,courseId
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
            result = await Teacher.destroy({
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
    service = new TeacherService();
  }
  return service;
};