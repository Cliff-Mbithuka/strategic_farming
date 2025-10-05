import requests
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

NASA_API_KEY = os.environ.get("NASA_API_KEY")
if not NASA_API_KEY or NASA_API_KEY == "YOUR_NASA_API_KEY":
    raise ValueError("NASA_API_KEY not found or not set in .env file. Please get a key from https://power.larc.nasa.gov/docs/services/api/request-api-key/")

def get_agro_climate_data(latitude, longitude, start_date, end_date):
    """
    Fetches agro-climatological data (climate, soil, vegetation health, weather patterns)
    from NASA POWER API for a specific location and time period.
    """
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    parameters = [
        # Parameter                       # Description
        # ---------------------------------------------------------------------------------
        "T2M",                          # Temperature at 2 Meters (C)
        "T2M_MAX",                      # Max Temperature at 2 Meters (C)
        "T2M_MIN",                      # Min Temperature at 2 Meters (C)
        "PRECTOTCORR",                  # Precipitation Corrected (mm/day)
        "WS10M",                        # Wind Speed at 10 Meters (m/s)
        "RH2M",                         # Relative Humidity at 2 Meters (%)
        "ALLSKY_SFC_SW_DWN",            # All Sky Insolation Incident on a Horizontal Surface (kW-hr/m^2/day)

        # Soil & Evapotranspiration Parameters
        "TS",                           # Earth Skin Temperature (C) - good proxy for soil_temperature_0_5cm
        "GWETTOP",                      # Surface Soil Wetness (0-1, where 1 is saturated) - for surface_wetness
        "SM_0_10cm",                    # Volumetric Soil Moisture at 0-10cm depth (m^3/m^3) - for soil_moisture_0_5cm
        "EVAP",                         # Evapotranspiration (mm/day) - for eto

        # Other Agro-related Parameters
        "QV2M",                         # Specific Humidity at 2 Meters (g/kg)
        "PS"                            # Surface Pressure (kPa)
    ]

    payload = {
        "parameters": ",".join(parameters),
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": start_date,
        "end": end_date,
        "format": "JSON",
        "api_key": NASA_API_KEY
    }

    try:
        response = requests.get(base_url, params=payload)
        response.raise_for_status()
        data = response.json()

        # Extract key parts neatly
        results = data.get("properties", {}).get("parameter", {})
        return results

    except requests.exceptions.RequestException as e:
        print(f"Error fetching NASA data: {e}")
        return None


if __name__ == '__main__':
    lat = -1.2921   # Nairobi, Kenya
    lon = 36.8219   # Longitude for Nairobi
    start = "20240501"
    end = "20240505"

    print(f"Fetching NASA agro-climate data for location ({lat}, {lon}) from {start} to {end}...")
    agro_data = get_agro_climate_data(lat, lon, start, end)

    if agro_data:
        print("✅ Data fetched successfully!\n")

        # Let's process and display the data in a more readable table format
        # Get the list of dates from the first parameter
        dates = sorted(agro_data.get("T2M", {}).keys())
        
        if not dates:
            print("No data returned for the given parameters.")
        else:
            # Print table header
            header = f"{'Date':<12} | {'Avg Temp (C)':<15} | {'Max Temp (C)':<15} | {'Precip (mm)':<15} | {'Humidity (%)':<15}"
            print(header)
            print("-" * len(header))

            # Print data for each date
            for date_str in dates:
                dt = datetime.strptime(date_str, "%Y%m%d")
                formatted_date = dt.strftime("%Y-%m-%d")
                avg_temp = agro_data.get("T2M", {}).get(date_str, 'N/A')
                max_temp = agro_data.get("T2M_MAX", {}).get(date_str, 'N/A')
                precip = agro_data.get("PRECTOTCORR", {}).get(date_str, 'N/A')
                humidity = agro_data.get("RH2M", {}).get(date_str, 'N/A')
                print(f"{formatted_date:<12} | {avg_temp:<15.2f} | {max_temp:<15.2f} | {precip:<15.2f} | {humidity:<15.2f}")
    else:
        print("❌ Failed to fetch data.")
