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

# Create tables with comprehensive schema
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()

    # Create tables one by one in dependency order
    tables_created = []

    try:
        # Basic independent tables first
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                email VARCHAR(255) UNIQUE,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                farm_name VARCHAR(255),
                farm_latitude DECIMAL(10, 6),
                farm_longitude DECIMAL(10, 6),
                farm_size_hectares DECIMAL(8, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        tables_created.append('users')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS market_data (
                id SERIAL PRIMARY KEY,
                market_name VARCHAR(255) NOT NULL,
                latitude DECIMAL(10, 6),
                longitude DECIMAL(10, 6),
                distance_km DECIMAL(8, 2),
                commodity_prices JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        tables_created.append('market_data')

        # Tables that reference users
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_credits (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                total_points INTEGER DEFAULT 0,
                current_rank VARCHAR(50) DEFAULT 'Bronze',
                points_to_next_rank INTEGER DEFAULT 500,
                monthly_change_percent DECIMAL(5, 2) DEFAULT 0.0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            )
        """)
        
        tables_created.append('user_credits')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS farm_zones (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                zone_name VARCHAR(10) NOT NULL,
                crop_type VARCHAR(100),
                area_hectares DECIMAL(8, 2),
                status VARCHAR(50) DEFAULT 'active',
                color_code VARCHAR(7) DEFAULT '#10B981',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, zone_name)
            )
        """)
        tables_created.append('farm_zones')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS farm_neighbors (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                neighbor_name VARCHAR(255) NOT NULL,
                distance_km DECIMAL(5, 2),
                farm_type VARCHAR(100),
                collaboration_status VARCHAR(50) DEFAULT 'potential',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, neighbor_name)
            )
        """)
        tables_created.append('farm_neighbors')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS farm_health_metrics (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                date DATE NOT NULL,
                overall_health_score DECIMAL(5, 2),
                soil_health_score DECIMAL(5, 2),
                crop_health_score DECIMAL(5, 2),
                water_efficiency_score DECIMAL(5, 2),
                nasa_data_sources JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            )
        """)
        tables_created.append('farm_health_metrics')

        # NASA data tables
        cur.execute("""
            CREATE TABLE IF NOT EXISTS nasa_weather_data (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                date DATE NOT NULL,
                temperature_2m_avg DECIMAL(5, 2),
                precipitation DECIMAL(5, 2),
                eto DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            )
        """)
        tables_created.append('nasa_weather_data')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS nasa_vegetation_data (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                date DATE NOT NULL,
                crop_health_score DECIMAL(5, 2),
                vegetation_density DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            )
        """)
        tables_created.append('nasa_vegetation_data')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS nasa_weather_forecast (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                forecast_date DATE NOT NULL,
                temperature_max DECIMAL(5, 2),
                temperature_min DECIMAL(5, 2),
                weather_condition VARCHAR(100),
                precipitation_probability DECIMAL(5, 2),
                humidity DECIMAL(5, 2),
                wind_speed DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, forecast_date)
            )
        """)
        tables_created.append('nasa_weather_forecast')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS nasa_soil_data (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                zone_id INTEGER REFERENCES farm_zones(id),
                date DATE NOT NULL,
                soil_moisture_0_5cm DECIMAL(10, 6),
                soil_temperature_0_5cm DECIMAL(5, 2),
                surface_wetness DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, zone_id, date)
            )
        """)
        tables_created.append('nasa_soil_data')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS nasa_ai_recommendations (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                zone_id INTEGER REFERENCES farm_zones(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                recommendation_type VARCHAR(100),
                priority VARCHAR(20) DEFAULT 'Low',
                status VARCHAR(20) DEFAULT 'active',
                nasa_datasets_used JSONB,
                crop_suggestion VARCHAR(100),
                market_insight JSONB,
                time_window_start DATE,
                time_window_end DATE,
                expected_impact_score DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, title)
            )
        """)
        tables_created.append('nasa_ai_recommendations')

        # Legacy compatibility tables
        cur.execute("""
            CREATE TABLE IF NOT EXISTS legacy_users (
                userId VARCHAR(255) PRIMARY KEY,
                firstName VARCHAR(255),
                lastName VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255)
            )
        """)
        tables_created.append('legacy_users')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS weather_forecast (
                id SERIAL PRIMARY KEY,
                date DATE,
                temperature_high NUMERIC,
                temperature_low NUMERIC,
                condition VARCHAR(100),
                humidity NUMERIC,
                chance_of_rain NUMERIC DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        tables_created.append('weather_forecast')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS soil_conditions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                moisture_level NUMERIC,
                nitrogen_level NUMERIC,
                ph_level NUMERIC,
                temperature NUMERIC,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        tables_created.append('soil_conditions')

        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_metrics (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                credit_points INTEGER DEFAULT 0,
                farm_health INTEGER DEFAULT 0,
                active_neighbors INTEGER DEFAULT 0,
                nearest_market_distance INTEGER DEFAULT 0,
                nearest_market_name VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        tables_created.append('user_metrics')

        conn.commit()
        print(f"Successfully created tables: {', '.join(tables_created)}")

    except Exception as e:
        print(f"Error creating tables: {str(e)}")
        conn.rollback()
        raise e

    finally:
        cur.close()
        conn.close()


import click

@app.cli.command("init-db")
def init_db_command():
    """Clear the existing data and create new tables."""
    create_tables()
    click.echo("Initialized the database.")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")
    username = data.get("username", email)  # Use email as default username

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    # Check if user already exists in new users table
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cur.fetchone():
        return jsonify({"error": "User already exists"}), 400

    # Create new user in new schema
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(str(uuid.uuid4()))  # Generate a random password hash for demo

    cur.execute("""
        INSERT INTO users (id, username, email, first_name, last_name, farm_name)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (user_id, username, email, first_name, last_name, f"{first_name}'s Farm"))

    # Also create legacy entry for backward compatibility
    legacy_user_id = str(uuid.uuid4())
    cur.execute("""
        INSERT INTO legacy_users (userId, firstName, lastName, email, password)
        VALUES (%s, %s, %s, %s, %s)
    """, (legacy_user_id, first_name, last_name, email, hashed_password))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "User created successfully",
        "user": {
            "userId": legacy_user_id,  # Return legacy format for frontend compatibility
            "id": user_id,  # Also return new format
            "firstName": first_name,
            "lastName": last_name,
            "email": email
        }
    }), 201

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    # Try new users table first
    cur.execute("""
        SELECT id, username, email, first_name, last_name, farm_name
        FROM users WHERE email = %s
    """, (email,))
    user = cur.fetchone()

    if user:
        user_id, username, user_email, first_name, last_name, farm_name = user
        # For demo purposes, accept any password for new users
        cur.close()
        conn.close()

        return jsonify({
            "message": "Login successful",
            "user": {
                "userId": user_id,  # Return UUID as userId for compatibility
                "id": user_id,
                "firstName": first_name,
                "lastName": last_name,
                "email": user_email,
            },
        }), 200

    # Fallback to legacy users table
    cur.execute("SELECT userId, firstName, lastName, email, password FROM legacy_users WHERE email = %s", (email,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    user_id, first_name, last_name, user_email, stored_password_hash = user

    # Check password hash
    if hash_password(str(password)) != stored_password_hash:
        return jsonify({"error": "Invalid credentials"}), 401

    cur.close()
    conn.close()

    return jsonify({
        "message": "Login successful",
        "user": {
            "userId": user_id,
            "firstName": first_name,
            "lastName": last_name,
            "email": user_email,
        },
    }), 200

@app.route("/dashboard/<user_id>", methods=["GET"])
def get_dashboard_data(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if user_id is a UUID (new format) or old userId format
        if len(user_id) > 36:  # old userId format
            # Check legacy table first
            cur.execute("""
                SELECT userId, firstName, lastName, email
                FROM legacy_users
                WHERE userId = %s
            """, (user_id,))
            user_row = cur.fetchone()
            if user_row:
                # Found in legacy table, convert to new format response
                user_id_legacy, first_name, last_name, email = user_row

                # Get metrics for legacy user (fallback to defaults)
                cur.execute("""
                    SELECT credit_points, farm_health, active_neighbors, nearest_market_distance, nearest_market_name
                    FROM user_metrics
                    WHERE user_id = %s
                """, (user_id,))
                metrics_row = cur.fetchone()
                if not metrics_row:
                    # Insert default metrics if none exist for legacy user
                    cur.execute("""
                        INSERT INTO user_metrics (user_id, credit_points, farm_health, active_neighbors, nearest_market_distance, nearest_market_name)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (user_id) DO NOTHING
                    """, (user_id, 1247, 94, 23, 12, "Green Valley Market"))
                    conn.commit()
                    credit_points, farm_health, active_neighbors, market_distance, market_name = 1247, 94, 23, 12, "Green Valley Market"
                else:
                    credit_points, farm_health, active_neighbors, market_distance, market_name = metrics_row

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

        # Try new UUID format in users table
        cur.execute("""
            SELECT
                u.first_name,
                u.last_name,
                uc.total_points as credit_points,
                uc.current_rank,
                fh.overall_health_score as farm_health,
                (SELECT COUNT(*) FROM farm_neighbors WHERE user_id = u.id) as active_neighbors,
                (SELECT json_build_object('name', market_name, 'distance', distance_km)
                 FROM market_data
                 ORDER BY distance_km ASC LIMIT 1) as nearest_market
            FROM users u
            LEFT JOIN user_credits uc ON u.id = uc.user_id
            LEFT JOIN farm_health_metrics fh ON u.id = fh.user_id
                AND fh.date = CURRENT_DATE
            WHERE u.id = %s
        """, (user_id,))

        result = cur.fetchone()
        if result:
            first_name, last_name, credit_points, current_rank, farm_health, active_neighbors, nearest_market = result

            # Handle default values for missing data
            credit_points = credit_points or 1247
            current_rank = current_rank or "Gold"
            farm_health = farm_health or 85.0
            active_neighbors = active_neighbors or 0
            nearest_market = nearest_market or {"name": "Green Valley Market", "distance": 12}

            cur.close()
            conn.close()

            return jsonify({
                "firstName": first_name,
                "lastName": last_name,
                "creditPoints": int(credit_points),
                "currentRank": current_rank,
                "farmHealth": float(farm_health),
                "activeNeighbors": int(active_neighbors),
                "nearestMarket": nearest_market
            }), 200

        # If not found in new format, try legacy format
        cur.execute("SELECT firstName, lastName FROM legacy_users WHERE userId = %s", (user_id,))
        user_row = cur.fetchone()
        if user_row:
            first_name, last_name = user_row

            # Get metrics for legacy user
            cur.execute("SELECT credit_points, farm_health FROM user_metrics WHERE user_id = %s", (user_id,))
            metrics_row = cur.fetchone()
            credit_points = metrics_row[0] if metrics_row else 1247
            farm_health = metrics_row[1] if metrics_row and metrics_row[1] else 85.0

            return jsonify({
                "firstName": first_name,
                "lastName": last_name,
                "creditPoints": credit_points,
                "farmHealth": farm_health,
                "activeNeighbors": 0,
                "nearestMarket": {
                    "name": "Green Valley Market",
                    "distance": 12
                }
            }), 200

        cur.close()
        conn.close()
        return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"Dashboard error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/weather-forecast/<user_id>", methods=["GET"])
def get_weather_forecast(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Try new format first - if user_id is UUID
        cur.execute("""
            SELECT
                forecast_date as date,
                temperature_max as high,
                temperature_min as low,
                weather_condition as condition,
                humidity,
                precipitation_probability as rain_chance
            FROM nasa_weather_forecast
            WHERE user_id = %s
                AND forecast_date >= CURRENT_DATE
                AND forecast_date <= CURRENT_DATE + INTERVAL '7 days'
            ORDER BY forecast_date ASC
        """, (user_id,))

        weather_rows = cur.fetchall()

        # If no data found, insert sample data for this user
        if not weather_rows:
            from datetime import datetime, timedelta
            today = datetime.now().date()

            sample_weather = []
            for i in range(7):
                forecast_date = today + timedelta(days=i)
                sample_weather.append((
                    user_id, forecast_date,
                    28 - i*0.5, 18 - i*0.5,
                    ["Clear skies", "Partly cloudy", "Light rain", "Windy", "Sunny"][min(i, 4)],
                    10.0 + i*5.0,  # precipitation_probability
                    65 - i*2,  # humidity
                    5.0 + i*0.5  # wind_speed (not used in response)
                ))

            cur.executemany("""
                INSERT INTO nasa_weather_forecast (user_id, forecast_date, temperature_max, temperature_min, weather_condition, precipitation_probability, humidity, wind_speed)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, forecast_date) DO NOTHING
            """, sample_weather)
            conn.commit()

            # Fetch the inserted data
            cur.execute("""
                SELECT
                    forecast_date as date,
                    temperature_max as high,
                    temperature_min as low,
                    weather_condition as condition,
                    humidity,
                    precipitation_probability as rain_chance
                FROM nasa_weather_forecast
                WHERE user_id = %s
                    AND forecast_date >= CURRENT_DATE
                    AND forecast_date <= CURRENT_DATE + INTERVAL '7 days'
                ORDER BY forecast_date ASC
            """, (user_id,))
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
        print(f"Weather forecast error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Keep old endpoint for backward compatibility
@app.route("/weather-forecast", methods=["GET"])
def get_weather_forecast_legacy():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Insert sample data into legacy table if needed
        cur.execute("""
            INSERT INTO weather_forecast (date, temperature_high, temperature_low, condition, humidity, chance_of_rain)
            VALUES
                (CURRENT_DATE, 28, 18, 'Clear skies', 65, 10),
                (CURRENT_DATE + 1, 27, 17, 'Partly cloudy', 70, 20),
                (CURRENT_DATE + 2, 26, 16, 'Light rain', 75, 80),
                (CURRENT_DATE + 3, 29, 19, 'Sunny', 60, 5)
            ON CONFLICT DO NOTHING
        """)
        conn.commit()

        cur.execute("""
            SELECT date, temperature_high, temperature_low, condition, humidity, chance_of_rain
            FROM weather_forecast
            WHERE date >= CURRENT_DATE
            ORDER BY date ASC
            LIMIT 7
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

        # Check if user_id is UUID format (new schema)
        if len(user_id) == 36:  # UUID format
            cur.execute("""
                SELECT
                    ROUND((nsd.surface_wetness)::numeric, 0) as moisture,
                    65 as nitrogen,
                    6.5 as ph,
                    ROUND(nsd.soil_temperature_0_5cm::numeric, 0) as temperature
                FROM nasa_soil_data nsd
                WHERE nsd.user_id = %s
                    AND nsd.date = CURRENT_DATE
                ORDER BY nsd.created_at DESC
                LIMIT 1
            """, (user_id,))

            soil_row = cur.fetchone()

            if not soil_row:
                # Insert sample NASA soil data if none exists
                # First, ensure we have a farm zone for this user
                cur.execute("""
                    INSERT INTO farm_zones (user_id, zone_name, crop_type, area_hectares)
                    VALUES (%s, 'A', 'Mixed Crops', 5.0)
                    ON CONFLICT (user_id, zone_name) DO NOTHING
                    RETURNING id
                """, (user_id,))

                zone_result = cur.fetchone()
                zone_id = zone_result[0] if zone_result else None

                if zone_id:
                    cur.execute("""
                        INSERT INTO nasa_soil_data (user_id, zone_id, date, soil_moisture_0_5cm, soil_temperature_0_5cm, surface_wetness)
                        VALUES (%s, %s, CURRENT_DATE, 0.25, 22.5, 78.0)
                        ON CONFLICT (user_id, zone_id, date) DO NOTHING
                    """, (user_id, zone_id))
                    conn.commit()

                    # Fetch the inserted data
                    cur.execute("""
                        SELECT
                            ROUND((nsd.surface_wetness)::numeric, 0) as moisture,
                            65 as nitrogen,
                            6.5 as ph,
                            ROUND(nsd.soil_temperature_0_5cm::numeric, 0) as temperature
                        FROM nasa_soil_data nsd
                        WHERE nsd.user_id = %s AND nsd.date = CURRENT_DATE
                        ORDER BY nsd.created_at DESC
                        LIMIT 1
                    """, (user_id,))
                    soil_row = cur.fetchone()

            if soil_row:
                moisture, nitrogen, ph, temp = soil_row

                cur.close()
                conn.close()

                return jsonify({
                    "moisture": float(moisture),
                    "nitrogen": float(nitrogen),
                    "ph": float(ph),
                    "temperature": float(temp)
                }), 200

        # Fallback to legacy table for old userId format
        cur.execute("""
            SELECT moisture_level, nitrogen_level, ph_level, temperature
            FROM soil_conditions
            WHERE user_id = %s
            ORDER BY updated_at DESC
            LIMIT 1
        """, (user_id,))
        soil_row = cur.fetchone()

        if not soil_row:
            # Insert sample data in legacy table if none exists
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
        print(f"Soil conditions error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/ai-recommendations/<user_id>", methods=["GET"])
def get_ai_recommendations(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Try new format first - if user_id is UUID
        if len(user_id) == 36:  # UUID format
            cur.execute("""
                SELECT
                    id,
                    priority,
                    title,
                    description,
                    recommendation_type as type
                FROM nasa_ai_recommendations
                WHERE user_id = %s
                    AND status = 'active'
                    AND (time_window_start IS NULL OR time_window_start <= CURRENT_DATE)
                    AND (time_window_end IS NULL OR time_window_end >= CURRENT_DATE)
                ORDER BY
                    CASE priority
                        WHEN 'High' THEN 1
                        WHEN 'Medium' THEN 2
                        WHEN 'Watch' THEN 3
                        ELSE 4
                    END,
                    created_at DESC
            """, (user_id,))

            recommendation_rows = cur.fetchall()

            # If no recommendations found, insert sample data
            if not recommendation_rows:
                # First ensure we have farm zones
                cur.execute("""
                    INSERT INTO farm_zones (user_id, zone_name, crop_type, area_hectares)
                    VALUES
                        (%s, 'A', 'Wheat', 5.0),
                        (%s, 'B', 'Corn', 3.5),
                        (%s, 'C', 'Vegetables', 2.0)
                    ON CONFLICT (user_id, zone_name) DO NOTHING
                """, (user_id, user_id, user_id))
                conn.commit()

                # Insert sample AI recommendations
                sample_recommendations = [
                    (user_id, None, 'Optimal planting window for tomatoes', 'Soil conditions and weather patterns indicate ideal conditions for the next 5 days. Market demand is high with prices at $4.50/kg.', 'planting', 'High', '["POWER", "SMAP", "MODIS"]', 'Tomatoes', '{"price": 4.50, "unit": "kg", "demand": "high"}'),
                    (user_id, None, 'Consider collaboration with nearby farmers', 'Neighboring farms are planting complementary crops. Coordinating can optimize pest control and earn credit points.', 'collaboration', 'Medium', '["MODIS", "POWER"]', None, '{"potential_points": 150}'),
                    (user_id, None, 'Pest risk increasing for corn fields', 'Satellite data shows increased activity in the region. Consider preventive measures within 48 hours.', 'pest_control', 'Watch', '["MODIS", "FIRMS"]', 'Corn', '{"risk_level": "high", "action": "preventive_treatment"}')
                ]

                cur.executemany("""
                    INSERT INTO nasa_ai_recommendations (user_id, zone_id, title, description, recommendation_type, priority, nasa_datasets_used, crop_suggestion, market_insight)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (user_id, title) DO NOTHING
                """, sample_recommendations)
                conn.commit()

                # Fetch the inserted recommendations
                cur.execute("""
                    SELECT
                        id,
                        priority,
                        title,
                        description,
                        recommendation_type as type
                    FROM nasa_ai_recommendations
                    WHERE user_id = %s
                        AND status = 'active'
                        AND (time_window_start IS NULL OR time_window_start <= CURRENT_DATE)
                        AND (time_window_end IS NULL OR time_window_end >= CURRENT_DATE)
                    ORDER BY
                        CASE priority
                            WHEN 'High' THEN 1
                            WHEN 'Medium' THEN 2
                            WHEN 'Watch' THEN 3
                            ELSE 4
                        END,
                        created_at DESC
                """, (user_id,))
                recommendation_rows = cur.fetchall()

            recommendations = []
            for row in recommendation_rows:
                rec_id, priority, title, description, rec_type = row
                recommendations.append({
                    "id": rec_id,
                    "priority": priority,
                    "title": title,
                    "description": description,
                    "type": rec_type
                })

            cur.close()
            conn.close()

            return jsonify({"recommendations": recommendations}), 200

        # Fallback to static recommendations for legacy users
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

        cur.close()
        conn.close()

        return jsonify({"recommendations": recommendations}), 200

    except Exception as e:
        print(f"AI recommendations error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
