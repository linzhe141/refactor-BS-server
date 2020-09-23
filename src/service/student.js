var student = require('../model/student')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class StudentService{
    async findAll(){
        let result
        try {
            result = await student.findAll()
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({stuNum,stuName,stuAge,stuGender, classgradeId}){
        if(stuNum && stuName && stuAge && stuGender　&& classgradeId){
            let result
            try { 
                result = await student.create({stuNum,stuName,stuAge,stuGender, classgradeId})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,stuNum,stuName,stuAge,stuGender,userId, classgradeId}){
        let result
        if(id || stuNum || stuName || stuAge || stuGender || userId || classgradeId){
            id = id || ''
            stuNum = stuNum || ''
            stuName = stuName || ''
            stuAge = stuAge || ''
            stuGender = stuGender || ''
            userId = userId || ''
            classgradeId = classgradeId || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    stuNum: {[Op.like]: `%${stuNum}%`},
                    stuName: {[Op.like]: `%${stuName}%`},
                    stuAge: {[Op.like]: `%${stuAge}%`},
                    stuGender: {[Op.like]: `%${stuGender}%`},
                    userId: {[Op.like]: `%${userId}%`},
                    classgradeId: {[Op.like]: `%${classgradeId}%`}
                }
                result = await student.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({id,stuNum,stuName,stuAge,stuGender, classgradeId}){
        let result
        try {
            result = await student.update({
                stuNum,stuName,stuAge,stuGender, classgradeId
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
            result = await student.destroy({
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
    service = new StudentService();
  }
  return service;
};