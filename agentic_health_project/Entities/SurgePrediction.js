{
  "name": "SurgePrediction",
  "type": "object",
  "properties": {
    "city": {
      "type": "string"
    },
    "prediction_date": {
      "type": "string",
      "format": "date"
    },
    "prediction_horizon_days": {
      "type": "number",
      "description": "Days ahead this prediction covers"
    },
    "predicted_cases": {
      "type": "number"
    },
    "predicted_cases_lower": {
      "type": "number"
    },
    "predicted_cases_upper": {
      "type": "number"
    },
    "baseline_cases": {
      "type": "number"
    },
    "surge_factor": {
      "type": "number"
    },
    "risk_level": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ]
    },
    "confidence_score": {
      "type": "number"
    },
    "contributing_factors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "factor": {
            "type": "string"
          },
          "impact_score": {
            "type": "number"
          }
        }
      }
    },
    "likely_conditions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "condition": {
            "type": "string"
          },
          "probability": {
            "type": "number"
          },
          "expected_cases": {
            "type": "number"
          }
        }
      }
    },
    "is_anomaly": {
      "type": "boolean",
      "default": false
    },
    "anomaly_score": {
      "type": "number"
    },
    "model_version": {
      "type": "string"
    }
  },
  "required": [
    "city",
    "prediction_date",
    "predicted_cases"
  ]
}