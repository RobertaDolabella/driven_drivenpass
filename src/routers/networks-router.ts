import { Router } from "express";
import { networkPost, networkGet, networkGetById} from "../controllers"
import {createUserSchema} from "@/schemas";
import { validateBody, authenticateToken } from "@/middlewares";
import { } from "@/controllers";

const networksRouter = Router();

networksRouter
.all("/*", authenticateToken)
.post("/", validateBody(createUserSchema), networkPost)
.get("/", networkGet)
.get("/:id", networkGetById);

export { networksRouter };