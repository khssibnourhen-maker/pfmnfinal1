import { Router } from 'express'
import { getAvailableMentors, getMentorByUserId } from '../controllers/mentorsController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.get('/available', authRequired, getAvailableMentors)
router.get('/by-user/:userId', authRequired, getMentorByUserId)
export default router
