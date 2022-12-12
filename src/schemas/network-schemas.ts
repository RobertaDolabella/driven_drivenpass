import { CreateNetworkParams} from "@/services"
import Joi from "joi";

export const createNetworkSchema = Joi.object<CreateNetworkParams>({
  title: Joi.string().required(),
  network: Joi.string().required(),
  password: Joi.string().min(10).required(),
});


// <CreateUserParams>