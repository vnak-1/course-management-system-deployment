import { Router } from 'express';
import { store, getProgress } from '../controllers/progress.controller';
import { userAuthorize } from '../middleware/auth.middleware';

const progressRouter = Router();

// Update progress tracker for users + Auth only
progressRouter.post('/', userAuthorize, store);

// Get progress for a course + Auth only
progressRouter.get('/:courseId', userAuthorize, getProgress);

export default progressRouter;
