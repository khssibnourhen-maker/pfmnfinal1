import mongoose from 'mongoose'

const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expertise: { type: String, default: '' },
  yearsOfExperience: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true })

mentorSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

export const Mentor = mongoose.model('Mentor', mentorSchema)
