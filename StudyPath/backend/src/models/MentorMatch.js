import mongoose from 'mongoose'

const mentorMatchSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  matchScore: { type: Number, default: 88 },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' },
}, { timestamps: true })

mentorMatchSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

export const MentorMatch = mongoose.model('MentorMatch', mentorMatchSchema)
