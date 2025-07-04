import { Request, Response } from "express"
import { UserModel } from "../../model/users.model"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import { OtpModel, OtpPopulated } from "../../model/otp.model"

export const sendOtp= async (request:Request, response:Response)=>{
    const {email}=request.body
    const isExistingUser = await UserModel.findOne({email})
    
    if(!isExistingUser){
    response.status(401).send({message:"User not found"})
    return
}
    const otp=1234
    const transport= nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:"eternalbeat.89@gmail.com",
            pass:"gvjnooensirdsjkp"
        }
    })
const options = {
    from:"eternalbeat.89@gmail.com",
    to:email,
    subject: "Batalgaajuulah code",

    html:`<div> Batalgaajuulah code: <h2>${otp}</h2></div>`,
}
await OtpModel.create({code:otp,userId:isExistingUser._id})
await transport.sendMail(options)
response.send({message:"otp sent"})
//   const hashedPassword = await bcrypt.compareSync( password, isEmailExtisted.password!)
//     if(hashedPassword){
//             const tokenPassword="Joker"
//             const token = jwt.sign({userId: isEmailExtisted._id}, tokenPassword)
//             response.send({message:"successfully log in", token})
//             return
//     }else{
//             response.status(401).send({message:"email or password not matching"})
//             return
        }
export const checkOtp= async (request:Request, response:Response)=>{
    const{code, email}= request.body
    try{
        const isOtpExisting = await OtpModel.findOne({code}).populate<OtpPopulated>("userId")
        if(!isOtpExisting){
            response.status(400).send("wrong code")
            return
        }
        if(email===isOtpExisting?.userId?.email){
            response.status(200).send({message:"success"})
            return
        }
        response.status(400).send({message:"wrong otp"})
        return
    }
    catch(err){
        response.status(400).send("aldaa")
    }
}
export const updatePassword= async (request:Request, response:Response)=>{
    const{password, email}= request.body
    const isEmailExtisted= await UserModel.findOne({email})
    if(!isEmailExtisted){
        response.status(404).send({message:"user not found"})
        return
    }
    const hashedPassword = await bcrypt.hashSync(password, 10)

    await UserModel.findOneAndUpdate({email}, {password:hashedPassword})
    response.send({message:"Successfully updated password"})
}