{
  "name": "AQIWeatherData",
  "type": "object",
  "properties": {
    "city": {
      "type": "string"
    },
    "recorded_at": {
      "type": "string",
      "format": "date-time"
    },
    "aqi": {
      "type": "number",
      "description": "Air Quality Index (0-500)"
    },
    "aqi_category": {
      "type": "string",
      "enum": [
        "good",
        "moderate",
        "unhealthy_sensitive",
        "unhealthy",
        "very_unhealthy",
        "hazardous"
      ]
    },
    "pm25": {
      "type": "number"
    },
    "pm10": {
      "type": "number"
    },
    "no2": {
      "type": "number"
    },
    "so2": {
      "type": "number"
    },
    "co": {
      "type": "number"
    },
    "o3": {
      "type": "number"
    },
    "temperature_celsius": {
      "type": "number"
    },
    "humidity_percent": {
      "type": "number"
    },
    "wind_speed_kmh": {
      "type": "number"
    },
    "wind_direction": {
      "type": "string"
    },
    "precipitation_mm": {
      "type": "number"
    },
    "visibility_km": {
      "type": "number"
    },
    "uv_index": {
      "type": "number"
    },
    "weather_condition": {
      "type": "string"
    }
  },
  "required": [
    "city",
    "aqi",
    "temperature_celsius"
  ]
}