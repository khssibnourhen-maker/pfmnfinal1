import { Router } from 'express'
import { createSchedule, deleteSchedule, getAll, getByUser, updateSchedule } from '../controllers/schedulesController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.use(authRequired)
router.get('/', getAll)
router.get('/user/:userId', getByUser)
router.post('/user/:userId', createSchedule)
router.put('/:id', updateSchedule)
router.delete('/:id', deleteSchedule)
export default router
