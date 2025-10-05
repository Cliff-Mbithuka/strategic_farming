#!/usr/bin/env python3
"""
Data Initialization Script for Strategic Farming Application

This script initializes a new user with all required data including:
- User profile
- Farm zones
- NASA weather and soil data
- AI recommendations
- Market data and neighbors
- Credit system
"""

import os
import uuid
import hashlib
import psycopg2
from datetime import datetime, date, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_tables():
    """Create all required database tables in correct dependency order"""
    conn = get_db_connection()
    cur = conn.cursor()

    # Create tables in dependency order (no foreign keys first)
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
        );

        CREATE TABLE IF NOT EXISTS market_data (
            id SERIAL PRIMARY KEY,
            market_name VARCHAR(255) NOT NULL,
            latitude DECIMAL(10, 6),
            longitude DECIMAL(10, 6),
            distance_km DECIMAL(8, 2),
            commodity_prices JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_credits (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            total_points INTEGER DEFAULT 0,
            current_rank VARCHAR(50) DEFAULT 'Bronze',
            points_to_next_rank INTEGER DEFAULT 500,
            monthly_change_percent DECIMAL(5, 2) DEFAULT 0.0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
        );

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
        );

        CREATE TABLE IF NOT EXISTS farm_neighbors (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            neighbor_name VARCHAR(255) NOT NULL,
            distance_km DECIMAL(5, 2),
            farm_type VARCHAR(100),
            collaboration_status VARCHAR(50) DEFAULT 'potential',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, neighbor_name)
        );

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
        );

        CREATE TABLE IF NOT EXISTS nasa_weather_data (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            date DATE NOT NULL,
            temperature_2m_avg DECIMAL(5, 2),
            precipitation DECIMAL(5, 2),
            eto DECIMAL(5, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, date)
        );

        CREATE TABLE IF NOT EXISTS nasa_vegetation_data (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            date DATE NOT NULL,
            crop_health_score DECIMAL(5, 2),
            vegetation_density DECIMAL(5, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, date)
        );

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
        );

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
        );

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
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

def get_db_connection():
    """Get database connection"""
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
    )

def initialize_user_data(user_data=None):
    """
    Initialize complete user data for a new user

    Args:
        user_data: Optional dict with user data. If None, creates default user.
    """
    if user_data is None:
        user_data = {
            'id': str(uuid.uuid4()),
            'username': 'markfarmer',
            'email': 'mark@gmail.com',
            'first_name': 'Mark',
            'last_name': 'Farmer',
            'farm_name': 'Green Valley Farm',
            'farm_latitude': 40.7128,
            'farm_longitude': -74.0060,
            'farm_size_hectares': 10.5
        }

    user_id = user_data['id']

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        print(f"Initializing data for user: {user_data['first_name']} {user_data['last_name']}")

        # 1. Insert user
        cur.execute("""
            INSERT INTO users (id, username, email, first_name, last_name, farm_name, farm_latitude, farm_longitude, farm_size_hectares)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (
            user_id,
            user_data['username'],
            user_data['email'],
            user_data['first_name'],
            user_data['last_name'],
            user_data['farm_name'],
            user_data['farm_latitude'],
            user_data['farm_longitude'],
            user_data['farm_size_hectares']
        ))

        # 1b. Insert legacy user for authentication
        hashed_password = hash_password('1234')
        cur.execute("""
            INSERT INTO legacy_users (userId, firstName, lastName, email, password)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING
        """, (
            user_id,  # Use same ID for consistency
            user_data['first_name'],
            user_data['last_name'],
            user_data['email'],
            hashed_password
        ))

        # 2. Insert farm zones
        farm_zones = [
            ('A', 'Wheat', 5.0, 'active', '#10B981'),
            ('B', 'Corn', 3.5, 'active', '#10B981'),
            ('C', 'Vegetables', 2.0, 'active', '#F59E0B'),
            ('D', None, 1.5, 'fallow', '#6B7280')
        ]

        for zone_name, crop_type, area, status, color in farm_zones:
            cur.execute("""
                INSERT INTO farm_zones (user_id, zone_name, crop_type, area_hectares, status, color_code)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, zone_name) DO NOTHING
            """, (user_id, zone_name, crop_type, area, status, color))

        # 3. Initialize credits
        cur.execute("""
            INSERT INTO user_credits (user_id, total_points, current_rank, points_to_next_rank, monthly_change_percent)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id) DO NOTHING
        """, (user_id, 1247, 'Gold', 253, 12.5))

        # 4. Insert market data
        cur.execute("""
            INSERT INTO market_data (market_name, latitude, longitude, distance_km, commodity_prices)
            VALUES (%s, %s, %s, %s, %s::jsonb)
            ON CONFLICT DO NOTHING
        """, (
            'Green Valley Market',
            40.7200,
            -74.0100,
            12.0,
            '{"tomato": 4.50, "corn": 2.30, "wheat": 1.80}'
        ))

        # 5. Insert neighbors
        neighbors = [
            ('Smith Family Farm', 2.5, 'Mixed', 'active'),
            ('Johnson Organic', 3.8, 'Vegetables', 'active'),
            ('Davis Ranch', 5.2, 'Livestock', 'potential')
        ]

        for neighbor_name, distance, farm_type, status in neighbors:
            cur.execute("""
                INSERT INTO farm_neighbors (user_id, neighbor_name, distance_km, farm_type, collaboration_status)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (user_id, neighbor_name) DO NOTHING
            """, (user_id, neighbor_name, distance, farm_type, status))

        # 6. Insert NASA weather forecast data (7 days)
        today = date.today()
        weather_data = []
        for i in range(7):
            forecast_date = today + timedelta(days=i)
            weather_data.append((
                user_id, forecast_date,
                28 - i*0.5, 18 - i*0.5,
                ["Clear skies", "Partly cloudy", "Light rain", "Windy", "Sunny"][min(i, 4)],
                10.0 + i*5.0,  # precipitation_probability
                65 - i*2,      # humidity
                5.0 + i*0.5   # wind_speed
            ))

        cur.executemany("""
            INSERT INTO nasa_weather_forecast (user_id, forecast_date, temperature_max, temperature_min, weather_condition, precipitation_probability, humidity, wind_speed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id, forecast_date) DO NOTHING
        """, weather_data)

        # 7. Insert NASA soil data (get zone A)
        cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = 'A'", (user_id,))
        zone_a = cur.fetchone()

        if zone_a:
            zone_a_id = zone_a[0]
            cur.execute("""
                INSERT INTO nasa_soil_data (user_id, zone_id, date, soil_moisture_0_5cm, soil_temperature_0_5cm, surface_wetness)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, zone_id, date) DO NOTHING
            """, (user_id, zone_a_id, today, 0.25, 22.5, 78.0))

        # 8. Insert NASA vegetation data
        cur.execute("""
            INSERT INTO nasa_vegetation_data (user_id, date, crop_health_score, vegetation_density)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, date) DO NOTHING
        """, (user_id, today, 75.0, 0.85))

        # 9. Insert NASA weather data (historical)
        cur.execute("""
            INSERT INTO nasa_weather_data (user_id, date, temperature_2m_avg, precipitation, eto)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id, date) DO NOTHING
        """, (user_id, today, 23.0, 2.5, 3.2))

        # 10. Insert farm health metrics
        cur.execute("""
            INSERT INTO farm_health_metrics (user_id, date, overall_health_score, soil_health_score, crop_health_score, water_efficiency_score, nasa_data_sources)
            VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb)
            ON CONFLICT (user_id, date) DO NOTHING
        """, (user_id, today, 85.0, 78.0, 75.0, 82.0, '["POWER", "SMAP", "MODIS"]'))

        # 11. Insert AI recommendations
        get_zone_id = lambda zone_name: cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = %s", (user_id, zone_name)) or cur.fetchone()

        cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = 'A'", (user_id,))
        zone_a_result = cur.fetchone()
        cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = 'B'", (user_id,))
        zone_b_result = cur.fetchone()
        cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = 'C'", (user_id,))
        zone_c_result = cur.fetchone()

        zone_a_id = zone_a_result[0] if zone_a_result else None
        zone_b_id = zone_b_result[0] if zone_b_result else None
        zone_c_id = zone_c_result[0] if zone_c_result else None

        recommendations = [
            (user_id, zone_a_id, 'Optimal planting window for tomatoes', 'Soil conditions and weather patterns indicate ideal conditions for the next 5 days. Market demand is high with prices at $4.50/kg.', 'planting', 'High', '["POWER", "SMAP", "MODIS"]', 'Tomatoes', '{"price": 4.50, "unit": "kg", "demand": "high"}', 85.5),
            (user_id, zone_b_id, 'Consider collaboration with nearby farmers', 'Neighboring farms are planting complementary crops. Coordinating can optimize pest control and earn credit points.', 'collaboration', 'Medium', '["MODIS", "POWER"]', None, '{"potential_points": 150}', 72.0),
            (user_id, zone_c_id, 'Pest risk increasing for corn fields', 'Satellite data shows increased activity in the region. Consider preventive measures within 48 hours.', 'pest_control', 'Watch', '["MODIS", "FIRMS"]', 'Corn', '{"risk_level": "high", "action": "preventive_treatment"}', 65.0)
        ]

        for rec in recommendations:
            cur.execute("""
                INSERT INTO nasa_ai_recommendations (user_id, zone_id, title, description, recommendation_type, priority, nasa_datasets_used, crop_suggestion, market_insight, expected_impact_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s::jsonb, %s)
                ON CONFLICT (user_id, title) DO NOTHING
            """, rec)

        # Commit all changes
        conn.commit()

        print(f"Successfully initialized data for user {user_data['first_name']} {user_data['last_name']}")
        print(f"User ID: {user_id}")

        return user_id

    except Exception as e:
        print(f"Error initializing user data: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
        raise e

    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

def create_demo_user():
    """Create a demo user with all initialized data"""
    return initialize_user_data()

if __name__ == "__main__":
    print("Strategic Farming - User Data Initialization")
    print("=" * 50)

    print("Creating database tables...")
    create_tables()
    print("Tables created successfully.")

    user_id = create_demo_user()

    print("\nInitialization complete!")
    print(f"Demo user created with ID: {user_id}")
    print("\nYou can now start the Flask server and test the API endpoints.")
