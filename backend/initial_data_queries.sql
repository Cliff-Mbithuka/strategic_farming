-- Initial data queries for Strategic Farming Application
-- Run these queries after creating the database tables
-- Replace the user_id UUID with a generated one if needed

-- Set a fixed user ID (generate with uuid4() if running script)
-- For manual insert, use this UUID: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- If you want a different UUID, replace all occurrences below

-- 1. Insert user
INSERT INTO users (id, username, email, first_name, last_name, farm_name, farm_latitude, farm_longitude, farm_size_hectares)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'markfarmer', 'mark@gmail.com', 'Mark', 'Farmer', 'Green Valley Farm', 40.7128, -74.0060, 10.5);

-- 1b. Insert legacy user for authentication
-- Password hash for '1234'
INSERT INTO legacy_users (userId, firstName, lastName, email, password)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Mark', 'Farmer', 'mark@gmail.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');

-- 2. Insert farm zones (assumes auto-increment ids: A=1, B=2, C=3, D=4)
INSERT INTO farm_zones (user_id, zone_name, crop_type, area_hectares, status, color_code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A', 'Wheat', 5.0, 'active', '#10B981'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B', 'Corn', 3.5, 'active', '#10B981'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'C', 'Vegetables', 2.0, 'active', '#F59E0B'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'D', NULL, 1.5, 'fallow', '#6B7280');

-- 3. Initialize credits
INSERT INTO user_credits (user_id, total_points, current_rank, points_to_next_rank, monthly_change_percent)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1247, 'Gold', 253, 12.5);

-- 4. Insert market data (global, no user_id)
INSERT INTO market_data (market_name, latitude, longitude, distance_km, commodity_prices)
VALUES ('Green Valley Market', 40.7200, -74.0100, 12.0, '{"tomato": 4.50, "corn": 2.30, "wheat": 1.80}');

-- 5. Insert neighbors
INSERT INTO farm_neighbors (user_id, neighbor_name, distance_km, farm_type, collaboration_status) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Smith Family Farm', 2.5, 'Mixed', 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Johnson Organic', 3.8, 'Vegetables', 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Davis Ranch', 5.2, 'Livestock', 'potential');

-- 6. Insert NASA weather forecast data (7 days from 2025-10-05)
-- Adjust dates if today is different
INSERT INTO nasa_weather_forecast (user_id, forecast_date, temperature_max, temperature_min, weather_condition, precipitation_probability, humidity, wind_speed) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-05', 28.0, 18.0, 'Clear skies', 10.0, 65.0, 5.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-06', 27.5, 17.5, 'Partly cloudy', 15.0, 63.0, 5.5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-07', 27.0, 17.0, 'Light rain', 20.0, 61.0, 6.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-08', 26.5, 16.5, 'Windy', 25.0, 59.0, 6.5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-09', 26.0, 16.0, 'Sunny', 30.0, 57.0, 7.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-10', 25.5, 15.5, 'Clear skies', 35.0, 55.0, 7.5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-11', 25.0, 15.0, 'Partly cloudy', 40.0, 53.0, 8.0);

-- 7. Insert NASA soil data (for zone A, id=1, date=2025-10-05)
INSERT INTO nasa_soil_data (user_id, zone_id, date, soil_moisture_0_5cm, soil_temperature_0_5cm, surface_wetness)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, '2025-10-05', 0.25, 22.5, 78.0);

-- 8. Insert NASA vegetation data
INSERT INTO nasa_vegetation_data (user_id, date, crop_health_score, vegetation_density)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-05', 75.0, 0.85);

-- 9. Insert NASA weather data (historical)
INSERT INTO nasa_weather_data (user_id, date, temperature_2m_avg, precipitation, eto)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-05', 23.0, 2.5, 3.2);

-- 10. Insert farm health metrics
INSERT INTO farm_health_metrics (user_id, date, overall_health_score, soil_health_score, crop_health_score, water_efficiency_score, nasa_data_sources)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-05', 85.0, 78.0, 75.0, 82.0, '["POWER", "SMAP", "MODIS"]');

-- 11. Insert AI recommendations
INSERT INTO nasa_ai_recommendations (user_id, zone_id, title, description, recommendation_type, priority, nasa_datasets_used, crop_suggestion, market_insight, expected_impact_score) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'Optimal planting window for tomatoes', 'Soil conditions and weather patterns indicate ideal conditions for the next 5 days. Market demand is high with prices at $4.50/kg.', 'planting', 'High', '["POWER", "SMAP", "MODIS"]', 'Tomatoes', '{"price": 4.50, "unit": "kg", "demand": "high"}', 85.5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 'Consider collaboration with nearby farmers', 'Neighboring farms are planting complementary crops. Coordinating can optimize pest control and earn credit points.', 'collaboration', 'Medium', '["MODIS", "POWER"]', NULL, '{"potential_points": 150}', 72.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 'Pest risk increasing for corn fields', 'Satellite data shows increased activity in the region. Consider preventive measures within 48 hours.', 'pest_control', 'Watch', '["MODIS", "FIRMS"]', 'Corn', '{"risk_level": "high", "action": "preventive_treatment"}', 65.0);
