import md5 from 'md5'
import users from '../models/users.js'


export const create = async (req,res) =>{
    // 如果沒有 headers的 content-type
    if(!req.headers['content-type'] && !req.headers['content-type'].includes('application/json')){
        res.status(400).send({success: false, message: '資料格式不符'})
        return 
    }
    try {
       if(req.body.password.length <= 4 || req.body.password.length >= 20) {
        res.status(400).send({success: false, message:'密碼必須四字以上'})
       } else {
           await users.create({
               account:req.body.account,
               password:md5(req.body.password)
           })
           res.status(200).send({ success:true, message:''})
       }
    } catch { (errror)
        if(error.name === 'ValidationError'){
            const key = Object.keys(error.errors)[0]
            const message = error.errors[key].message
            res.status(400).send({ success:false, message})
        } else{
            res.status(500)
            res.send({success:false, message:'伺服器錯誤'})
        }
    }
}  


export const login = async (req,res) =>{
    if(!req.headers['content-type'] || req.headers['content-type'].includes('application/json')){
        res.status(400).send({ success: false, message:'資料格式不符'})
        return 
    }
    try {
        const result = await users.findOne({
            account: req.body.account,
            password:md5(req.body.password)
        })
            // 找不到
        if ( result.length === null){
            res.status(404).send({success:false,message:'帳號或密碼錯誤'})
        }   else{
            // 成功登入者給予session
            // 用户界面用if(req.session.user)来判断是否登入，
            req.session.user = result
            req.status(200).send({ success:true,message:''})
        }
    } catch (error) {
        if(error.name === 'ValidationError'){
            const key = Object.keys(error.errors)[0]
            const message = error.errors[key].message
            res.status(400).send({ success:false, message})
        } else{
            res.status(500)
            res.send({success:false, message:'伺服器錯誤'})
        }
    }
} 



export const logout = async (req,res) =>{
    req.session.destroy(error=>{
        if(error){
            res.status(500).send({ success:false,message:'伺服器錯誤'})
        }
        else {
            res.clearCookie()
            res.status(200).send({ success:true, message:''})
        }
    })
} 



export const heartbeat = async (req,res) =>{
    let isLogin = false
    if(req.session.user !== undefined){
        isLogin = true
    }
    res.status(200).send(isLogin)
} 