import os
from datetime import datetime, timedelta
from app import get_db_connection
from nasa_data_model import get_agro_climate_data

def update_nasa_data_for_user(user_id: str):
    """
    Orchestrates fetching NASA data for a user and updating the database.

    1. Fetches user's farm coordinates.
    2. Fetches historical and forecast data from NASA POWER API.
    3. Parses the data and upserts it into the relevant database tables.
    """
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1. Get user's farm location
        cur.execute("SELECT farm_latitude, farm_longitude FROM users WHERE id = %s", (user_id,))
        user_location = cur.fetchone()

        if not user_location or not user_location[0] or not user_location[1]:
            print(f"User {user_id} has no farm coordinates set. Skipping NASA data fetch.")
            return

        latitude, longitude = user_location
        print(f"Orchestrating NASA data update for user {user_id} at ({latitude}, {longitude}).")

        # 2. Define date range (e.g., last 30 days for historical data)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        start_str = start_date.strftime("%Y%m%d")
        end_str = end_date.strftime("%Y%m%d")

        # 3. Fetch data from NASA
        nasa_data = get_agro_climate_data(latitude, longitude, start_str, end_str)

        if not nasa_data:
            print(f"Failed to fetch NASA data for user {user_id}.")
            return

        # 4. Process and store the data
        dates = sorted(nasa_data.get("T2M", {}).keys())
        if not dates:
            print("NASA data received, but no date entries found.")
            return

        weather_records_to_upsert = []
        soil_records_to_upsert = []

        # Ensure a default farm zone exists to link soil data
        cur.execute("""
            INSERT INTO farm_zones (user_id, zone_name, crop_type, area_hectares)
            VALUES (%s, 'Default Zone', 'Unassigned', 0)
            ON CONFLICT (user_id, zone_name) DO NOTHING
            RETURNING id
        """, (user_id,))
        zone_result = cur.fetchone()
        if zone_result:
            zone_id = zone_result[0]
        else:
            cur.execute("SELECT id FROM farm_zones WHERE user_id = %s AND zone_name = 'Default Zone'", (user_id,))
            zone_id = cur.fetchone()[0]

        for date_str in dates:
            def get_nasa_value(param):
                """Helper to get value from NASA data, returning None if it's a fill value."""
                value = nasa_data.get(param, {}).get(date_str)
                return None if value is None or value <= -999 else value

            # Prepare weather data record
            weather_records_to_upsert.append((
                user_id,
                datetime.strptime(date_str, "%Y%m%d").date(),
                nasa_data.get("T2M", {}).get(date_str),
                nasa_data.get("PRECTOTCORR", {}).get(date_str),
                nasa_data.get("EVAP", {}).get(date_str)
                get_nasa_value("T2M"),
                get_nasa_value("PRECTOTCORR"),
                get_nasa_value("EVAP")
            ))

            # Prepare soil data record
            soil_records_to_upsert.append((
                user_id,
                zone_id,
                datetime.strptime(date_str, "%Y%m%d").date(),
                nasa_data.get("SM_0_10cm", {}).get(date_str),
                nasa_data.get("TS", {}).get(date_str),
                nasa_data.get("GWETTOP", {}).get(date_str)
                get_nasa_value("SM_0_10cm"),
                get_nasa_value("TS"),
                get_nasa_value("GWETTOP")
            ))

        # 5. Upsert (Insert or Update) records into the database
        # Using ON CONFLICT to handle existing records gracefully
        upsert_weather_query = """
            INSERT INTO nasa_weather_data (user_id, date, temperature_2m_avg, precipitation, eto)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id, date) DO UPDATE SET
                temperature_2m_avg = EXCLUDED.temperature_2m_avg,
                precipitation = EXCLUDED.precipitation,
                eto = EXCLUDED.eto;
        """
        cur.executemany(upsert_weather_query, weather_records_to_upsert)
        print(f"Upserted {len(weather_records_to_upsert)} records into nasa_weather_data.")

        upsert_soil_query = """
            INSERT INTO nasa_soil_data (user_id, zone_id, date, soil_moisture_0_5cm, soil_temperature_0_5cm, surface_wetness)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id, zone_id, date) DO UPDATE SET
                soil_moisture_0_5cm = EXCLUDED.soil_moisture_0_5cm,
                soil_temperature_0_5cm = EXCLUDED.soil_temperature_0_5cm,
                surface_wetness = EXCLUDED.surface_wetness;
        """
        cur.executemany(upsert_soil_query, soil_records_to_upsert)
        print(f"Upserted {len(soil_records_to_upsert)} records into nasa_soil_data.")

        conn.commit()

    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    # Example of how to run the orchestration for a specific user
    # In a real app, you might get this from a logged-in session
    # For this example, we need a user with coordinates in the DB.
    # Let's assume a user with this UUID exists.
    example_user_id = "a_valid_uuid_from_your_users_table"
    print(f"Running standalone orchestration for user: {example_user_id}")
    # update_nasa_data_for_user(example_user_id)
    print("To run this, replace 'a_valid_uuid_from_your_users_table' with a real user UUID and uncomment the line above.")