import { Request, Response } from "express";
import { CategoryModel } from "../../model/category";

export const getCategories = async(_request:Request, res:Response)=>{
    try{
        const allCategories = await CategoryModel.find()
        res.send({categories:allCategories})
    }catch(err){
        res.status(400).send({message:"database holboltod aldaa garlaa"})
    }
}