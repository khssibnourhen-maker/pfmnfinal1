import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
)

commentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Comment = mongoose.model('Comment', commentSchema)
