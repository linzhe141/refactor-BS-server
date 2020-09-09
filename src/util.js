class Util{
    async validaRequiredFields(fieldsObj){
        const params = fieldsObj
        const requiredFields = []
        for (const iterator in params) {
            if(params[iterator] == '') {
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
}

let util
module.exports = async function(){
    if(!util){
        util = new Util()
    }
    return util
}