
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from dotenv import load_dotenv
import os
import uuid
import hashlib

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure AWS
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")
dynamodb_table_name = os.getenv("DYNAMODB_TABLE_NAME")

dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=aws_region,
)

table = dynamodb.Table(dynamodb_table_name)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    # Check if user already exists
    response = table.get_item(Key={"email": email})
    if "Item" in response:
        return jsonify({"error": "User already exists"}), 400

    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    table.put_item(
        Item={
            "userId": user_id,
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "password": hashed_password,
        }
    )

    return jsonify({"message": "User created successfully"}), 201

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    response = table.get_item(Key={"email": email})
    if "Item" not in response:
        return jsonify({"error": "Invalid credentials"}), 401

    user = response["Item"]
    if user["password"] != hash_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "user": {
        "firstName": user.get("firstName"),
        "lastName": user.get("lastName"),
        "email": user.get("email"),
    }}), 200

if __name__ == "__main__":
    app.run(debug=True)
