import { Router } from "express";
import { tokenChecker } from "../middleware/token-checker";
import { createCategory } from "../controller/category/create-category";
import { getCategories } from "../controller/category/get-categories";

export const CategoryRouter = Router()
CategoryRouter.post("/addCategory", tokenChecker, createCategory)
CategoryRouter.get("/Categories", getCategories)