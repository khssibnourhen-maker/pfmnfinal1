import dotenv from 'dotenv'
dotenv.config()

export const env = {
  port: Number(process.env.PORT || 8081),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studypath',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5175')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  ollamaUrl: process.env.OLLAMA_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:0.5b',
  ollamaNumCtx: Number(process.env.OLLAMA_NUM_CTX || 2048),
}
