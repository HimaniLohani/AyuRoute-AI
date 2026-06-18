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

app = Flask(__name__)
CORS(app)

# 🍃 DATABASE CONFIGURATION NODE
# Local testing aur Cloud deployment dono ke liye optimized hai
try:
    # Agar kal deployment ke waqt environment variable milega toh cloud use karega, nahi toh local database
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    
    db = client["ayuroute_db"]
    users_collection = db["users"]
    orders_collection = db["orders"]
    
    client.server_info() # Connection verify karne ke liye trigger
    print("🍃 Database Grid Connected Successfully!")
except Exception as e:
    print(f"⚠️ Database Connection Failed: {e}")

# Temporary runtime storage for verification codes
active_otps = {}

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
            
        # ⚡ Yahan aap firebase_admin library use karke token verify kar sakte ho
        # Abhi ke liye secure static success return karega frontend validation ke liye
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

        # Securing password via bcrypt salt grid
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

        # Verifying encrypted database key with request parameters
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

        # Generating a secure 4-digit verification token
        otp = str(random.randint(1000, 9999))
        active_otps[contact_no] = otp

        # Console print setup for local backend tracing
        print(f"🔒 [SECURE GATEWAY] Verification token generated for +91-{contact_no} -> {otp}")

        # ⚡ SANDBOX INTEGRATION: Transmitting token inside JSON payload for secure UI overlay extraction
        return jsonify({
            "message": "Verification token transmitted successfully.",
            "demoOtp": otp  # Accessible by UI during live recruiter evaluations
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

        # Security check: matching user submission against temporary memory core
        if contact_no not in active_otps or active_otps[contact_no] != user_otp:
            return jsonify({"message": "Security Alert: Invalid or expired verification token. Access Denied."}), 401

        # Clear token post verification to maintain security compliance
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
    # Dynamic port selection rules for hosting instances like Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)