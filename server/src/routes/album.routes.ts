// server/src/routes/album.routes.ts

import {Router} from 'express';
import { getPublicAlbums, getPublicAlbumById } from '../controllers/albums.controller';

const router = Router();

// (Akan diakses via GET /api/albums)
router.get('/', getPublicAlbums);
router.get('/:id', getPublicAlbumById);

export default router;