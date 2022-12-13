import { Router } from "express";
import { createCredentialSchema } from "@/schemas";
import { validateBody, authenticateToken } from "@/middlewares";
import { credentialPost, credentialGet, credentialGetById, credentialDelete } from "@/controllers";

const credentialsRouter = Router();

credentialsRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(createCredentialSchema), credentialPost)
    .get("/:id", credentialGetById)
    .get("/", credentialGet)
    .delete("/:id", credentialDelete);
 

export { credentialsRouter };