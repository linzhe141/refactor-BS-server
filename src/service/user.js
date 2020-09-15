var User = require('../model/user')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class UserService{
    async create({username, password, permissions}){
        if(username && password && permissions){
            let result
            try {
                result = await User.create({username,password,permissions})
            }catch(error){
                console.log('error--1231',error)
                return error
            }
            return result
        } 
    }

    async find({username, password,permissions}){
        let result
        if(username || password || permissions){
            username = username || ''
            password = password || ''
            permissions = permissions || ''
            try {
                var params = {
                    username: { [Op.like]: `%${username /* ? username: null */}%`},
                    password: { [Op.like]: `%${password /* ? password: null */}%`},
                    permissions: { [Op.like]: `%${permissions /* ? permissions: null */}%`},
                }
                result = await User.findAll({
                    where: params
                })
            } catch (error) {
                console.log('error-->',error)
                return error
            }
        }
        return result
    }

    async findAll(){
        let result
        try {
            result = await User.findAll()
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async adminLogin({username, password}){
        console.log('login',username,password)
        let result 
        try {
            result = await this.find({username, password})
        } catch (error) {
            console.log('error-->',error)
            return error
        }
        return result
    }

    async delete({username}){
        let result 
        try {
            result = await User.destroy({
                where: {
                    username
                }
            })
        } catch (error) {
            console.log('error--',error)
            return error
        }
        return result
    }

    async deleteById({id}){
        let result 
        try {
            result = await User.destroy({
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

    async update({username,password, permissions}){
        let result
        try{
            result = await User.update({
                password:password,
                permissions:permissions
            },
            {
                where: {
                    username: username,
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
    service = new UserService();
  }
  return service;
};