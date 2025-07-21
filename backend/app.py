#!/usr/bin/env python3

from flask import Flask, request, jsonify
import africastalking
import os
from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.afyaapp
users = db.users

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Africa's Talking
username = os.getenv("AFRICASTALKING_USERNAME")
api_key = os.getenv("AFRICASTALKING_API_KEY")

africastalking.initialize(username, api_key)
sms = africastalking.SMS

# Alert messages by region
alerts = {
    "Kisumu": "🚨 Malaria outbreak in Kisumu! Visit Kisumu County Referral Hospital.",
    "Nairobi": "⚠️ Cholera alert in Nairobi. Visit Mama Lucy Hospital.",
    "Mombasa": "🦠 Dengue outbreak in Mombasa. Nearest care: Mombasa General Hospital."
}


@app.route('/sign-in', methods=["POST"])
def sign_in():
    data = request.get_json()
    name = data.get("name")
    email = data.get('email')
    phone_number = data.get("phoneNumber")
    location = data.get("location")

    if not phone_number:
        return jsonify({"message": "Invalid Phone Number"}), 400

    if phone_number[0:4] != "+254":
        return jsonify({"message": "Please Make sure the phone number starts with +254"}), 400

    if not name:
        return jsonify({"message": "Name not Found"}), 400

    if not email:
        return jsonify({"message": "Email not Found"}), 400

    if not location:
        return jsonify({"message": "Location not Found"}), 400

    return jsonify({"status": "success"}) if users.insert_one({"name": name, 'email': email, "phone_number": phone_number, "location": location}) else jsonify({"status": "Failure", "message": "Data not recorded"})


@app.route('/send-sms', methods=['POST'])
def send_sms():
    data = request.get_json()
    phone_number = data.get("phoneNumber")
    location = data.get("location")
    message = data.get("message") or alerts.get(
        location, "Stay safe. Follow health guidelines.")

    if not phone_number:
        return jsonify({"message": "Phone number is required"}), 400

    try:
        response = sms.send(
            message=message,
            recipients=[phone_number],
            sender_id="AFTKNG"
        )
        return jsonify({"status": "success", "response": response}), 200
    except Exception as e:
        print("❌ Error while sending SMS:", str(e))
        return jsonify({"message": "An error occurred while sending SMS", "error": str(e)}), 500


@app.route('/sms-callback', methods=['POST'])
def receive_sms():
    sender = request.form.get('from')
    message = request.form.get('text')
    receiver = request.form.get('to')
    date = request.form.get('date')
    link_id = request.form.get('linkId')

    print(f"📩 Received SMS from {sender}: {message} on {date}")

    # Auto-response based on message content
    reply = "Thank you for your response. We will follow up shortly."
    if "kisumu" in message.lower():
        reply = alerts["Kisumu"]
    elif "nairobi" in message.lower():
        reply = alerts["Nairobi"]
    elif "mombasa" in message.lower():
        reply = alerts["Mombasa"]

    try:
        sms.send(
            message=reply,
            recipients=[sender],
            sender_id="AFTKNG"
        )
    except Exception as e:
        print("Failed to send auto-reply:", e)

    return "Received", 200


if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))