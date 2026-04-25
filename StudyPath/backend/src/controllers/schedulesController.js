import { asyncHandler } from '../lib/asyncHandler.js'
import { Schedule } from '../models/Schedule.js'

const populateSchedule = (query) => query
  .populate('user')
  .populate('student')
  .sort({ taskDate: 1, startTime: 1, sortOrder: 1, createdAt: -1 })

export const createSchedule = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const created = await Schedule.create({ ...req.body, user: userId, student: req.body.studentId || req.body.student || undefined })
  const populated = await populateSchedule(Schedule.findById(created._id))
  res.status(201).json(populated?.toJSON())
})

export const getAll = asyncHandler(async (_req, res) => {
  const rows = await populateSchedule(Schedule.find())
  res.json(rows.map((row) => row.toJSON()))
})

export const getByUser = asyncHandler(async (req, res) => {
  const rows = await populateSchedule(Schedule.find({ user: req.params.userId }))
  res.json(rows.map((row) => row.toJSON()))
})

export const updateSchedule = asyncHandler(async (req, res) => {
  const payload = { ...req.body }
  if (payload.studentId) payload.student = payload.studentId
  const updated = await populateSchedule(Schedule.findByIdAndUpdate(req.params.id, payload, { new: true }))
  res.json(updated?.toJSON())
})

export const deleteSchedule = asyncHandler(async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})
