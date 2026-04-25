import { asyncHandler } from '../lib/asyncHandler.js'
import { analyzeCvText, careerChat, suggestCvImprovements } from '../services/ollamaService.js'
import { CV } from '../models/CV.js'

export const analyzeCv = asyncHandler(async (req, res) => {
  const { cvText, cvId } = req.body
  const analysis = await analyzeCvText(cvText)
  if (cvId) {
    await CV.findByIdAndUpdate(cvId, { 'analysis.analysis': analysis, 'analysis.timestamp': new Date() })
  }
  res.json({ analysis, timestamp: Date.now() })
})

export const getCvSuggestions = asyncHandler(async (req, res) => {
  const { cvText, cvId } = req.body
  const suggestions = await suggestCvImprovements(cvText)
  if (cvId) {
    await CV.findByIdAndUpdate(cvId, { 'analysis.suggestions': suggestions, 'analysis.timestamp': new Date() })
  }
  res.json({ suggestions, timestamp: Date.now() })
})

export const chatCareerCoach = asyncHandler(async (req, res) => {
  const reply = await careerChat(req.body)
  res.json({ reply, timestamp: Date.now() })
})
