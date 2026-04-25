import { Router } from 'express'
import { getReceived, getSent, getUnread, markAsRead, sendMessage, getConversation } from '../controllers/messagesController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()
router.use(authRequired)
router.post('/send', sendMessage)
router.get('/sent/:userId', getSent)
router.get('/received/:userId', getReceived)
router.get('/unread/:userId', getUnread)
router.get('/conversation/:userId/:mentorUserId', getConversation)
router.patch('/:id/read', markAsRead)
export default router
