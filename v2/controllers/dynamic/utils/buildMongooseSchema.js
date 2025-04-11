import mongoose from "mongoose";

export const buildMongooseSchema = (schemaDefinition) => {
  const fields = {};

  schemaDefinition.forEach((field) => {
    let fieldType;
    const type = field.type.toLowerCase();

    switch (type) {
      case "string":
        fieldType = String;
        break;
      case "number":
        fieldType = Number;
        break;
      case "boolean":
        fieldType = Boolean;
        break;
      case "date":
        fieldType = Date;
        break;
      case "objectid":
        fieldType = mongoose.Schema.Types.ObjectId;
        break;
      default:
        console.warn(`Invalid type '${field.type}' for field '${field.name}'. Using 'String' instead.`);
        fieldType = String;
    }

    const fieldDef = { type: fieldType };

    if (field.required) {
      fieldDef.required = true;
    }

    if (type === "objectid" && field.ref) {
      fieldDef.ref = field.ref;
    }

    fields[field.name] = fieldDef;
  });

  return new mongoose.Schema(fields, { timestamps: true });
};
