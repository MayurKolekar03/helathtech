{
  "name": "SupplierProduct",
  "type": "object",
  "properties": {
    "supplier_id": {
      "type": "string"
    },
    "supplier_name": {
      "type": "string"
    },
    "product_name": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "medicines",
        "ppe",
        "oxygen",
        "ventilators",
        "beds",
        "monitors",
        "surgical",
        "diagnostic",
        "consumables",
        "other"
      ]
    },
    "description": {
      "type": "string"
    },
    "unit": {
      "type": "string"
    },
    "price_per_unit": {
      "type": "number"
    },
    "min_order_quantity": {
      "type": "number"
    },
    "stock_available": {
      "type": "number"
    },
    "lead_time_days": {
      "type": "number"
    },
    "is_available": {
      "type": "boolean",
      "default": true
    },
    "specifications": {
      "type": "string"
    }
  },
  "required": [
    "supplier_id",
    "product_name",
    "category",
    "price_per_unit"
  ]
}