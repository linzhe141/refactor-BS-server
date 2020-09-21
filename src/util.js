const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
class Util{
    /** 验证必填字段
     * @method 验证必填字段
     * @for {Util}
     * @param {Object} 所验证的必填字段对象
     * @return {Boolean} ture表示通过，否则返回那些字段未填写
     */
    async validaRequiredFields(fieldsObj){
        const params = fieldsObj
        const requiredFields = []
        for (const iterator in params) {
            if(params[iterator] == '' || params[iterator] == undefined) {
                requiredFields.push(iterator)
            }
        }
        if(requiredFields.length){
            let result = {success: false, error: requiredFields.join(',') + '为必填项'}
            console.log('\x1B[31m%s\x1B[0m',result)
            return result
        }
        return true
    }

    /** 生成token
     * @method 生成token
     * @for {Util}
     * @param {string} 使用用户名生成token
     * @return {string} 表示创建成功的token
     */
    async generateToken(data){
        let created = Math.floor(Date.now() / 1000)
        let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_private_key.pem'))
        let token = jwt.sign({
            data,
            exp: created + 60 * 30
        }, cert, {algorithm: 'RS256'})
        return token
    }

    /**  验证token
     * @method 验证token
     * @for {Util}
     * @param {string} 前端传递过来的token
     * @return {any} 表示是否验证成功 
     */
    async verifyToken(token){
        let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_public_key.pem'))
        let res
        try {
            let result = jwt.verify(token, cert, {algorithm: ['RS256']}) || {}
            let {exp = 0 } = result, current = Math.floor(Date.now() / 1000)
            if(current <= exp){
                res = result.data || {}
            }
        } catch (error) {
            res = 'err'
        }
        return res
    }
}

let util
module.exports = async function(){
    if(!util){
        util = new Util()
    }
    return util
}