import { Router } from "express";
import { getFilteredResponses } from "../controllers/fillout.controller";


export const filloutRoutes = Router();

filloutRoutes.get('/:formId/filteredResponses', getFilteredResponses);
