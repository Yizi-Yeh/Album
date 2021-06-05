import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo'
import cors from 'cors'
import session from 'express-session'

dotenv.config()

mongoose.connect(process.env.DBURL)

const app = express()

app.use(bodyParser.json())

// 跨域設定
app.use(cors({
    origin(origin,callback){
        // undefined是後端測試時
        // 如果是 postman 允許
        if(origin === undefined) {
            callback(null,true)
        } else {
            if (process.env.CORS === 'true'){
                callback(null,true)
                // origin 是否從 github來的？
            } else if (origin.includes('github')){
                callback(null,true)
            } else {
                // 如果都不是，擋住
                callback(new Error('Not allowed'),false)
            }
        }
    }
}))

app.listen(process.env.PORT,() =>{
    console.log('server started')
})