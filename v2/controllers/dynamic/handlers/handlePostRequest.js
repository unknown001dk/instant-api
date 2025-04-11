import { decryptPassword, encryptPassword } from "../utils/secure.js";

export const handlePostRequest = async ({ req, res, DynamicModel, schemaData }) => {
  try {
    const body = req.body;
    const action = req.query.action || "register"; // use query param ?action=login

    const schemaPaths = DynamicModel.schema.paths;

    // Extract secure fields from schema
    const secureFields = schemaData.schemaDefinition.filter(field => field.secure);

    if (action === "login") {
      console.log(schemaData.schemaDefinition)
      // Find user by a unique identifier (e.g. email or username)
      const identifierField = schemaData.schemaDefinition.find(f => f.unique);
      console.log(identifierField)
      if (!identifierField || !body[identifierField.name]) {
        return res.status(400).json({ success: false, message: "Missing login identifier." });
      }

      const user = await DynamicModel.findOne({ [identifierField.name]: body[identifierField.name] });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      // Decrypt and compare secure fields (e.g., password)
      for (const { name, secure, secretKey } of secureFields) {
        const storedEncrypted = user[name];
        const inputRaw = body[name];

        const decryptedStored = decryptPassword(storedEncrypted, secretKey);

        if (decryptedStored !== inputRaw) {
          return res.status(401).json({ success: false, message: `${name} is incorrect.` });
        }
      }

      return res.status(200).json({ success: true, message: "Login successful", user });

    } else {
      // Register logic

      for (const { name, secure, secretKey } of secureFields) {
        if (body[name]) {
          body[name] = encryptPassword(body[name], secretKey);
        }
      }

      const validationErrors = [];

      // Required fields
      for (const field in schemaPaths) {
        const path = schemaPaths[field];
        if (path.isRequired && !body[field]) {
          validationErrors.push(`${field} is required`);
        }
      }

      // Inferred regex validation
      const inferredRegexPatterns = [
        {
          keyword: "email",
          pattern: /^[\w.-]+@[\w.-]+\.\w{2,4}$/,
          message: "Invalid email address",
        },
        {
          keyword: "phone",
          pattern: /^[6-9]\d{9}$/,
          message: "Invalid phone number",
        },
        {
          keyword: "url",
          pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
          message: "Invalid URL",
        },
        {
          keyword: "name",
          pattern: /^[a-zA-Z ]{2,30}$/,
          message: "Invalid name format",
        },
        {
          keyword: "username",
          pattern: /^[a-zA-Z0-9_]{3,20}$/,
          message: "Invalid username format",
        },
      ];

      for (const field in schemaPaths) {
        const path = schemaPaths[field];
        const value = body[field];
        if (!value) continue;

        const customRegexValidator = path.validators?.find((v) => v.type === "regexp");
        if (customRegexValidator) {
          if (!customRegexValidator.regexp.test(value)) {
            validationErrors.push(`${field}: ${customRegexValidator.message || "Invalid format"}`);
          }
        } else {
          for (const { keyword, pattern, message } of inferredRegexPatterns) {
            if (field.toLowerCase().includes(keyword)) {
              if (!pattern.test(value)) {
                validationErrors.push(`${field}: ${message}`);
              }
            }
          }
        }
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: validationErrors,
        });
      }

      const result = await DynamicModel.create(body);
      return res.status(201).json({ success: true, message: "Registered successfully", result });
    }

  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} must be unique. Duplicate value found.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
