import express from 'express';
import {
  getCanteiros,
  addCanteiro,
  updateCanteiro,
  deleteCanteiro
} from '../controllers/canteirosController.js';

const router = express.Router();

router.get('/', getCanteiros);
router.post('/', addCanteiro);
router.put('/:id', updateCanteiro);
router.delete('/:id', deleteCanteiro);

export default router;