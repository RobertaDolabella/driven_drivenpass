import { CreateCredentialParams } from "@/services/credentials-service";
import Joi from "joi";

export const createCredentialSchema = Joi.object<CreateCredentialParams>({
title: Joi.string().required(),
url:   Joi.string().required(), 
username: Joi.string().required(),
password: Joi.string().required()
});
