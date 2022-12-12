import { Router } from "express";

import { createUserSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { userCreate, userLogIn } from "@/controllers";

const usersRouter = Router();

usersRouter.post("/signup", validateBody(createUserSchema), userCreate);
usersRouter.post("/", validateBody(createUserSchema), userLogIn);

export { usersRouter };