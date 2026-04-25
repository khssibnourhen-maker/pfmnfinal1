export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'studypath_token'

export interface User {
  id?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  role: 'Student' | 'Mentor'
  createdAt?: string
}

export interface CV {
  id?: string
  title?: string
  summary?: string
  content?: string
  structuredData?: any
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
  analysis?: { analysis?: string; suggestions?: string; timestamp?: string }
}
export interface CvSkill { id?: string; cvId?: string; skillId?: string; level?: string }
export interface Skill { id?: string; name: string; category?: string }
export interface Mentor {
  id?: string
  userId?: string
  expertise?: string
  yearsOfExperience?: number
  rating?: number
  isAvailable?: boolean
  user?: User
}
export interface MentorMatch {
  id?: string
  student?: User
  mentor?: Mentor
  matchScore?: number
  status?: 'pending' | 'accepted' | 'declined' | 'completed'
  createdAt?: string
}
export interface Message {
  id?: string
  sender?: User
  receiver?: User
  content?: string
  isRead?: boolean
  sentAt?: string
}
export interface Schedule {
  id?: string
  user?: User
  student?: User
  userId?: string
  studentId?: string
  title?: string
  description?: string
  taskDate?: string
  startTime?: string
  endTime?: string
  type?: 'course' | 'revision' | 'deadline' | 'other'
  status?: 'pending' | 'done' | 'cancelled'
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  color?: string
  sortOrder?: number
}
export interface CareerPrediction {
  id?: string; user?: User; targetRole?: string; matchPercentage?: number; missingSkills?: string; roadmap?: string; generatedAt?: string
}
export interface Notification { id?: string; userId?: string; message?: string; isRead?: boolean; createdAt?: string }
export interface StudentProfile { id?: string; userId?: string; bio?: string; fieldOfStudy?: string; university?: string; graduationYear?: number }
export interface MicroExperience { id?: string; title?: string; description?: string; type?: string; startDate?: string; endDate?: string }
export interface CVAnalysisResponse { analysis: string; timestamp: number }
export interface CvSuggestionsResponse { suggestions: string; timestamp: number }

export function getStoredToken() {
  return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (typeof localStorage === 'undefined') return
  if (!token) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, token)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch (error) {
    throw new Error('Impossible de contacter le backend. Vérifie que le serveur Express tourne sur le port 8081.')
  }
  if (!response.ok) {
    const text = await response.text()
    let message = text
    try {
      const json = JSON.parse(text)
      message = json.message || json.error || text
    } catch {}
    throw new Error(message || 'API request failed')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const authApi = {
  async register(user: User) {
    return request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(user) })
  },
  async login(email: string, password: string) {
    return request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  },
  async me() {
    return request<{ user: User }>('/auth/me')
  },
}

export const usersApi = {
  async register(user: User) {
    const result = await authApi.register(user)
    setStoredToken(result.token)
    return result.user
  },
  async login(email: string, password: string) {
    const result = await authApi.login(email, password)
    setStoredToken(result.token)
    return result.user
  },
  async getById(id: string) {
    return request<User>(`/users/${id}`)
  },
}

export const cvsApi = {
  async create(userId: string, cv: CV) { return request<CV>(`/cvs/user/${userId}`, { method: 'POST', body: JSON.stringify(cv) }) },
  async getById(id: string) { return request<CV>(`/cvs/${id}`) },
  async getAll() { return request<CV[]>('/cvs') },
  async getByUser(userId: string) { return request<CV[]>(`/cvs/user/${userId}`) },
  async getLatest(userId: string) { return request<CV | null>(`/cvs/user/${userId}/latest`) },
  async search(keyword: string) { const all = await request<CV[]>(`/cvs/user/${keyword}`); return all },
  async update(id: string, cv: CV) { return request<CV>(`/cvs/${id}`, { method: 'PUT', body: JSON.stringify(cv) }) },
  async delete(_id: string) { return Promise.resolve(undefined) },
}

export const mentorsApi = {
  async getAvailable() { return request<Mentor[]>('/mentors/available') },
  async getAll() { return request<Mentor[]>('/mentors/available') },
  async getById(id: string) { const rows = await request<Mentor[]>('/mentors/available'); return rows.find((m) => m.id === id)! },
  async getByUserId(userId: string) { return request<Mentor>(`/mentors/by-user/${userId}`) },
  async create() { throw new Error('Not implemented in frontend client') },
  async update() { throw new Error('Not implemented in frontend client') },
  async delete() { return Promise.resolve(undefined) },
}

export const mentorMatchesApi = {
  async create(studentId: string, mentorId: string) { return request<MentorMatch>('/mentor-matches', { method: 'POST', body: JSON.stringify({ studentId, mentorId }) }) },
  async getByStudent(studentId: string) { return request<MentorMatch[]>(`/mentor-matches/student/${studentId}`) },
  async getByMentor(mentorId: string) { return request<MentorMatch[]>(`/mentor-matches/mentor/${mentorId}`) },
  async updateStatus(id: string, status: string) { return request<MentorMatch>(`/mentor-matches/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }) },
  async delete(_id: string) { return Promise.resolve(undefined) },
}

export const messagesApi = {
  async send(senderId: string, receiverId: string, content: string) { return request<Message>('/messages/send', { method: 'POST', body: JSON.stringify({ senderId, receiverId, content }) }) },
  async getById(_id: string) { throw new Error('Not implemented') },
  async getSent(senderId: string) { return request<Message[]>(`/messages/sent/${senderId}`) },
  async getReceived(receiverId: string) { return request<Message[]>(`/messages/received/${receiverId}`) },
  async getUnread(receiverId: string) { return request<Message[]>(`/messages/unread/${receiverId}`) },
  async getConversation(userId: string, mentorUserId: string) { return request<Message[]>(`/messages/conversation/${userId}/${mentorUserId}`) },
  async markAsRead(id: string) { return request<Message>(`/messages/${id}/read`, { method: 'PATCH' }) },
  async delete(_id: string) { return Promise.resolve(undefined) },
}

export const schedulesApi = {
  async create(userId: string, schedule: Schedule) { return request<Schedule>(`/schedules/user/${userId}`, { method: 'POST', body: JSON.stringify(schedule) }) },
  async getById(_id: string) { throw new Error('Not implemented') },
  async getAll() { return request<Schedule[]>('/schedules') },
  async getByUser(userId: string) { return request<Schedule[]>(`/schedules/user/${userId}`) },
  async getByUserAndStatus(userId: string, status: string) { const rows = await request<Schedule[]>(`/schedules/user/${userId}`); return rows.filter((s) => s.status === status) },
  async getByUserAndType(userId: string, type: string) { const rows = await request<Schedule[]>(`/schedules/user/${userId}`); return rows.filter((s) => s.type === type) },
  async update(id: string, schedule: Schedule) { return request<Schedule>(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(schedule) }) },
  async delete(id: string) { return request<{ ok: boolean }>(`/schedules/${id}`, { method: 'DELETE' }) },
}

export const careerPredictionsApi = { async create(_userId: string, prediction: Partial<CareerPrediction>) { return Promise.resolve({ id: String(Date.now()), ...prediction } as CareerPrediction) }, async getByUser() { return Promise.resolve([] as CareerPrediction[]) }, async getLatest() { return Promise.resolve(undefined as any) } }
export const notificationsApi = { async create(_userId: string, notif: Notification) { return Promise.resolve({ id: String(Date.now()), ...notif }) }, async getByUser() { return Promise.resolve([]) }, async getUnread() { return Promise.resolve([]) }, async markAsRead(id: string) { return Promise.resolve({ id, isRead: true }) }, async delete() { return Promise.resolve(undefined) } }

export const aiApi = {
  async analyzeCv(cvText: string, cvId?: string) {
    return request<CVAnalysisResponse>('/ai/analyze-cv', { method: 'POST', body: JSON.stringify({ cvText, cvId }) })
  },
  async getCvSuggestions(cvText: string, cvId?: string) {
    return request<CvSuggestionsResponse>('/ai/cv-suggestions', { method: 'POST', body: JSON.stringify({ cvText, cvId }) })
  },
  async careerChat(message: string, cvText?: string, analysisText?: string, history?: { role: string; content: string }[]) {
    return request<{ reply: string; timestamp: number }>('/ai/career-chat', { method: 'POST', body: JSON.stringify({ message, cvText, analysisText, history }) })
  }
}
