{
  "name": "Alert",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "alert_type": {
      "type": "string",
      "enum": [
        "surge_warning",
        "resource_critical",
        "anomaly_detected",
        "weather_alert",
        "pollution_alert",
        "epidemic_alert",
        "system"
      ]
    },
    "severity": {
      "type": "string",
      "enum": [
        "info",
        "warning",
        "critical"
      ],
      "default": "info"
    },
    "city": {
      "type": "string"
    },
    "hospital_id": {
      "type": "string"
    },
    "hospital_name": {
      "type": "string"
    },
    "related_prediction_id": {
      "type": "string"
    },
    "is_read": {
      "type": "boolean",
      "default": false
    },
    "is_acknowledged": {
      "type": "boolean",
      "default": false
    },
    "acknowledged_by": {
      "type": "string"
    },
    "acknowledged_at": {
      "type": "string",
      "format": "date-time"
    },
    "action_taken": {
      "type": "string"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "title",
    "message",
    "alert_type",
    "severity"
  ]
}