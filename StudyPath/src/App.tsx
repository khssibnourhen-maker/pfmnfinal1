import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import HomePage from '@/app/page'
import StudentLayout from '@/app/student/layout'
import MentorLayout from '@/app/mentor/layout'
import StudentDashboard from '@/app/student/dashboard/page'
import StudentCVBuilder from '@/app/student/cv-builder/page'
import StudentCareerMirror from '@/app/student/career-mirror/page'
import StudentMentoring from '@/app/student/mentoring/page'
import StudentMessages from '@/app/student/messages/page'
import StudentPlanning from '@/app/student/planning/page'
import StudentAiCoach from '@/app/student/ai-coach/page'
import MentorDashboard from '@/app/mentor/dashboard/page'
import MentorStudents from '@/app/mentor/students/page'
import MentorSessions from '@/app/mentor/sessions/page'
import MentorPlanning from '@/app/mentor/planning/page'
import MentorMessages from '@/app/mentor/messages/page'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="cv-builder" element={<StudentCVBuilder />} />
          <Route path="career-mirror" element={<StudentCareerMirror />} />
          <Route path="mentoring" element={<StudentMentoring />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="planning" element={<StudentPlanning />} />
          <Route path="ai-coach" element={<StudentAiCoach />} />
        </Route>
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="students" element={<MentorStudents />} />
          <Route path="sessions" element={<MentorSessions />} />
          <Route path="planning" element={<MentorPlanning />} />
          <Route path="messages" element={<MentorMessages />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
