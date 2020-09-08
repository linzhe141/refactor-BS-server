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
        }
        return result
    }

    async create({stuID,stuName,stuAge,stuGender,classID}){
        if(stuID && stuName && stuAge && stuGender　&& classID){
            console.log(stuID,stuName,stuAge,stuGender,classID)
            let result
            try { 
                result = await student.create({stuID,stuName,stuAge,stuGender,classID})
            } catch(error){
                console.log('error-->',error.errors)
                return error
            }
            return result
        }
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