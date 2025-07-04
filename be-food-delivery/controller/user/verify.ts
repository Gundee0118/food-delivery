import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verify = async (request: Request, response: Response) => {
  const { authorization } = request.headers;
  const tokenPassword = "Joker";

  if (!authorization) {
    response.status(401).send({ message: "token is not valid" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const isValid = jwt.verify(token, tokenPassword);
    if (isValid) {
      const destructToken = jwt.decode(token);
      response.send({ destructToken });
      return;
    } else {
      response.status(401).send({ message: "token is not valid" });
      return;
    }
  } catch (err) {
    response.status(401).send({ message: "token is not valid" });
    return;
  }
};
