import express from 'express'
import cors from 'cors'
import connect from './database/connection.js'
import router from './router/route.js';

const app = express();
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{})

app.use('/api', router)


connect().then(() =>{
    try{
      app.listen(3000)
    }catch(error){
        console.log("cannot conenct to the server")
    }
})