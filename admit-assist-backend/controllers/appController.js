import userModel, { UserSchema } from "../model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import multer from 'multer'

export async function register(request, response){
    try{
        const {username, password, email} = request.body
        //Check the exisitng username
        const existUserName = new Promise((resolve, reject) => 
        {
            userModel.findOne({username}).then(function(user){
                if(user) reject("please use unique username")
                resolve()
            })
        })
        // check for exisitng email
        const existEmail = new Promise((resolve, reject) => 
        {
            userModel.findOne({email}).then(function(email){
                if(email) reject("please use unique email")
                resolve()
            })
        }) 
        Promise.all([existUserName,existEmail]).then(
            ()=>{
                if(password){
                    bcrypt.hash(password,10).then(
                        hashedPassword => {
                            const user = new userModel({
                                username,
                                password: hashedPassword,
                                email: email
                            })
                            user.save()
                            .then(result => response.status(201).send({ msg: "User Register Successfully"}))
                            .catch(error => response.status(500).send({error}))
                        }
                    ).catch(error => {
                        return response.status(500).send({
                            error:"unable to hash password"
                        })
                    })
                }
            }).catch(error => {
                return response.status(500).send({ error })
            })
    }catch(error){
       return response.status(500).send(error)
    }
}

export async function login(request,response){
   const {username,password} = request.body
   try{
    userModel.findOne({username}).then(user => {
        if(user.username){
            bcrypt.compare(password,user.password).then(passwordCheck =>{
                if(!passwordCheck) return response.status(400).send("invalid password")
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username
                },ENV.JWT_Secret, {expiresIn: "24h"})
    
                return response.status(200).send({
                    msg: "login successful",
                    username: user.username,
                    token
                })
            })
        }else{
            return response.status(400).send("user not found")
        }
    }).catch(error => {
        return response.status(500).send({error: "username does not exist"})
    })
   }catch(error){
     return response.status(500).send({error})
   }
}

export async function getUserDetails(request, response){
    const {username} = request.params
    try{
        if(!username) return response.status(501).send({error: "invalid username"})
        userModel.findOne({username}).then((user, error)=>{
             if(error) return response.status(500).send({error})
             if(!user) return response.status(501).send({error: "couldn't find user"})
             const {password, ...rest} = Object.assign({}, user.toJSON())
             return response.status(201).send(rest)
        })
    }
    catch{
        return response.status(404).send({error: "cannot find user data"})
    }
}

export async function updateUserDetails(request,response){
    const {username} = request.body
    try{
        if(!username){
            return response.status(400).send("invalid user name")
        }
        userModel.updateOne({username:username}, request.body).then((data) => {
            return response.status(200).send({msg: "user data updated successfully"})
        })
    }
    catch(error){
        return response.status(500).send({error:"failed updating user data"})
    }
}

export async function uploadStudentMaterial(request,response){
    try{
        response.status(200).json({
            status:'success',
            message:'file uploaded successfully'
        })
    }
    catch(error){
        response.status(500).send({error: "file upload failed"})
    }
}