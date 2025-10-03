import { Request, Response } from "express";
import { FoodModel } from "../../model/food.model";
import { io } from "../../index";

export const deleteFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedFood = await FoodModel.findByIdAndDelete(id);

    if (!deletedFood) {
      res.status(404).send({ message: "Хоол олдсонгүй" });
      return;
    }

    // Real-time notification to all clients
    io.emit("foodDeleted", { _id: id });

    res.status(200).send({
      message: "Хоол амжилттай устгагдлаа",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Хоол устгахад алдаа гарлаа" });
  }
};
