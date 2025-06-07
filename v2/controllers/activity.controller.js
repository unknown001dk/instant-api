import User from "../models/user.model.js";

/**
 * Logs a new activity for the specified user.
 * @param {string} userId - The ID of the user.
 * @param {string} activityDescription - Description of the activity to log.
 */
export const logActivity = async (userId, activityDescription) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return;
    }

    user.activities.push({
      activityDescription,
      timestamp: new Date().toISOString(),
    });

    await user.save();
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

/**
 * Retrieves an activity matching the description for a specified user.
 * @param {string} userId - The ID of the user.
 * @param {string} activityDescription - The activity description to find.
 * @returns {object|null} - Returns the activity object or null if not found.
 */
export const getActivity = async (userId, activityDescription) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return null;
    }

    const activity = user.activities.find(
      (act) => act.activityDescription === activityDescription
    );

    if (!activity) {
      console.error(`Activity "${activityDescription}" not found for user ${userId}.`);
      return null;
    }

    return activity;
  } catch (error) {
    console.error("Error retrieving activity:", error);
    return null;
  }
};
