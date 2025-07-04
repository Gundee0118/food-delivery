import { model, Schema } from "mongoose";

export type categoryType={
    categoryName:string;
    createdAt:Date;
    updatedAt:Date;
}
const CategorySchema= new Schema<categoryType>({
    categoryName:{type:String, required:true},

    createdAt:{type:Date,default:Date.now, immutable:true},
    updatedAt:{type:Date,default:Date.now}, 
})
CategorySchema.index({categoryName:1},{unique:true})
export const CategoryModel = model<categoryType>("categories", CategorySchema)