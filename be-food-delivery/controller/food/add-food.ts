import { Request, Response } from "express";
import { FoodModel } from "../../model/food.model";
import { io } from "../../index";

export const addFood = async(req:Request, res:Response)=>{
    try{
        const {foodName,price, category, ingredients, image}= req.body
        const newFood = await FoodModel.create({foodName,price, category, ingredients, image})
        
        // Real-time notification to all clients
        io.emit("foodAdded", newFood);
        
        res.send({message:"successfully added food"})
    }catch(err){
        res.status(400).send({message:"hoolnii ner davhtsahgui"})
    }
}