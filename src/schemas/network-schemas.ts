// import { CreateUserParams } from "@/services/users-service";
import Joi from "joi";

export const createNetworkSchema = Joi.object({
  title: Joi.string().required(),
  network: Joi.string().required(),
  password: Joi.string().min(10).required(),
});


// <CreateUserParams>