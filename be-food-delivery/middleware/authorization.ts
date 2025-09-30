import { NextFunction, Request, Response } from "express";
import { UserModel, UserRolerEnum } from "../model/users.model";
export const isAdmin = async (
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userId } = response.locals;

  try {
    const user = await UserModel.findById({ _id: userId });
    // console.log(user, "useruser");
    if (!user) {
      response.status(404).send({ message: "user doesnt exist" });
      return;
    }
    if (user.role === UserRolerEnum.ADMIN) {
      next();
      return;
    }
    response.status(401).send({ messaege: "Unauthorized user" });
    return;
  } catch (err) {
    response.status(401).send({ message: "something  went wrong" });
    return;
  }
};
