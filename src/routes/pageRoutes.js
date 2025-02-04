import express from 'express';
import { cache } from '../middleware/cache.js';
import {
  getPageByUsername,
  getPagesByFilters,
  getPageFollowers,
  getPagePosts
} from '../controller/pageController.js';

const router = express.Router();

router.get('/page/:username', cache(300), getPageByUsername);
router.get('/pages', cache(300), getPagesByFilters);
router.get('/page/:username/followers', cache(300), getPageFollowers);
router.get('/page/:username/posts', cache(300), getPagePosts);

export default router;