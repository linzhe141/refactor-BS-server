var user = require('../model/user')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class UserService{
    async create({username, password, permissions}){
        if(username && password && permissions){
            let result
            try {
                result = await user.create({username,password,permissions})
            }catch(error){
                console.log('error-->',error)
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
            console.log('error-->',error)
        }
        return result
    }

    async delete({username}){
        let result 
        try {
            result = await user.destroy({
                where: {
                    username
                }
            })
        } catch (error) {
            console.log('error--',error)
        }
        return result
    }

    async update({username,password, permissions}){
        console.log('------>',username,password,permissions)
        let result
        try{
            result = await user.update({
                password:password,
                permissions:permissions
            },
            {
                where: {
                    username: username,
                }
            })
        } catch (error) {
            console.log('error--',error)
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