import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { Mentor } from '../models/Mentor.js'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '7d' })
}

function validateEmailAndPassword(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    const err = new Error('Email and password are required')
    err.status = 400
    throw err
  }
}

export async function registerUser(payload) {
  const { firstName, lastName, email, password, role } = payload
  validateEmailAndPassword(email, password)
  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) {
    const err = new Error('Email already in use')
    err.status = 400
    throw err
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ firstName, lastName, email, passwordHash, role })
  if (role === 'Mentor') {
    await Mentor.create({
      user: user._id,
      expertise: 'Mentorat, CV, carrière',
      yearsOfExperience: 5,
      rating: 4.8,
      isAvailable: true,
    })
  }
  return { user: user.toJSON(), token: signToken(user.toJSON()) }
}

export async function loginUser(email, password) {
  validateEmailAndPassword(email, password)
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
  if (!user.passwordHash) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
  return { user: user.toJSON(), token: signToken(user.toJSON()) }
}
