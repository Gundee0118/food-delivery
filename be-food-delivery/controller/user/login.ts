import { Request, Response } from "express"
import { UserModel } from "../../model/users.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const login =async (request:Request, response:Response)=>{
    const {email, password}= request.body
    const isEmailExtisted = await UserModel.findOne({email})
    if(!isEmailExtisted){
        response.status(400).send({message:"user doesn't existed"})
        return
    }
    const hashedPassword = await bcrypt.compareSync( password, isEmailExtisted.password!)
    if(hashedPassword){
            const tokenPassword="Joker"
            const token = jwt.sign({
                userId: isEmailExtisted._id, 
                isAdmin:isEmailExtisted.role=== "ADMIN" ? true:false}, tokenPassword)
            response.send({message:"successfully log in", token})
            return
    }else{
            response.status(401).send({message:"email or password not matching"})
            return
        }
    }