import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import networkService from "@/services/networks-service";

export async function networkPost(req: AuthenticatedRequest, res: Response) {
  const { title, network, password} = req.body;

  const userId = req.userId
  
  try {

    const credential = await networkService.createNetwork( userId, title, network, password);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
      return res.status(httpStatus.CONFLICT).send(error);
  }
}

export async function networkGet(req: AuthenticatedRequest, res: Response) {

    const userId = req.userId
    
    try {
  
      const userCredentials = await networkService.findNetwork(userId);
      return res.status(httpStatus.OK).send(userCredentials)
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function networkGetById(req: AuthenticatedRequest, res: Response) {

    const userId = req.userId
  
    const id = Number(req.params.id)  
  
    try {
      const networkById = await networkService.findNetworkById( userId,id);
      return res.status(httpStatus.OK).send(networkById);
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).send(error);
      }
    }
  
  