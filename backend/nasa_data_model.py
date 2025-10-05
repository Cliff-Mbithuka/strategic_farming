import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the NASA API key from environment variables
NASA_API_KEY = os.environ.get("NASA_API_KEY", "YOUR_NASA_API_KEY")

def get_agro_data(latitude, longitude, start_date, end_date):
    """
    Fetches agro-climatological data from the NASA POWER API.

    Args:
        latitude (float): Latitude of the location.
        longitude (float): Longitude of the location.
        start_date (str): Start date in YYYYMMDD format.
        end_date (str): End date in YYYYMMDD format.

    Returns:
        dict: A dictionary containing the fetched data, or None if an error occurs.
    """
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    # Define the parameters for the API request.
    # These parameters cover soil, crop, climate, vegetation, and weather.
    parameters = [
        # Climate / Weather
        "T2M",           # Temperature at 2 Meters
        "T2M_MAX",       # Maximum Temperature at 2 Meters
        "T2M_MIN",       # Minimum Temperature at 2 Meters
        "PRECTOTCORR",   # Precipitation
        "WS10M",         # Wind Speed at 10 Meters
        "RH2M",          # Relative Humidity at 2 Meters
        "ALLSKY_SFC_SW_DWN", # All Sky Insolation Incident on a Horizontal Surface
        
        # Soil Data
        "TS",            # Earth Skin Temperature
        "T10M",          # Temperature at 10 Meters (related to soil)
        "MOISTURE",      # Soil Moisture
        
        # Vegetation Health (inferred from climate data)
        # Direct vegetation indices are not in this daily API, but these are key drivers.
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
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NASA POWER API: {e}")
        return None

if __name__ == '__main__':
    # Example usage:
    # Replace with a location and date range of your choice.
    lat = 34.0522  # Los Angeles
    lon = -118.2437
    start = "20230101"
    end = "20230110"

    print(f"Fetching data for Latitude: {lat}, Longitude: {lon} from {start} to {end}")
    
    agro_data = get_agro_data(lat, lon, start, end)

    if agro_data:
        print("Successfully fetched data.")
        # You can now process the `agro_data` dictionary as needed.
        # For example, print the temperature for the first day:
        first_day = next(iter(agro_data['properties']['parameter']['T2M']))
        temp = agro_data['properties']['parameter']['T2M'][first_day]
        print(f"Temperature on {first_day}: {temp}°C")
    else:
        print("Failed to fetch data.")
