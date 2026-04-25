# 🔗 Connexion Frontend ↔ Backend

## Configuration
- **Backend** : http://localhost:8081 (Spring Boot)
- **Frontend** : http://localhost:3000 (Next.js)

## Lancement

### 1. Démarrer le Backend
```bash
cd smartcareer
./mvnw spring-boot:run
```
Vérifier : http://localhost:8081/api/users

### 2. Démarrer le Frontend
```bash
cd frontend
npm install
npm run dev
```
Ouvrir : http://localhost:3000

## Fichiers modifiés

### Frontend
| Fichier | Modification |
|---------|-------------|
| `lib/api.ts` | Toutes les fonctions d'appel API |
| `context/AuthContext.tsx` | Auth réelle via backend |
| `app/layout.tsx` | AuthProvider ajouté |
| `components/auth/auth-modal.tsx` | Inscription/Connexion réelles |
| `app/student/dashboard/page.tsx` | Données réelles (CV, tâches, matches) |
| `app/student/mentoring/page.tsx` | Liste mentors depuis backend |
| `app/student/messages/page.tsx` | Messagerie connectée |
| `app/student/planning/page.tsx` | Planning CRUD complet |
| `.env.local` | URL du backend |

### Backend
| Fichier | Modification |
|---------|-------------|
| `config/corsConfig.java` | CORS pour localhost:3000 |
| `config/SecurityBeansConfig.java` | PasswordEncoder bean |
| `controller/userController.java` | Endpoints login + getById |
| `service/userService.java` | login(), getById(), findByEmail |
| `repository/userRepository.java` | findByEmail() |
| `model/mentor.java` | @JsonIgnoreProperties |
| `model/message.java` | @JsonIgnoreProperties |
| `model/mentor_matches.java` | @JsonIgnoreProperties |
| `model/careerprediction.java` | @JsonIgnoreProperties |
| `resources/application.properties` | Jackson config |

## Utilisation de l'API dans le frontend

```tsx
import { useAuth } from "@/context/AuthContext"
import { schedulesApi } from "@/lib/api"

// Dans un composant :
const { user } = useAuth()
const tasks = await schedulesApi.getByUser(user.id)
```

## Endpoints disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/users | Inscription |
| POST | /api/users/login | Connexion |
| GET | /api/mentors/available | Mentors disponibles |
| POST | /api/messages/send | Envoyer message |
| GET | /api/schedules/user/{id} | Planning étudiant |
| POST | /api/schedules/user/{id} | Créer tâche |
| GET | /api/career-predictions/user/{id} | Prédictions carrière |
