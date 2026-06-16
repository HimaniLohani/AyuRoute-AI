# 🏥 AyuRoute: AI-Powered Symptom Checker & Hyperlocal Healthcare Router 

AyuRoute is an intelligent web application designed to optimize medical response times, reduce unnecessary hospital visits, and save patient costs. The platform acts as a healthcare router by classifying user-inputted symptoms into different risk categories and guiding them to the most appropriate medical resource.

---

## 🚀 Core Features

- **Smart Symptom Triage:** Classifies user symptoms into three risk tiers:
  - **🟢 Low Risk (Minor Issues):** Instantly recommends OTC (Over-The-Counter) medicines, self-care routines, or personalized diet plans.
  - **🟡 Medium Risk (Specific Illnesses):** Suggests specialized doctors based on the disease.
  - **🔴 High Risk (Emergencies):** Triggers immediate emergency alerts, flashing nearby hospital locations.
- **Hyperlocal Doctor Recommendation:** Leverages Geolocation to find and sort the nearest and top-rated specialist doctors based on the user's current location.
- **Simulated Emergency Module:** Includes a mock ambulance booking feature to showcase rapid response times during critical medical situations.

---

## 🛠️ Tech Stack (In Progress)

- **Frontend:** HTML5, CSS3, JavaScript (or React.js / Tailwind CSS)
- **Backend:** Node.js / Express.js (or Python)
- **Database:** MongoDB / JSON local database
- **APIs:** Geolocation API, Google Maps API (or Leaflet.js)

---

## ⚙️ Project Architecture & Logic Flow

1. **User Input:** User enters or selects their symptoms (e.g., Fever, Chest Pain, Headache).
2. **Risk Analysis:** A rule-based engine assesses the severity.
3. **Smart Routing:**
   - *If severity is Low* ➡️ Redirected to Medicine/Diet Dashboard.
   - *If severity is Medium* ➡️ Redirected to Nearby Specialist Doctor List.
   - *If severity is High* ➡️ Redirected to Emergency Contact & Ambulance Mock Tracker.

---

## 🎯 Current Status & Future Roadmap

This project is currently **under active development**. 
- [x] Concept and Logic Flow Design
- [x] Basic UI Wireframing
- [x] Frontend Core UI Implementation (In Progress)
- [ ] Local JSON Database Setup for Doctors and Medicines
- [ ] API Integration (Geolocation & Mapping)

---

## Himani Lohani
This repository is created as a part of my placement preparation portfolio to demonstrate full-stack logic building and real-world problem-solving capabilities.
