import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  taskDate: { type: String, default: '' },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  type: { type: String, enum: ['course', 'revision', 'deadline', 'other'], default: 'other' },
  status: { type: String, enum: ['pending', 'done', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  color: { type: String, default: 'sky' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

scheduleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    ret.userId = ret.user?.toString?.() || ret.user
    ret.studentId = ret.student?.toString?.() || ret.student
    delete ret._id
    delete ret.__v
    return ret
  }
})

export const Schedule = mongoose.model('Schedule', scheduleSchema)
