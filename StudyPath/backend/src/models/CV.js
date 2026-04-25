import mongoose from 'mongoose'

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'CV' },
  summary: { type: String, default: '' },
  content: { type: String, default: '' },
  structuredData: { type: mongoose.Schema.Types.Mixed, default: {} },
  analysis: {
    analysis: { type: String, default: '' },
    suggestions: { type: String, default: '' },
    timestamp: { type: Date },
  },
}, { timestamps: true })

cvSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    ret.userId = ret.user?.toString?.() || ret.user
    delete ret._id
    delete ret.__v
    return ret
  }
})

export const CV = mongoose.model('CV', cvSchema)
