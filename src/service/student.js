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

    async create({stuID,stuName,stuAge,stuGender/* ,classID */}){
        if(stuID && stuName && stuAge && stuGender　/* && classID */){
            let result
            try { 
                result = await student.create({stuID,stuName,stuAge,stuGender/* ,classID */})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({stuID,stuName,stuAge,stuGender/* ,classID */}){
        let result
        if(stuID || stuName || stuAge || stuGender /* || classID */){
            stuID = stuID || ''
            stuName = stuName || ''
            stuAge = stuAge || ''
            stuGender = stuGender || ''
            try {
                const params = {
                    stuID: {[Op.like]: `%${stuID}%`},
                    stuName: {[Op.like]: `%${stuName}%`},
                    stuAge: {[Op.like]: `%${stuAge}%`},
                    stuGender: {[Op.like]: `%${stuGender}%`},
                    /* classID: {[Op.like]: `%${classID}%`} */
                }
                console.log(params)
                result = await student.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({stuID,stuName,stuAge,stuGender/* ,classID */}){
        let result
        try {
            result = await student.update({
                stuName,stuAge,stuGender/* ,classID */
            },
            {
                where: {stuID}
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