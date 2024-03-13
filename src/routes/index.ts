import { Router } from "express";
import { filloutRoutes } from "./fillout.route";

export const routes = Router();

routes.use('/fillout', filloutRoutes);
