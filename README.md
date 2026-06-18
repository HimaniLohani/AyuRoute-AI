# 🏥 AyuRoute AI — Intelligent Healthcare Router

AyuRoute AI is a full-stack web application that optimizes medical response times, reduces unnecessary hospital visits, and guides patients to the right healthcare resource instantly. Built for real Indian users with full Hindi/English bilingual support.

---

## 🚀 Live Features

### 🔐 Authentication System
- Email/Password signup & login with **bcrypt** password hashing
- **Google Sign-In** via Firebase Authentication
- Secure session management

### 🧠 AI Symptom Triage Engine
- **Voice input** via Web Speech API (Hindi + English)
- Text-based symptom search
- Rule-based risk classification into 3 tiers:
  - 🟢 **Low Risk** — OTC medicines + diet plan
  - 🟡 **Medium Risk** — Nearest specialist doctor recommendation
  - 🔴 **High Risk / Emergency** — Immediate alert + ambulance dispatch

### 📍 Hyperlocal Doctor Radar
- GPS-based geolocation
- Nearest specialist doctors sorted by distance
- Available timings, specialization, clinic address

### 🚑 Emergency Ambulance Module
- Real OTP verification flow (4-digit token)
- Patient details + delivery address capture
- Live dispatch countdown timer
- Orders saved to MongoDB

### 💊 10-Minute Pharmacy Tab
- Quick medicine search and recommendations

### 🌐 Bilingual UI
- Full Hindi + English toggle
- Complete translation dictionary for all UI text

### 🎨 UI/UX
- Dark / Light mode toggle
- Fully responsive design
- Real-time GPS location display

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-CORS |
| Database | MongoDB (via PyMongo) |
| Auth | Firebase Authentication, bcrypt |
| APIs | Web Speech API, Geolocation API |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Project Architecture

```
User Input (Voice / Text / Symptom Select)
        ↓
Risk Analysis Engine (Rule-based severity scoring)
        ↓
Smart Router:
  Low Risk    → Medicine + Diet Dashboard
  Medium Risk → Nearest Specialist Doctor List  
  High Risk   → Emergency Ambulance Dispatch + OTP Flow
        ↓
MongoDB → Orders & Users saved to database
```

---

## 🗂️ Folder Structure

```
AyuRoute-AI/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── pages/
│   │   │   └── Pharmacy.jsx
│   │   └── services/
│   │       ├── firebase.js       # Firebase config
│   │       └── GoogleAuthBtn.jsx # Google Auth component
│   ├── vite.config.js
│   └── package.json
└── backend/
    ├── app.py               # Flask API server
    └── requirements.txt
```

---

## 🔧 Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google auth token verification |
| POST | `/api/orders/request-otp` | Generate ambulance OTP |
| POST | `/api/orders/verify-and-book` | Verify OTP & book ambulance |

---

## 🎯 Roadmap

- [ ] Gemini AI integration for dynamic symptom analysis
- [ ] Google Maps Places API for real doctor data
- [ ] Twilio SMS for real OTP delivery
- [ ] User history dashboard
- [ ] Mobile app (React Native)

---

## 👨‍💻 Developer

Built with ❤️ for India's healthcare accessibility problem.
## Himani Lohani
This repository is created as a part of my placement preparation portfolio to demonstrate full-stack logic building and real-world problem-solving capabilities.
