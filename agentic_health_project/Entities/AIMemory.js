{
  "name": "AIMemory",
  "type": "object",
  "properties": {
    "event_type": {
      "type": "string",
      "enum": [
        "surge",
        "pollution",
        "festival",
        "epidemic",
        "weather",
        "anomaly"
      ]
    },
    "description": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "occurred_at": {
      "type": "string",
      "format": "date"
    },
    "peak_cases": {
      "type": "number"
    },
    "duration_days": {
      "type": "number"
    },
    "conditions_observed": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "actions_taken": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "outcome": {
      "type": "string"
    },
    "lessons_learned": {
      "type": "string"
    },
    "aqi_during_event": {
      "type": "number"
    },
    "temperature_during_event": {
      "type": "number"
    },
    "similarity_tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "event_type",
    "description",
    "city"
  ]
}