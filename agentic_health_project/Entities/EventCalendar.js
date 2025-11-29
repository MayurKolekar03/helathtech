{
  "name": "EventCalendar",
  "type": "object",
  "properties": {
    "event_name": {
      "type": "string"
    },
    "event_type": {
      "type": "string",
      "enum": [
        "festival",
        "pollution_event",
        "weather_event",
        "mass_gathering",
        "epidemic_alert",
        "other"
      ]
    },
    "start_date": {
      "type": "string",
      "format": "date"
    },
    "end_date": {
      "type": "string",
      "format": "date"
    },
    "affected_cities": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "expected_crowd_size": {
      "type": "number"
    },
    "historical_surge_factor": {
      "type": "number",
      "description": "Multiplier for expected patient surge"
    },
    "common_conditions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Commonly seen health conditions during this event"
    },
    "risk_level": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "default": "medium"
    },
    "notes": {
      "type": "string"
    },
    "is_recurring": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "event_name",
    "event_type",
    "start_date"
  ]
}