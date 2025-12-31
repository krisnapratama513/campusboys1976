import { Router } from 'express';
import * as authorController from '../controllers/author.controller';

const router = Router();

router.get('/', authorController.getAllAuthors);
router.post('/', authorController.createAuthor);
router.get('/:id', authorController.getAuthorById); // Untuk ambil data lama
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

export default router;