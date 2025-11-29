{
  "name": "HospitalStatus",
  "type": "object",
  "properties": {
    "hospital_id": {
      "type": "string",
      "description": "Reference to Hospital"
    },
    "hospital_name": {
      "type": "string"
    },
    "occupied_beds": {
      "type": "number"
    },
    "occupied_icu": {
      "type": "number"
    },
    "occupied_emergency": {
      "type": "number"
    },
    "available_ventilators": {
      "type": "number"
    },
    "current_patients": {
      "type": "number"
    },
    "waiting_patients": {
      "type": "number"
    },
    "staff_on_duty": {
      "type": "number"
    },
    "doctors_available": {
      "type": "number"
    },
    "nurses_available": {
      "type": "number"
    },
    "oxygen_stock_hours": {
      "type": "number",
      "description": "Hours of oxygen supply remaining"
    },
    "blood_units_available": {
      "type": "number"
    },
    "status_level": {
      "type": "string",
      "enum": [
        "normal",
        "elevated",
        "high",
        "critical"
      ],
      "default": "normal"
    },
    "notes": {
      "type": "string"
    },
    "reported_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "hospital_id",
    "hospital_name"
  ]
}