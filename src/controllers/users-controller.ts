import userService from "@/services/users-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function usersPost(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await userService.createUser({ email, password });
    return res.status(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function usersGet(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const token  = await userService.logUserIn(email, password);
    return res.status(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "InvalidCredentialsError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

