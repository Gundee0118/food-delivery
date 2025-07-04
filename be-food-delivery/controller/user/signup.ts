import { Request, Response } from "express"
import { UserModel } from "../../model/users.model"
import bcrypt from "bcrypt"

 export const signUp = async(request:Request, response:Response)=>{
    const {email, password}=request.body
    const isEmailExtisted = await UserModel.findOne({email})
    if(!isEmailExtisted){
        const hashedPassword = await bcrypt.hashSync(password,10)
        await UserModel.create({email, password:hashedPassword})

        response.send({message:"successfully registered"})
        return
    }
    response.status(400).send({message:"user already existed"})
}