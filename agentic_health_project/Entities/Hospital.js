{
  "name": "Hospital",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Hospital name"
    },
    "code": {
      "type": "string",
      "description": "Unique hospital code"
    },
    "address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string"
    },
    "latitude": {
      "type": "number"
    },
    "longitude": {
      "type": "number"
    },
    "total_beds": {
      "type": "number"
    },
    "icu_beds": {
      "type": "number"
    },
    "emergency_beds": {
      "type": "number"
    },
    "ventilators": {
      "type": "number"
    },
    "contact_phone": {
      "type": "string"
    },
    "contact_email": {
      "type": "string"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "name",
    "code",
    "city"
  ]
}