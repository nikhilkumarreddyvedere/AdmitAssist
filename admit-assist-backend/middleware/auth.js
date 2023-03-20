import jwt from 'jsonwebtoken'
import ENV from '../config.js'


export default async function Auth(request, response, next){
    try{
        const token = request.headers.authorization.split(" ")[1]
        const decodedToken = await jwt.verify(token,ENV.JWT_Secret)
        next()
    }
    catch(error){
        response.status(400).json({error: "Authentication failed"})
    }
}