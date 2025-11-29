{
  "name": "SymptomReport",
  "type": "object",
  "properties": {
    "reporter_type": {
      "type": "string",
      "enum": [
        "public",
        "hospital"
      ],
      "default": "public"
    },
    "age_group": {
      "type": "string",
      "enum": [
        "0-12",
        "13-25",
        "26-40",
        "41-60",
        "60+"
      ]
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ]
    },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of symptoms"
    },
    "severity": {
      "type": "string",
      "enum": [
        "mild",
        "moderate",
        "severe"
      ],
      "default": "mild"
    },
    "duration_days": {
      "type": "number"
    },
    "location_city": {
      "type": "string"
    },
    "location_area": {
      "type": "string"
    },
    "latitude": {
      "type": "number"
    },
    "longitude": {
      "type": "number"
    },
    "suspected_disease": {
      "type": "string"
    },
    "has_fever": {
      "type": "boolean"
    },
    "temperature": {
      "type": "number"
    },
    "is_verified": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "symptoms",
    "location_city"
  ]
}