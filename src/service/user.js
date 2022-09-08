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
                return error
            }
            return result
        } 
    }

    async find({id,username, password,permissions}){
        let result
        if(id || username || password || permissions){
            id = id || ''
            username = username || ''
            password = password || ''
            permissions = permissions || ''
            try {
                var params = {
                    id: { [Op.like]: `%${id /* ? username: null */}%`},
                    username: { [Op.like]: `%${username /* ? username: null */}%`},
                    password: { [Op.like]: `%${password /* ? password: null */}%`},
                    permissions: { [Op.like]: `%${permissions /* ? permissions: null */}%`},
                }
                result = await User.findAll({
                    where: params
                })
            } catch (error) {
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
            return error
        }
        return result
    }

    async adminLogin({username, password}){
        let result 
        try {
            result = await this.find({username, password})
        } catch (error) {
            return error
        }
        return result
    }

    async delete({id}){
        let result 
        try {
            result = await User.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
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
            return error
        }
        return result
    }

    async update({id,username,password, permissions}){
        let result
        try{
            result = await User.update({
                username: username,
                password:password,
                permissions:permissions,
            },
            {
                where: {
                    id: id,
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