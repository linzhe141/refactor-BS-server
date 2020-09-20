var Course = require('../model/course')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class CourseService{
    async findAll(){
        let result
        try {
            result = await Course.findAll()
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({courseNum,courseName}){
        if(courseNum && courseName){
            let result
            try { 
                result = await Course.create({courseNum,courseName})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,courseNum,courseName}){
        let result
        if(id || courseNum || courseName){
            id = id || ''
            courseNum = courseNum || ''
            courseName = courseName || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    courseNum: {[Op.like]: `%${courseNum}%`},
                    courseName: {[Op.like]: `%${courseName}%`},
                }
                result = await Course.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({id,courseNum,courseName}){
        let result
        try {
            result = await Course.update({
                courseNum,courseName
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
            result = await Course.destroy({
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
    service = new CourseService();
  }
  return service;
};