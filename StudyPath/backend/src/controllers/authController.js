import { asyncHandler } from '../lib/asyncHandler.js'
import { loginUser, registerUser } from '../services/authService.js'

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body)
  res.status(201).json(result)
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await loginUser(email, password)
  res.json(result)
})

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() })
})
