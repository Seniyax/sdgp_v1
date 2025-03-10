import { Router } from 'express';

import authcontroller from '../controllers/authControllers';

const router = Router();

router.post('/signup',authcontroller.signup)
router.post('/signin',authcontroller.signin)

router.post('/social/:provider',authcontroller.socialLogin)

router.post('/logout',authcontroller.logout)

export default router;
