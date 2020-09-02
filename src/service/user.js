var user = require('../model/user')
var sequelize = require('../../config/sequelize.config')

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
                result = await user.findAll({
                    where: sequelize.and(
                        username ? `username = ${username}` : null,
                        password ? `password = ${password}` : null,
                        permissions ? `permissions = ${permissions}` : null,
                    )
                })
            } catch (error) {
                console.log('error-->',error)
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

    async adminLogin(){
        le
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