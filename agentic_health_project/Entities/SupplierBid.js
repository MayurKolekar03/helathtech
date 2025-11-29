{
  "name": "SupplierBid",
  "type": "object",
  "properties": {
    "supplier_id": {
      "type": "string"
    },
    "supplier_name": {
      "type": "string"
    },
    "hospital_id": {
      "type": "string"
    },
    "hospital_name": {
      "type": "string"
    },
    "product_id": {
      "type": "string"
    },
    "product_name": {
      "type": "string"
    },
    "quantity": {
      "type": "number"
    },
    "unit_price": {
      "type": "number"
    },
    "total_price": {
      "type": "number"
    },
    "delivery_days": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ],
      "default": "pending"
    },
    "notes": {
      "type": "string"
    },
    "valid_until": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "supplier_id",
    "product_name",
    "quantity",
    "unit_price"
  ]
}