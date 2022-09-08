var Classgrade = require('../model/classgrade')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class ClassgradeService{
    async findAll(){
        let result
        try {
            result = await Classgrade.findAll()
        } catch(error){
            return error
        }
        return result
    }

    async create({classNum,className}){
        if(classNum && className){
            let result
            try { 
                result = await Classgrade.create({classNum,className})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({id,classNum,className}){
        let result
        if(id || classNum || className){
            id = id || ''
            classNum = classNum || ''
            className = className || ''
            try {
                const params = {
                    id: {[Op.like]: `%${id}%`},
                    classNum: {[Op.like]: `%${classNum}%`},
                    className: {[Op.like]: `%${className}%`},
                }
                result = await Classgrade.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({id,classNum,className}){
        let result
        try {
            result = await Classgrade.update({
                classNum,className
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
            result = await Classgrade.destroy({
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
    service = new ClassgradeService();
  }
  return service;
};