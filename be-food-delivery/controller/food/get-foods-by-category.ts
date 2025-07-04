import { Request, Response } from "express";
import { FoodModel } from "../../model/food.model";

export const getFoodsByCategory=async(req:Request, res:Response)=>{
    // const allFoodsByCategory = await FoodModel.find().populate("category")
    // console.log(allFoodsByCategory);

    // res.send({foods:allFoodsByCategory})
    const result = await FoodModel.aggregate([
         {
            $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
        },
        },
        {
            $unwind: "$categoryInfo",
        },
        {
          $group: {
            _id: "$categoryInfo.categoryName",
            foods: {
              $push: {
                _id: "$_id",
                foodName: "$foodName",
                image: "$image",
                price: "$price",
                ingredients: "$ingredients",
              },
            },
          },
        },
      ]);
      const groupedByCategory = result.reduce((acc, item) => {
        acc[item._id] = item.foods;
        return acc;
      }, {});
      res.send({ foods: groupedByCategory });
     
}