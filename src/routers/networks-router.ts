import { Router } from "express";
import { networkPost, networkGet, networkGetById} from "../controllers"
import {createNetworkSchema, createUserSchema} from "@/schemas";
import { validateBody, authenticateToken } from "@/middlewares";
import { } from "@/controllers";

const networksRouter = Router();

networksRouter
.all("/*", authenticateToken)
.post("/", validateBody(createNetworkSchema), networkPost)
.get("/:id", networkGetById)
.get("/", networkGet);

export { networksRouter };