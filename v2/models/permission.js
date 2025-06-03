// import mongoose from "mongoose";

// const permissionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     projectId: {
//       type: String,
//       required: true,
//     },
//     collectionName: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String, // Example: 'student', 'teacher', 'admin'
//       required: true,
//     },
//     permissions: {
//       view: { type: Boolean, default: false },
//       add: { type: Boolean, default: false },
//       edit: { type: Boolean, default: false },
//       delete: { type: Boolean, default: false },
//       fields: {
//         view: [{ type: String }],
//         add: [{ type: String }],
//         edit: [{ type: String }],
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Permission = mongoose.model("Permission", permissionSchema);

import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: String, required: true }, // Unique project identifier
  collectionName: { type: String, required: true }, // Entity name (e.g., "students", "tasks")
  role: { type: String, required: true }, // No hardcoded enum
  permissions: {
    view: { type: Boolean, default: true },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    fields: {
      view: { type: [String], default: [] }, // Fields allowed for viewing
      add: { type: [String], default: [] }, // Fields allowed for adding
      edit: { type: [String], default: [] }, // Fields allowed for editing
      delete: { type: [String], default: [] }, // Fields allowed for deleting
    },
  },
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;