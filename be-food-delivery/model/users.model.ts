import { model, Schema } from "mongoose"
export enum UserRolerEnum{
    ADMIN = "ADMIN",
    USER= "USER"
}

export type User={
    email:string,
    _id:Schema.Types.ObjectId,
    password:string,

    phoneNumber?:string,
    address?:string,
    isVerified?:boolean,
    role?:UserRolerEnum,

    createdAt:Date,
    updatedAt:Date
}
const Users= new Schema<User>({
    email:{type:String, required:true},
    password:{type:String, required:true},

    phoneNumber:{type:String, required:false},
    address:{type:String, required:false},
    role:{type: String, enum: ["USER", "ADMIN"], default: "USER", required:false},
    isVerified:{type:Boolean, required:false},

    createdAt:{type:Date,default:Date.now, immutable:true},
    updatedAt:{type:Date,default:Date.now}, 
})
Users.index({email:1},{unique:true})
export const UserModel = model<User>("Users", Users)