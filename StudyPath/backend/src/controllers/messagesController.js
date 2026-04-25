import { asyncHandler } from '../lib/asyncHandler.js'
import { isValidObjectId } from 'mongoose'
import { Message } from '../models/Message.js'
import { MentorMatch } from '../models/MentorMatch.js'
import { Mentor } from '../models/Mentor.js'
import { User } from '../models/User.js'

const withUsers = (query) => query.populate('sender').populate('receiver').sort({ sentAt: 1 })

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id
  const { receiverId: rawReceiverId, content } = req.body

  if (!rawReceiverId || !content?.trim()) {
    return res.status(400).json({ message: 'receiverId et content sont requis' })
  }

  let receiverId = String(rawReceiverId)
  if (!isValidObjectId(receiverId)) {
    return res.status(404).json({ message: 'Destinataire introuvable' })
  }

  const mentorReceiver = await Mentor.findById(receiverId).select('user')
  if (mentorReceiver?.user) {
    receiverId = mentorReceiver.user.toString()
  }

  const receiver = await User.findById(receiverId).select('_id')
  if (!receiver) {
    return res.status(404).json({ message: 'Destinataire introuvable' })
  }

  if (receiverId === senderId) {
    return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer un message a vous-meme' })
  }

  const normalizedContent = content.trim()

  console.log('Message send attempt:', {
    senderId,
    receiverId,
    content: normalizedContent.substring(0, 50),
  })

  let match = null

  const receiverMentor = await Mentor.findOne({ user: receiverId })
  console.log('Receiver mentor found:', receiverMentor ? 'YES' : 'NO')

  if (receiverMentor) {
    match = await MentorMatch.findOne({
      student: senderId,
      mentor: receiverMentor._id,
      status: 'accepted',
    })
      .populate('student')
      .populate({ path: 'mentor', populate: { path: 'user' } })

    console.log('Accepted match found (student to mentor):', match ? 'YES' : 'NO')
  }

  if (!match) {
    const senderMentor = await Mentor.findOne({ user: senderId })
    console.log('Sender mentor found:', senderMentor ? 'YES' : 'NO')

    if (senderMentor) {
      match = await MentorMatch.findOne({
        student: receiverId,
        mentor: senderMentor._id,
        status: 'accepted',
      })
        .populate('student')
        .populate({ path: 'mentor', populate: { path: 'user' } })

      console.log('Accepted match found (mentor to student):', match ? 'YES' : 'NO')
    }
  }

  if (!match) {
    console.log('No accepted match found')
    return res.status(403).json({ message: 'Message non autorise: demande de mentorat non acceptee' })
  }

  console.log('Accepted match found, sending message')
  const created = await Message.create({ sender: senderId, receiver: receiverId, content: normalizedContent })
  const populated = await withUsers(Message.findById(created._id))
  res.status(201).json(populated.toJSON())
})

export const getSent = asyncHandler(async (req, res) => {
  const rows = await withUsers(Message.find({ sender: req.params.userId }))
  res.json(rows.map((row) => row.toJSON()))
})

export const getConversation = asyncHandler(async (req, res) => {
  const { userId, mentorUserId } = req.params

  if (!userId || !mentorUserId) {
    return res.status(400).json({ message: 'userId et mentorUserId sont requis' })
  }

  const messages = await withUsers(
    Message.find({
      $or: [
        { sender: userId, receiver: mentorUserId },
        { sender: mentorUserId, receiver: userId },
      ],
    })
  )

  res.json(messages.map((msg) => msg.toJSON()))
})

export const getReceived = asyncHandler(async (req, res) => {
  const rows = await withUsers(Message.find({ receiver: req.params.userId }))
  res.json(rows.map((row) => row.toJSON()))
})

export const getUnread = asyncHandler(async (req, res) => {
  const rows = await withUsers(Message.find({ receiver: req.params.userId, isRead: false }))
  res.json(rows.map((row) => row.toJSON()))
})

export const markAsRead = asyncHandler(async (req, res) => {
  const updated = await withUsers(Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }))
  res.json(updated?.toJSON())
})
