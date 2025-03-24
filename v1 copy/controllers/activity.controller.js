import User from "../models/user.model.js";

// Function to log an activity for a user
export const logActivity = async (userId, activityDescription) => {
  try {
    const user = await User.findById(userId); // Find user by their ID

    if (!user) {
      console.error("User not found");
      return;
    }

    // Add new activity to the activities array
    user.activities.push({
      activityDescription,
      timestamp: new Date().toISOString(), // Automatically sets the current time
    });

    await user.save(); // Save the updated user document
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

// get activities for a user

const getActivity = async (userId, activityDescription) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return;
    }

    const activity = user.activities.find(
      (activity) => activity.activityDescription === activityDescription
    );

    if (!activity) {
      console.error("Activity not found");
      return;
    }

    console.log("Activity:", activity);
  } catch (error) {
    console.error("Error getting activity:", error);
  }
};
