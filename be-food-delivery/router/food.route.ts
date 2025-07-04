import { Router } from "express";
import { tokenChecker } from "../middleware/token-checker";
import { createCategory } from "../controller/category/create-category";
import { getCategories } from "../controller/category/get-categories";
import { addFood } from "../controller/food/add-food";
import { getFoodsByCategory } from "../controller/food/get-foods-by-category";

export const FoodRouter = Router()
FoodRouter.post("/addFood", tokenChecker, addFood)
FoodRouter.get("/foods", getFoodsByCategory)