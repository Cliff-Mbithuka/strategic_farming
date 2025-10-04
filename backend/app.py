import os
import uuid
import hashlib
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
    )
    return conn

# Create table if it doesn't exist
def create_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            userId VARCHAR(255) PRIMARY KEY,
            firstName VARCHAR(255),
            lastName VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS farm_data (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) REFERENCES users(userId),
            data_type VARCHAR(100),
            data_value JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS weather_forecast (
            id SERIAL PRIMARY KEY,
            date DATE,
            temperature_high NUMERIC,
            temperature_low NUMERIC,
            condition VARCHAR(100),
            humidity NUMERIC,
            chance_of_rain NUMERIC DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS soil_conditions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) REFERENCES users(userId),
            moisture_level NUMERIC,
            nitrogen_level NUMERIC,
            ph_level NUMERIC,
            temperature NUMERIC,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_metrics (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) REFERENCES users(userId),
            credit_points INTEGER DEFAULT 0,
            farm_health INTEGER DEFAULT 0,
            active_neighbors INTEGER DEFAULT 0,
            nearest_market_distance INTEGER DEFAULT 0,
            nearest_market_name VARCHAR(255),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
        );
        """
    )
    conn.commit()
    cur.close()
    conn.close()

create_table()

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

    conn = get_db_connection()
    cur = conn.cursor()

    # Check if user already exists
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cur.fetchone():
        return jsonify({"error": "User already exists"}), 400

    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    cur.execute(
        "INSERT INTO users (userId, firstName, lastName, email, password) VALUES (%s, %s, %s, %s, %s)",
        (user_id, first_name, last_name, email, hashed_password),
    )
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "User created successfully"}), 201

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # user is a tuple, so we access fields by index
    # 0: userId, 1: firstName, 2: lastName, 3: email, 4: password
    if user[4] != hash_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    cur.close()
    conn.close()

    return jsonify({
        "message": "Login successful",
        "user": {
            "userId": user[0],
            "firstName": user[1],
            "lastName": user[2],
            "email": user[3],
        },
    }), 200

@app.route("/dashboard/<user_id>", methods=["GET"])
def get_dashboard_data(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get user info
        cur.execute("SELECT firstName, lastName FROM users WHERE userId = %s", (user_id,))
        user_row = cur.fetchone()
        if not user_row:
            return jsonify({"error": "User not found"}), 404

        first_name, last_name = user_row

        # Get user metrics
        cur.execute("SELECT credit_points, farm_health, active_neighbors, nearest_market_distance, nearest_market_name FROM user_metrics WHERE user_id = %s", (user_id,))
        metrics_row = cur.fetchone()
        if metrics_row:
            credit_points, farm_health, active_neighbors, market_distance, market_name = metrics_row
        else:
            # Insert default values if no metrics exist
            cur.execute("""
                INSERT INTO user_metrics (user_id, credit_points, farm_health, active_neighbors, nearest_market_distance, nearest_market_name)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id) DO NOTHING
            """, (user_id, 1247, 94, 23, 12, "Green Valley Market"))
            conn.commit()
            credit_points, farm_health, active_neighbors, market_distance, market_name = 1247, 94, 23, 12, "Green Valley Market"

        cur.close()
        conn.close()

        return jsonify({
            "firstName": first_name,
            "lastName": last_name,
            "creditPoints": credit_points,
            "farmHealth": farm_health,
            "activeNeighbors": active_neighbors,
            "nearestMarket": {
                "name": market_name,
                "distance": market_distance
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/weather-forecast", methods=["GET"])
def get_weather_forecast():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get weather forecast for next few days
        cur.execute("""
            SELECT date, temperature_high, temperature_low, condition, humidity, chance_of_rain
            FROM weather_forecast
            WHERE date >= CURRENT_DATE
            ORDER BY date ASC
            LIMIT 7
        """)
        weather_rows = cur.fetchall()

        if not weather_rows:
            # Insert sample data if none exists
            from datetime import datetime, timedelta
            today = datetime.now().date()

            sample_weather = [
                (today + timedelta(days=i), 28 - i, 18 - i, ["Clear skies", "Partly cloudy", "Light rain", "Windy"][min(i, 3)], 65 - i*5, [0, 0, 80, 0][min(i, 3)])
                for i in range(4)
            ]
            cur.executemany("""
                INSERT INTO weather_forecast (date, temperature_high, temperature_low, condition, humidity, chance_of_rain)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, sample_weather)
            conn.commit()

            # Fetch the inserted data
            cur.execute("""
                SELECT date, temperature_high, temperature_low, condition, humidity, chance_of_rain
                FROM weather_forecast
                WHERE date >= CURRENT_DATE
                ORDER BY date ASC
                LIMIT 4
            """)
            weather_rows = cur.fetchall()

        weather_data = []
        for row in weather_rows:
            date, high, low, condition, humidity, rain_chance = row
            weather_data.append({
                "date": date.isoformat(),
                "high": float(high),
                "low": float(low),
                "condition": condition,
                "humidity": float(humidity),
                "rainChance": float(rain_chance)
            })

        cur.close()
        conn.close()

        return jsonify(weather_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/soil-conditions/<user_id>", methods=["GET"])
def get_soil_conditions(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT moisture_level, nitrogen_level, ph_level, temperature
            FROM soil_conditions
            WHERE user_id = %s
            ORDER BY updated_at DESC
            LIMIT 1
        """, (user_id,))
        soil_row = cur.fetchone()

        if not soil_row:
            # Insert sample data if none exists
            cur.execute("""
                INSERT INTO soil_conditions (user_id, moisture_level, nitrogen_level, ph_level, temperature)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, 78, 65, 6.5, 22))
            conn.commit()
            moisture, nitrogen, ph, temp = 78, 65, 6.5, 22
        else:
            moisture, nitrogen, ph, temp = soil_row

        cur.close()
        conn.close()

        return jsonify({
            "moisture": float(moisture),
            "nitrogen": float(nitrogen),
            "ph": float(ph),
            "temperature": float(temp)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ai-recommendations/<user_id>", methods=["GET"])
def get_ai_recommendations(user_id):
    # For now, return static recommendations - can be enhanced with ML later
    recommendations = [
        {
            "id": 1,
            "priority": "High",
            "title": "Optimal planting window for tomatoes",
            "description": "Soil conditions and weather patterns indicate ideal conditions for the next 5 days. Market demand is high with prices at $4.50/kg.",
            "type": "planting"
        },
        {
            "id": 2,
            "priority": "Medium",
            "title": "Consider collaboration with 3 nearby farmers",
            "description": "Neighboring farms are planting complementary crops. Coordinating can optimize pest control and earn 150 credit points.",
            "type": "collaboration"
        },
        {
            "id": 3,
            "priority": "Watch",
            "title": "Pest risk increasing for corn fields",
            "description": "Satellite data shows increased activity in the region. Consider preventive measures within 48 hours.",
            "type": "pest"
        }
    ]

    return jsonify({"recommendations": recommendations}), 200

if __name__ == "__main__":
    app.run(debug=True)
