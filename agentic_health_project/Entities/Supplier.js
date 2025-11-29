{
  "name": "Supplier",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "company_name": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "phone": {
      "type": "string"
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
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Product categories supplied"
    },
    "rating": {
      "type": "number"
    },
    "total_orders": {
      "type": "number"
    },
    "delivery_time_days": {
      "type": "number"
    },
    "is_verified": {
      "type": "boolean",
      "default": false
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "name",
    "company_name",
    "email"
  ]
}