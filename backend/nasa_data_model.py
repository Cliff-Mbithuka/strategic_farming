import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

NASA_API_KEY = os.environ.get("NASA_API_KEY", "YOUR_NASA_API_KEY")

def get_agro_climate_data(latitude, longitude, start_date, end_date):
    """
    Fetches agro-climatological data (climate, soil, vegetation health, weather patterns)
    from NASA POWER API for a specific location and time period.
    """
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    parameters = [
        # Weather / Climate
        "T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "WS10M", "RH2M", "ALLSKY_SFC_SW_DWN",
        
        # Soil
        "TS", "T10M", "MOISTURE",
        
        # Evapotranspiration & Vegetation health drivers
        "QV2M", "PS", "SHTFL", "LHTFL"  # (Humidity ratio, pressure, sensible & latent heat flux)
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
    lon = 36.8219
    start = "20240920"
    end = "20240925"

    print(f"Fetching NASA agro-climate data for ({lat}, {lon})...")
    agro_data = get_agro_climate_data(lat, lon, start, end)

    if agro_data:
        print("✅ Data fetched successfully!\n")
        for key, values in agro_data.items():
            print(f"📊 {key}: {list(values.items())[:3]} ...")  # show first 3 days per parameter
    else:
        print("❌ Failed to fetch data.")
