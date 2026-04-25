import { Router } from 'express'
import { createComment, listComments } from '../controllers/commentsController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', listComments)
router.post('/', authRequired, createComment)

export default router
