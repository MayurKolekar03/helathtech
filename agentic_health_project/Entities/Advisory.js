{
  "name": "Advisory",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "content_hindi": {
      "type": "string"
    },
    "content_regional": {
      "type": "string"
    },
    "advisory_type": {
      "type": "string",
      "enum": [
        "health",
        "pollution",
        "weather",
        "epidemic",
        "festival",
        "general"
      ]
    },
    "target_audience": {
      "type": "string",
      "enum": [
        "public",
        "hospitals",
        "both"
      ],
      "default": "public"
    },
    "city": {
      "type": "string"
    },
    "severity": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "default": "medium"
    },
    "valid_from": {
      "type": "string",
      "format": "date"
    },
    "valid_until": {
      "type": "string",
      "format": "date"
    },
    "precautions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "symptoms_to_watch": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "source": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "content",
    "advisory_type"
  ]
}