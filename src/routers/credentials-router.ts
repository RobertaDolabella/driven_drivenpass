import { Router } from "express";
import { createCredentialSchema } from "@/schemas";
import { validateBody, authenticateToken } from "@/middlewares";
import { credentialPost, credentialGet, credentialGetById } from "@/controllers";

const credentialsRouter = Router();

credentialsRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(createCredentialSchema), credentialPost)
    .get("/", credentialGet)
    .get("/:id", credentialGetById);

export { credentialsRouter };