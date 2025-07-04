import { model, Schema } from "mongoose";
import { User } from "./users.model";

export type Otp ={
    _id:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId, 
    code:string,
    createdAt:Date
 }
 export type OtpPopulated = {
    userId:User;
 }
 const Otp = new Schema<Otp> ({
    code:{type:String, require:true},
    userId:{type:Schema.ObjectId, require:true, ref:"Users"}, 
    createdAt:{type:Date,default:Date.now, expires: 20},
 })
 
 export const OtpModel = model<Otp>("Otp", Otp)