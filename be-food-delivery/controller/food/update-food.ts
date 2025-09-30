import { Request, Response } from "express";
import { FoodModel } from "../../model/food.model";

export const updateFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { foodName, price, category, ingredients, image } = req.body;

    const updatedFood = await FoodModel.findByIdAndUpdate(
      id,
      { foodName, price, category, ingredients, image },
      { new: true }
    );

    if (!updatedFood) {
      res.status(404).send({ message: "Хоол олдсонгүй" });
      return;
    }

    res.status(200).send({
      message: "Хоолны мэдээлэл амжилттай шинэчлэгдлээ",
      food: updatedFood,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send({ message: "Хоолны мэдээлэл шинэчлэхэд алдаа гарлаа" });
  }
};
