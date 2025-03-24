import mongoose from "mongoose";
export const validateSchemaDefinition = (schemaArray) => {
  const validTypes = [
    "String",
    "Number",
    "Boolean",
    "Date",
    "Array",
    "Object",
    "Mixed",
  ];
  const schemaObject = {};

  schemaArray.forEach((field) => {
    if (!field.type || !field.name) {
      console.error(`Invalid field definition: ${JSON.stringify(field)}`);
      return; // Skip invalid fields
    }

    let fieldType = field.type.charAt(0).toUpperCase() + field.type.slice(1); // Capitalize first letter

    if (!validTypes.includes(fieldType)) {
      console.error(
        `Invalid type '${field.type}' for field '${field.name}'. Using 'String' instead.`
      );
      fieldType = "String";
    }

    schemaObject[field.name] = {
      type: mongoose.Schema.Types[fieldType],
      required: field.required || false,
      unique: field.unique || false,
    };
  });

  return schemaObject;
};