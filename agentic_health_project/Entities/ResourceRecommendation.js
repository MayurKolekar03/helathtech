{
  "name": "ResourceRecommendation",
  "type": "object",
  "properties": {
    "city": {
      "type": "string"
    },
    "hospital_id": {
      "type": "string"
    },
    "hospital_name": {
      "type": "string"
    },
    "recommendation_date": {
      "type": "string",
      "format": "date"
    },
    "valid_until": {
      "type": "string",
      "format": "date"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium"
    },
    "staffing_recommendations": {
      "type": "object",
      "properties": {
        "additional_doctors": {
          "type": "number"
        },
        "additional_nurses": {
          "type": "number"
        },
        "additional_support_staff": {
          "type": "number"
        },
        "specialists_needed": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "supply_recommendations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "item_name": {
            "type": "string"
          },
          "current_stock": {
            "type": "number"
          },
          "recommended_stock": {
            "type": "number"
          },
          "urgency": {
            "type": "string"
          }
        }
      }
    },
    "bed_recommendations": {
      "type": "object",
      "properties": {
        "additional_general_beds": {
          "type": "number"
        },
        "additional_icu_beds": {
          "type": "number"
        },
        "additional_emergency_beds": {
          "type": "number"
        }
      }
    },
    "estimated_cost": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "acknowledged",
        "in_progress",
        "completed"
      ],
      "default": "pending"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "city",
    "recommendation_date"
  ]
}