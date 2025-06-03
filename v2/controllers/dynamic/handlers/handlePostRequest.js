import { decryptPassword, encryptPassword } from "../utils/secure.js";
import inferredRegexPatterns from "../utils/regexPattern.js";

export const handlePostRequest = async ({
  req,
  res,
  DynamicModel,
  schemaData,
  io
}) => {
  // console.log(io)
  try {
    const body = req.body;
    const action = req.query.action || "register";

    const schemaPaths = DynamicModel.schema.paths;
    const secureFields = schemaData.schemaDefinition.filter(
      (field) => field.secure
    );
    const roleField = schemaData.schemaDefinition.find(
      (f) => f.name === "role"
    );

    if (action === "login") {
      // ================ Login Flow =================
      const identifierField = schemaData.schemaDefinition.find((f) => f.unique);
      if (!identifierField || !body[identifierField.name]) {
        return res
          .status(400)
          .json({ success: false, message: "Missing login identifier." });
      }

      const user = await DynamicModel.findOne({
        [identifierField.name]: body[identifierField.name],
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      // Check secure fields
      for (const { name, secretKey } of secureFields) {
        const storedEncrypted = user[name];
        const inputRaw = body[name];
        const decryptedStored = decryptPassword(storedEncrypted, secretKey);
        if (decryptedStored !== inputRaw) {
          return res
            .status(401)
            .json({ success: false, message: `${name} is incorrect.` });
        }
      }

      // Optional: Block access based on role
      if (roleField && body.requiredRole && user.role !== body.requiredRole) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient role.",
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    } else {
      // ================ Register Flow  =================
      // Validate the role field against the enum values
      if (roleField && Array.isArray(roleField.enum) && body.role) {
        console.log("Validating role...");
        if (!roleField.enum.includes(body.role)) {
          console.log("Invalid role value:", body.role);
          return res.status(400).json({
            success: false,
            message: `Invalid role. Accepted values are: ${roleField.enum.join(
              ", "
            )}`,
          });
        }
      }

      // Encrypt secure fields
      for (const { name, secretKey } of secureFields) {
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

      for (const field in schemaPaths) {
        const path = schemaPaths[field];
        const value = body[field];
        if (!value) continue;

        const customRegexValidator = path.validators?.find(
          (v) => v.type === "regexp"
        );
        if (customRegexValidator) {
          if (!customRegexValidator.regexp.test(value)) {
            validationErrors.push(
              `${field}: ${customRegexValidator.message || "Invalid format"}`
            );
          }
        } else {
          for (const { keyword, pattern, message } of inferredRegexPatterns) {
            if (field.toLowerCase().includes(keyword) && !pattern.test(value)) {
              validationErrors.push(`${field}: ${message}`);
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

      // Set default role if not provided
      if (roleField && !body.role) {
        body.role = "user";
      }

      const result = await DynamicModel.create(body);

      // ======== Realtime Emit ========
      // let {userId, projectName} = req.params;
      console.log(req.params)
      let userId = req.params.id;
      let projectName = req.params.projectName;
      console.log(userId)
      if (schemaData.realtimeEnabled && io && userId && projectName) {
        const room = `${userId}_${projectName}`;
        console.log(room)
        const datae = io.to(room).emit("document:created", {
          schema: schemaData.schemaName,
          data: result,
        });
        console.log(datae)
      } else {
        console.log("Realtime not enabled or missing parameters");
      }

      return res
        .status(201)
        .json({ success: true, message: "Registered successfully", result });
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
