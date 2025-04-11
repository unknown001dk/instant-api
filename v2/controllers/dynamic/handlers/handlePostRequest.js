import { decryptPassword, encryptPassword } from "../utils/secure.js";

export const handlePostRequest = async ({ req, res, DynamicModel, schemaData }) => {
  try {
    const body = req.body;
    console.log(body)
    const schemaPaths = DynamicModel.schema.paths;

    for (const filed of schemaData.schemaDefinition) {
      const { name, secure, secretKey } = filed;
      console.log(name, secure, secretKey)
      // const encryptedKey = decryptPassword(secretKey);
      // console.log(encryptedKey)
      console.log(secure)
      if(body[name]) {
        if(secure) {
          body[name] = encryptPassword(body[name], secretKey)
        }
      }
    }

    const validationErrors = [];

    // Check for required fields
    for (const field in schemaPaths) {
      const path = schemaPaths[field];
      // console.log(path)
      if (path.isRequired && !body[field]) {
        validationErrors.push(`${field} is required`);
      }
    }

    // Setup inferred regex patterns (fallbacks)
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

    // Apply custom or inferred regex
    for (const field in schemaPaths) {
      const path = schemaPaths[field];
      // console.log(path)
      const value = body[field];
      if (!value) continue;

      // Check if user provided custom regex via "match" and "message"
      const customRegexValidator = path.validators?.find((v) => v.type === "regexp");
      // console.log(customRegexValidator)

      if (customRegexValidator) {
        if (!customRegexValidator.regexp.test(value)) {
          validationErrors.push(`${field}: ${customRegexValidator.message || "Invalid format"}`);
        }
      } else {
        // Use inferred validation if custom not available
        for (const { keyword, pattern, message } of inferredRegexPatterns) {
          if (field.toLowerCase().includes(keyword)) {
            if (!pattern.test(value)) {
              validationErrors.push(`${field}: ${message}`);
            }
          }
        }
      }
    }

    // Return if validation failed
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    

    // Create document
    const result = await DynamicModel.create(req.body);
    return res.status(201).json({ success: true, result });

  } catch (error) {
    // Handle unique constraint
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} must be unique. Duplicate value found.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create document.",
    });
  }
};
