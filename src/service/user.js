var user = require('../model/user')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class UserService{
    async create({username, password,permissions}){
        if(username && password && permissions){
            let result
            try {
                result = await user.create({username,password,permissions})
            }catch(error){
                console.log('error-->')
                console.log(error)
                console.log('<---------')
            }
            return result
        }
    }

    async find({username, password,permissions}){
        let result
        if(username || password || permissions){
            try {
                console.log('username--->', username)
                console.log('password--->', password)
                console.log('permissions--->', permissions)
                var params = {
                    username: { [Op.like]: `%${username /* ? username: null */}%`},
                    password: { [Op.like]: `%${password/* ? password: null */}%`},
                    permissions: { [Op.like]: `%${permissions /* ? permissions: null */}%`},
                }
                result = await user.findAll({
                    // where: sequeselize.and(
                    //     username ? `username = ${username}` : null,
                    //     password ? `password = ${password}` : null,
                    //     permissions ? `permissions = ${permissions}` : null,
                    // ),
                    where: params
                })
            } catch (error) {
                console.log('error--22>',error)
            }
        }
        return result
    }

    async findAll({username, password}){
        let result
        try {
            result = await user.findAll()
        } catch(error){
            console.log('error-->',error)
        }
        return result
    }

    async adminLogin({username, password}){
        let result 
        try {
            result = await this.find({username, password})
        } catch (error) {
            console.log('error--1>',error)
        }
        return result
    }
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new UserService();
  }
  return service;
};