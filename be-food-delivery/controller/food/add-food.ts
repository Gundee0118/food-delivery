import { Request, Response } from "express";
import { FoodModel } from "../../model/food.model";

export const addFood = async(req:Request, res:Response)=>{
    try{
        const {foodName,price, category, ingredients, image}= req.body
        await FoodModel.create({foodName,price, category, ingredients, image})
        res.send({message:"successfully added food"})
    }catch(err){
        res.status(400).send({message:"hoolnii ner davhtsahgui"})
    }
}