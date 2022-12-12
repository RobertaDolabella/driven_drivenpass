import { Router } from "express";

import { createUserSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { } from "@/controllers";

const networksRouter = Router();

networksRouter.post("/", validateBody(createUserSchema));
networksRouter.get("/", validateBody(createUserSchema));

export { networksRouter };