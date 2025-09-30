import { Router } from "express";
import { tokenChecker } from "../middleware/token-checker";
import { createCategory } from "../controller/category/create-category";
import { getCategories } from "../controller/category/get-categories";
import { addFood } from "../controller/food/add-food";
import { getFoodsByCategory } from "../controller/food/get-foods-by-category";
import { updateFood } from "../controller/food/update-food";
import { deleteFood } from "../controller/food/delete-food";

export const FoodRouter = Router();
FoodRouter.post("/addFood", tokenChecker, addFood);
FoodRouter.get("/foods", getFoodsByCategory);
FoodRouter.put("/foods/:id", tokenChecker, updateFood);
FoodRouter.delete("/foods/:id", tokenChecker, deleteFood);
