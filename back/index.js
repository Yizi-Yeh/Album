import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo';
import cors from 'cors'
import session from 'express-session'

// 環境變數套件
dotenv.config()

mongoose.connect(process.env.DBURL,{ useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

app.use(bodyParser.json())

// 跨域設定
app.use(cors({
    origin(origin,callback){
        // undefined是後端測試時
        // 如果是 Postman 允許
        // 後端 === undefined
        if(origin === undefined) {
            callback(null,true)
        } else {
            // 利用 CORS 判斷 true or false
            if (process.env.DEV === 'true'){
                callback(null,true)
                // origin 是否從 github來的？
                // String.prototype.includes()
            } else if (origin.includes('github')){
                callback(null,true)
            } else {
                // 如果都不是，拋出 error
                callback(new Error('Not allowed'),false)
            }
        }
    },
    // 附帶身份驗證的請求
    // cookie 並不能跨域傳遞，也就是說不同 origin 中的 cookie 沒辦法互相傳遞及存取。
    // credentials：配置Access-Control-Allow-Credentials CORS 標頭。
    credentials:true
}))

const MongoStore = connectMongo(session);

const sessionSettings = {
    secret: 'album',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 1000 * 60 * 30
    },
    saveUninitialized: false,
    rolling: true,
    resave: true
  }


if(process.env.DEV === 'false') {
    // 如果不是本機的開發環境，允許不同網域的認證cookie
    // sameSite => cookie需要在同個網域
    sessionSettings.cookie.sameSite = 'none'
    // 若sameSite，設為none，secure必須為true
    // 允許不同網域的認證，但一定需要https
    sessionSettings.cookie.secure = true 
}

app.use(session(sessionSettings))

// 部署 heroku 的設定
app.set('trust proxy',1)

app.listen(process.env.PORT,() =>{
    console.log('server started')
})




