import { asyncHandler } from '../lib/asyncHandler.js'
import { MentorMatch } from '../models/MentorMatch.js'

export const createMatch = asyncHandler(async (req, res) => {
  const { studentId, mentorId } = req.body
  const existing = await MentorMatch.findOne({ student: studentId, mentor: mentorId })
  if (existing) return res.json(existing)
  const created = await MentorMatch.create({ student: studentId, mentor: mentorId })
  const populated = await MentorMatch.findById(created._id).populate('student').populate({ path: 'mentor', populate: { path: 'user' } })
  res.status(201).json(populated.toJSON())
})

export const getByStudent = asyncHandler(async (req, res) => {
  const rows = await MentorMatch.find({ student: req.params.studentId }).populate('student').populate({ path: 'mentor', populate: { path: 'user' } })
  res.json(rows.map((row) => row.toJSON()))
})

export const getByMentor = asyncHandler(async (req, res) => {
  const rows = await MentorMatch.find({ mentor: req.params.mentorId }).populate('student').populate({ path: 'mentor', populate: { path: 'user' } })
  res.json(rows.map((row) => row.toJSON()))
})

export const updateStatus = asyncHandler(async (req, res) => {
  const match = await MentorMatch.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    .populate('student')
    .populate({ path: 'mentor', populate: { path: 'user' } })
  res.json(match?.toJSON())
})
