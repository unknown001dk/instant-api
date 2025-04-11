import mongoose from "mongoose";

export const validateSchemaDefinition = (schemaArray) => {

  const typeMap = {
    string: "String",
    number: "Number",
    boolean: "Boolean",
    date: "Date",
    array: "Array",
    object: "Object",
    mixed: "Mixed",
    objectid: "ObjectId", 
  };

  const schemaObject = {};

  for (const field of schemaArray) {
    if (!field.type || !field.name) {
      console.warn(`⚠️ Skipping invalid field: ${JSON.stringify(field)}`);
      continue;
    }

    const inputType = field.type.toLowerCase(); 
    const fieldType = typeMap[inputType] || "String"; 
    const schemaField = {
      required: field.required || false,
      unique: field.unique || false,
    };

    // console.log(fieldType)

    if (fieldType === "ObjectId") {
      schemaField.type = mongoose.Schema.Types.ObjectId;
      if (field.ref) {
        schemaField.ref = field.ref;
      }
    } else if (mongoose.Schema.Types[fieldType]) {
      schemaField.type = mongoose.Schema.Types[fieldType];
    } else {
      schemaField.type = String;
    }

    schemaObject[field.name] = schemaField;
  }

  return schemaObject;
};
