export const createDynamicSchema = async (schemaName, fields) => {
  const schemaDefinition = {};

  fields.forEach((field) => {
    if (field.type === "ObjectId" && field.ref) {
      schemaDefinition[field.name] = {
        type: mongoose.Schema.Types.ObjectId,
        ref: field.ref,
        required: field.required || false,
      };
    } else {
      schemaDefinition[field.name] = {
        type: mongoose.Schema.Types[field.type],
        required: field.required || false,
        unique: field.unique || false,
        default: field.default || null,
        validate: {
          validator: (value) => {
            if (field.type === "String" && value.length > field.maxLength) {
              throw new Error(`Value for ${field.name} is too long.`);
            }
            if (field.type === "Number" && value < field.min || value > field.max) {
              throw new Error(`Value for ${field.name} is out of range.`);
            }
            return true;
          },
          message: (props) => `${props.value} is not a valid ${props.path}.`,
        },
      };
    }
  });

  const dynamicSchema = new mongoose.Schema(schemaDefinition);
  return mongoose.model(schemaName, dynamicSchema);
};

createDynamicSchema("users", )
