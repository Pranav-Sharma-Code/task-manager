import express from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    toggleStatus,
    deleteTask,
} from '../controllers/taskController.js';

import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createTask);  

router.get('/', getTasks);    

router.get('/:id', getTaskById); 

router.put('/:id', updateTask);

router.patch('/:id/toggle', toggleStatus); 

router.delete('/:id', deleteTask);      

export default router;