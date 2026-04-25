import { asyncHandler } from '../lib/asyncHandler.js'
import { Mentor } from '../models/Mentor.js'

export const getAvailableMentors = asyncHandler(async (_req, res) => {
  const mentors = await Mentor.find({ isAvailable: true }).populate('user').sort({ createdAt: -1 })
  res.json(mentors.map((m) => m.toJSON()))
})

export const getMentorByUserId = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ user: req.params.userId }).populate('user')
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' })
  res.json(mentor.toJSON())
})
