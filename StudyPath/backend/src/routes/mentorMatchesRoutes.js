import { Router } from 'express'
import { createMatch, getByMentor, getByStudent, updateStatus } from '../controllers/mentorMatchesController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.use(authRequired)
router.post('/', createMatch)
router.get('/student/:studentId', getByStudent)
router.get('/mentor/:mentorId', getByMentor)
router.patch('/:id/status', updateStatus)
export default router
