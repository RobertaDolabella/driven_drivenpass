import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import { loadEnv, connectDb, disconnectDB } from "@/config";

loadEnv();

import { usersRouter, credentialsRouter, networksRouter} from "@/routers";
// authenticationRouter, eventsRouter, enrollmentsRouter, ticketsRouter, hotelsRouter, bookingRouter 

const app = express();
app
  .use(cors())
  .use(express.json())
  .use("/", usersRouter)
  .use("/credential", credentialsRouter)
  .use("/network", networksRouter)

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
