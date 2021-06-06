import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema =  new Schema({
    account:{
        type:String,
        minlength:[4,'帳號必須四個字以上'],
        maxlength:[20,'帳號必須二十個字以下'],
        unique:'帳號已使用',
        requied:'帳號必填'
    },
    password:{
        type:String,
        requied:[true,'請輸入密碼']
    }
})

const users = mongoose.model('users',userSchema)

export default users 