import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get("/orphanages", OrphanagesController.list);
routes.get("/orphanages/:id", OrphanagesController.get);
routes.post("/orphanages", upload.array("images"), OrphanagesController.create);

export default routes;