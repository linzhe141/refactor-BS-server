var Score = require('../model/score')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class ScoreService{
    async findAll(){
        let result
        try {
            result = await Score.findAll()
        } catch(error){
            console.log('error-->',error)
            return error
        }
        return result
    }

    async create({stuid,hwid,score,resultFile}){
        console.log('Create---->')
        if(stuid && hwid){
            let result
            try { 
                result = await Score.create({stuid,hwid,score,resultFile})
            } catch(error){
                return error
            }
            return result
        }
    }

    async find({stuid,hwid,score}){
        let result
        if(stuid || hwid){
            stuid = stuid || ''
            hwid = hwid || ''
            score = score || ''
            try {
                const params = {
                    stuid: {[Op.like]: `%${stuid}%`},
                    hwid: {[Op.like]: `%${hwid}%`},
                    score: {[Op.like]: `%${score}%`},
                }
                result = await Score.findAll({
                    where: params
                })
            } catch (error) {
                return error
            }
            return result
        }
    }

    async update({stuid, hwid, score, resultFile}){
        let result
        try {
            result = await Score.update({
                score, resultFile
            },
            {
                where: {stuid, hwid}
            })
        } catch (error) {   
            return error
        }
        return result
    }

    async delete({stuid, hwid}){
        let result 
        try {
            result = await Score.destroy({
                where: {
                    stuid, hwid
                }
            })
        } catch (error) {
            console.log('error--',error)
            return error
        }
        return result
    }

    async deleteByStuid({stuid}){
        let result 
        try {
            result = await Score.destroy({
                where: {
                    stuid
                }
            })
        } catch (error) {
            console.log('error--',error)
            return error
        }
        return result
    }

    async deleteByHwid({hwid}){
        let result 
        try {
            result = await Score.destroy({
                where: {
                    hwid
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
    service = new ScoreService();
  }
  return service;
};