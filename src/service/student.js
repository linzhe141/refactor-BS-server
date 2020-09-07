var student = require('../model/student')
var sequelize = require('../../config/sequelize.config')
var Sequelize = require('sequelize')
var Op = Sequelize.Op
class StudentService{
    
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new StudentService();
  }
  return service;
};