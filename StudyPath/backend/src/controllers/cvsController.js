import { asyncHandler } from '../lib/asyncHandler.js'
import { CV } from '../models/CV.js'

const withUser = (query) => query.populate('user').sort({ updatedAt: -1 })


export const getAll = asyncHandler(async (_req, res) => {
  const rows = await withUser(CV.find())
  res.json(rows.map((row) => row.toJSON()))
})

export const createCv = asyncHandler(async (req, res) => {
  const created = await CV.create({ ...req.body, user: req.params.userId })
  const populated = await withUser(CV.findById(created._id))
  res.status(201).json(populated?.toJSON())
})

export const getByUser = asyncHandler(async (req, res) => {
  const rows = await withUser(CV.find({ user: req.params.userId }))
  res.json(rows.map((row) => row.toJSON()))
})

export const getLatestByUser = asyncHandler(async (req, res) => {
  const row = await withUser(CV.findOne({ user: req.params.userId }))
  res.json(row?.toJSON() || null)
})

export const getById = asyncHandler(async (req, res) => {
  const row = await withUser(CV.findById(req.params.id))
  res.json(row?.toJSON() || null)
})

export const updateCv = asyncHandler(async (req, res) => {
  const updated = await withUser(CV.findByIdAndUpdate(req.params.id, req.body, { new: true }))
  res.json(updated?.toJSON() || null)
})
