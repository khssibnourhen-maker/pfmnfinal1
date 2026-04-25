# StudyPath Fullstack

## Run frontend
```bash
npm install
npm run dev
```

## Run backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Requirements
- MongoDB running on `mongodb://127.0.0.1:27017/studypath`
- Ollama running locally
- create `backend/.env` from `backend/.env.example` if you have not already
- model available in Ollama:
```bash
ollama pull qwen2.5:0.5b
```

For low-memory PCs, use `OLLAMA_MODEL=qwen2.5:0.5b` and `OLLAMA_NUM_CTX=2048` in `backend/.env`.
If you already have another Ollama model installed, set `OLLAMA_MODEL=your-model-name` in `backend/.env`.

## Notes
- Frontend uses Vite proxy, so API calls go to `/api` and are forwarded to `http://localhost:8081`
- If backend is down, the frontend now shows a friendly error instead of crashing
- Career Mirror stores the latest AI CV analysis in `localStorage`
