import { asyncHandler } from '../lib/asyncHandler.js'
import { User } from '../models/User.js'

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user.toJSON())
})
