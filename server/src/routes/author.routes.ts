// server/src/routes/author.routes.ts

/**
 * ==============================================================================
 * AUTHOR ROUTES
 * ==============================================================================
 * Definisi endpoint untuk modul Author.
 * Endpoint Read (GET) bersifat Public (untuk dropdown/filter).
 * Endpoint Write (POST, PUT, DELETE) bersifat Protected (Admin Only).
 */

import { Router } from 'express';
import * as authorController from '../controllers/author.controller';

// Import Middleware Keamanan
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

// --- PUBLIC ROUTES (Siapapun bisa akses) ---
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// --- PROTECTED ROUTES (Hanya Admin & Editor) ---
router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    authorController.createAuthor
);

router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    authorController.updateAuthor
);

router.delete(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    authorController.deleteAuthor
);

export default router;