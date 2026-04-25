import { Router } from 'express'
import { getUserById } from '../controllers/usersController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.get('/:id', authRequired, getUserById)
export default router
