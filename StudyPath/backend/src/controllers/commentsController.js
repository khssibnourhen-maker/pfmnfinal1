import { asyncHandler } from '../lib/asyncHandler.js'
import { Comment } from '../models/Comment.js'

function normalizeRating(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 5
  return Math.min(5, Math.max(1, Math.round(parsed)))
}

export const listComments = asyncHandler(async (_req, res) => {
  const rows = await Comment.find()
    .populate('user', 'firstName lastName role')
    .sort({ createdAt: -1 })
    .limit(50)

  res.json(rows.map((row) => row.toJSON()))
})

export const createComment = asyncHandler(async (req, res) => {
  const content = `${req.body?.content || ''}`.trim()
  if (!content) {
    return res.status(400).json({ message: 'Le commentaire est requis' })
  }

  const created = await Comment.create({
    user: req.user.id,
    content,
    rating: normalizeRating(req.body?.rating),
  })

  const populated = await Comment.findById(created._id).populate('user', 'firstName lastName role')
  res.status(201).json(populated.toJSON())
})
