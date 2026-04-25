import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import { User } from '../models/User.js'
import { Mentor } from '../models/Mentor.js'
import { Schedule } from '../models/Schedule.js'
import { Message } from '../models/Message.js'
import { CV } from '../models/CV.js'
import { MentorMatch } from '../models/MentorMatch.js'

export async function seedDatabase() {
  const usersCount = await User.countDocuments()
  if (usersCount > 0) return

  const passwordHash = await bcrypt.hash('12345678', 10)

  const [student, mentorUser1, mentorUser2] = await User.create([
    { firstName: 'Sarah', lastName: 'Benali', email: 'sarah@example.com', passwordHash, role: 'Student' },
    { firstName: 'Marc', lastName: 'Leblanc', email: 'marc@example.com', passwordHash, role: 'Mentor' },
    { firstName: 'Leila', lastName: 'Haddad', email: 'leila@example.com', passwordHash, role: 'Mentor' },
  ])

  const [mentor1, mentor2] = await Mentor.create([
    { user: mentorUser1._id, expertise: 'Frontend, React, UX/UI', yearsOfExperience: 8, rating: 4.9, isAvailable: true },
    { user: mentorUser2._id, expertise: 'Data, Python, IA', yearsOfExperience: 6, rating: 4.8, isAvailable: true },
  ])

  await CV.create({
    user: student._id,
    title: 'CV Développeuse Frontend',
    summary: 'Étudiante en informatique passionnée par React et UX.',
    content: 'Sarah Benali - Étudiante en informatique passionnée par React et UX.',
    structuredData: {
      personalInfo: { firstName: 'Sarah', lastName: 'Benali', email: 'sarah@example.com', summary: 'Étudiante en informatique passionnée par React et UX.' },
      skills: [{ name: 'React', level: 'intermediate' }, { name: 'TypeScript', level: 'beginner' }]
    }
  })

  await Schedule.create([
    { user: student._id, title: 'Révision CV', description: 'Finaliser la version 1', startTime: '09:00', endTime: '10:00', type: 'revision', status: 'pending', priority: 'HIGH' },
    { user: student._id, title: 'Préparer entretien', description: 'Questions classiques', startTime: '14:00', endTime: '15:00', type: 'course', status: 'done', priority: 'MEDIUM' },
    { user: mentorUser1._id, student: student._id, title: 'Session mentorat - Sarah', description: 'Revue CV & LinkedIn', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 90000000).toISOString(), type: 'course', status: 'pending', priority: 'HIGH' },
  ])

  await Message.create([
    { sender: mentorUser1._id, receiver: student._id, content: 'Bonjour Sarah, prêt pour notre session ?', isRead: false },
    { sender: student._id, receiver: mentorUser1._id, content: 'Oui, merci !', isRead: true },
  ])

  await MentorMatch.create({ student: student._id, mentor: mentor1._id, matchScore: 92, status: 'accepted' })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb()
  await seedDatabase()
  console.log('[seed] done')
  process.exit(0)
}
