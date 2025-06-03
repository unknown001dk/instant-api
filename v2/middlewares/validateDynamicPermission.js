import Permission from "../models/permission.js";
import { decryption } from "../utils/encrypt.js";

export const validateDynamicPermissions = async (req, res, next) => {
  // const { userId } = req.params.userId;

  const userId = decryption(req.params.id); 
  const { projectId, collectionName } = req.params; 

  try {
    // Fetch permissions for the given project and collection
    let permission = await Permission.findOne({ userId, projectId, collectionName });

    // If no permissions exist, default to admin-level access
    if (!permission) {
      permission = {
        userId,
        projectId,
        collectionName,
        role: "admin",
        permissions: {
          view: true,
          add: true,
          edit: true,
          delete: true,
          fields: {
            view: ["*"], // "*" indicates access to all fields
            add: ["*"],
            edit: ["*"],
            delete: ["*"],
          },
        },
      };
    }

    console.log("User Permissions:", permission); 

    req.permission = permission;
    next(); 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during permission validation.",
    });
  }
};