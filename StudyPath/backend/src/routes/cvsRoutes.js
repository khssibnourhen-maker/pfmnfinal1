import { Router } from 'express'
import { createCv, getAll, getById, getByUser, getLatestByUser, updateCv } from '../controllers/cvsController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.use(authRequired)
router.get('/', getAll)
router.get('/user/:userId/latest', getLatestByUser)
router.get('/user/:userId', getByUser)
router.post('/user/:userId', createCv)
router.get('/:id', getById)
router.put('/:id', updateCv)
export default router
