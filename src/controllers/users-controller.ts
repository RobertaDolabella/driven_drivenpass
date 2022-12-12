import userService from "@/services/users-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function userCreate(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    await userService.createUser({ email, password });
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.status(httpStatus.CONFLICT).send(error);
  }
}

export async function userLogIn(req: Request, res: Response) {

  const { email, password } = req.body;
  try {
    const token  = await userService.logUserIn(email, password);

    return res.status(httpStatus.OK).send(token)
  } catch (error) {
    if (error.name === "InvalidCredentialsError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

