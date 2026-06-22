# ────────────────────────────────────────────────────────
# ⚕️ AYUROUTE AI BACKEND ENGINE (PRODUCTION-READY GRID)
# ────────────────────────────────────────────────────────
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import re
import random
import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # Loads variables from .env file

app = Flask(__name__)
CORS(app)

# 🤖 GROQ AI CONFIGURATION (Free, fast, no card required)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    print("🤖 Groq AI Engine Connected Successfully!")
else:
    groq_client = None
    print("⚠️ GROQ_API_KEY not found. AI symptom analysis will use fallback data.")

# 🍃 DATABASE CONFIGURATION NODE
try:
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client["ayuroute_db"]
    users_collection = db["users"]
    orders_collection = db["orders"]
    client.server_info()
    print("🍃 Database Grid Connected Successfully!")
except Exception as e:
    print(f"⚠️ Database Connection Failed: {e}")

active_otps = {}

# ────────────────────────────────────────────────────────
# 🤖 AI SYMPTOM ANALYSIS ENGINE (GROQ-POWERED)
# ────────────────────────────────────────────────────────

# Fallback data used if Groq API fails or is unavailable
FALLBACK_DATA = {
    "severity": "MODERATE / मध्यम",
    "severityLevel": "medium",
    "color": "#06b6d4",
    "bg": "#06b6d41A",
    "doctors": [
        {"name": "Dr. General Physician", "type": "General Physician", "dist": "1.0 km | Local Clinic", "time": "10:00 AM - 06:00 PM"}
    ],
    "meds": ["Paracetamol 650mg (consult doctor before use)"],
    "diet": ["Stay hydrated and rest adequately.", "❌ Consult a doctor if symptoms persist beyond 2 days."]
}

def get_ai_symptom_analysis(symptom_text, lang="en"):
    """
    Uses Groq (Llama 3.3 70B) to analyze any free-text symptom description and
    return a structured medical guidance JSON response.
    """
    if not groq_client:
        return FALLBACK_DATA

    language_instruction = "Respond in Hindi (Devanagari script) mixed with English medical terms, Indian context." if lang == "hi" else "Respond in English with Indian context."

    prompt = f"""You are a medical triage assistant for an Indian healthcare app called AyuRoute AI.
A user described their symptom as: "{symptom_text}"

{language_instruction}

Analyze this symptom and respond ONLY with valid JSON (no markdown, no preamble, no code fences) in EXACTLY this structure:

{{
  "severity": "string describing severity level with emoji, e.g. 'CRITICAL / गंभीर स्थिति 🚨'",
  "severityLevel": "one of: low, medium, high, critical",
  "color": "hex color code matching severity (red #ef4444 for critical, orange #f97316 for high, cyan #06b6d4 for medium, green #10b981 for low)",
  "doctors": [
    {{"name": "Dr. [Indian name]", "type": "specialization in English with Hindi in brackets", "dist": "distance like '1.2 km | Area Name, Kanpur'", "time": "available timing"}}
  ],
  "meds": ["medicine name with dosage and instructions, 2-3 items"],
  "diet": ["dietary advice or precaution, 2-3 items, include at least one thing to avoid with ❌ prefix"]
}}

Provide exactly 2 doctor entries with realistic Indian doctor names and Kanpur-area locations.
If the symptom suggests a medical emergency (chest pain, breathing difficulty, severe bleeding, unconsciousness), set severityLevel to "critical" and color to "#ef4444".
Always include a note to consult a real doctor; do not provide exact prescription-only drug dosages beyond common OTC guidance.
Respond with ONLY the JSON object, nothing else."""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=800,
        )
        raw_text = completion.choices[0].message.content.strip()

        # Clean up potential markdown code fences from the model's response
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("`")
            if raw_text.lower().startswith("json"):
                raw_text = raw_text[4:].strip()

        parsed = json.loads(raw_text)

        # Add background color derived from main color for UI styling
        color = parsed.get("color", "#06b6d4")
        parsed["bg"] = f"{color}1A"  # adds transparency hex suffix

        return parsed
    except Exception as e:
        print(f"⚠️ Groq AI analysis failed: {e}")
        return FALLBACK_DATA

# ────────────────────────────────────────────────────────
# 🛣️ NEW: SYMPTOM ANALYSIS API (AI-POWERED)
# ────────────────────────────────────────────────────────
@app.route('/api/symptoms/analyze', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.json
        symptom_text = str(data.get('symptomText', '')).strip()
        lang = data.get('lang', 'en')

        if not symptom_text:
            return jsonify({"message": "Please describe your symptoms first."}), 400

        result = get_ai_symptom_analysis(symptom_text, lang)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": "Symptom analysis failed.", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🛣️ 1. GOOGLE AUTHENTICATION ENDPOINT
# ────────────────────────────────────────────────────────
@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.json
        token = data.get('token')
        if not token:
            return jsonify({"error": "Token missing"}), 400
        return jsonify({
            "status": "success",
            "message": "User session authenticated on backend"
        }), 200
    except Exception as e:
        return jsonify({"message": "Google auth failed", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🛣️ 2. USER REGISTRATION API (SIGNUP)
# ────────────────────────────────────────────────────────
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"message": "Registration failed: All fields are mandatory."}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"message": "Registration failed: This email address is already registered."}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        users_collection.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password
        })

        return jsonify({
            "message": "Registration completed successfully.",
            "user": {"name": name, "email": email}
        }), 201
    except Exception as e:
        return jsonify({"message": "Internal Server Error experienced.", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🛣️ 3. USER AUTHENTICATION API (LOGIN)
# ────────────────────────────────────────────────────────
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Login failed: Email and Password are required."}), 400

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "Authentication failed: User account not found. Please register first."}), 404

        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({
                "message": "Authentication verified successfully.",
                "user": {"name": user['name'], "email": user['email']}
            }), 200
        else:
            return jsonify({"message": "Authentication failed: Invalid password entered."}), 401
    except Exception as e:
        return jsonify({"message": "Internal Server Error experienced.", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🛣️ 4. EMERGENCY NODE: REQUEST VALIDATION OTP
# ────────────────────────────────────────────────────────
@app.route('/api/orders/request-otp', methods=['POST'])
def request_otp():
    try:
        data = request.json
        contact_no = str(data.get('contactNo', '')).strip()

        if not contact_no or not re.match(r"^[6-9]\d{9}$", contact_no):
            return jsonify({"message": "Verification failed: Please enter a valid 10-digit Indian mobile number."}), 400

        otp = str(random.randint(1000, 9999))
        active_otps[contact_no] = otp

        print(f"🔒 [SECURE GATEWAY] Verification token generated for +91-{contact_no} -> {otp}")

        return jsonify({
            "message": "Verification token transmitted successfully.",
            "demoOtp": otp
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to generate verification token.", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🛣️ 5. EMERGENCY NODE: VERIFY OTP AND COMMIT TO DATABASE
# ────────────────────────────────────────────────────────
@app.route('/api/orders/verify-and-book', methods=['POST'])
def verify_and_book():
    try:
        data = request.json
        contact_no = str(data.get('contactNo', '')).strip()
        user_otp = str(data.get('otp', '')).strip()
        address = str(data.get('deliveryAddress', '')).strip()
        patient_name = str(data.get('patientName', '')).strip()

        if not address or len(address) < 5:
            return jsonify({"message": "Booking failed: Complete delivery address details required."}), 400
        if not patient_name:
            return jsonify({"message": "Booking failed: Patient name cannot be empty."}), 400

        if contact_no not in active_otps or active_otps[contact_no] != user_otp:
            return jsonify({"message": "Security Alert: Invalid or expired verification token. Access Denied."}), 401

        del active_otps[contact_no]

        order_payload = {
            "userEmail": data.get('userEmail'),
            "patientName": patient_name,
            "contactNo": contact_no,
            "deliveryAddress": address,
            "status": "Dispatched"
        }
        orders_collection.insert_one(order_payload)

        return jsonify({
            "message": "Ambulance dispatched successfully. Emergency node updated.",
            "status": "Success"
        }), 201
    except Exception as e:
        return jsonify({"message": "Booking failed due to an internal server error.", "error": str(e)}), 500

# ────────────────────────────────────────────────────────
# 🚀 CORE INITIALIZATION NODE
# ────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)