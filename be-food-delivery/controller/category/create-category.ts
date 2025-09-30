import { Request, Response } from "express";
import { CategoryModel } from "../../model/category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    const newCategory = await CategoryModel.create({ categoryName });
    res.status(200).send({
      message: "successfully created category",
      categories: newCategory,
    });
  } catch (err) {
    res.send({
      message:
        "Category ner davhardsan tul ene nereer oruulah bolomjgui, oor nereer oruulna uu",
    });
  }
};
