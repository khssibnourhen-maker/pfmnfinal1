import { Router } from 'express'
import { analyzeCv, chatCareerCoach, getCvSuggestions } from '../controllers/aiController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.use(authRequired)
router.post('/analyze-cv', analyzeCv)
router.post('/cv-suggestions', getCvSuggestions)
router.post('/career-chat', chatCareerCoach)
export default router
