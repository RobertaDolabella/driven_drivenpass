import credentialService from "../services/credentials-service"
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function credentialPost(req: AuthenticatedRequest, res: Response) {
  const { title, username, url, password} = req.body;

  const userId = req.userId
  
  try {

    const credential = await credentialService.createCredential( userId, title, username, url, password);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
      return res.status(httpStatus.CONFLICT).send(error);
  }
}

export async function credentialGet(req: AuthenticatedRequest, res: Response) {

  const userId = req.userId
  
  try {

    const userCredentials = await credentialService.findCredential(userId);
    return res.status(httpStatus.OK).send(userCredentials)
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}


export async function credentialGetById(req: AuthenticatedRequest, res: Response) {

  const userId = req.userId

  const id = Number(req.params.id)  

  try {
    const credentialById = await credentialService.findCredentialById( userId,id);
    return res.status(httpStatus.OK).send(credentialById);
  } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
  }


