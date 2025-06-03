import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { hashedPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { logActivity } from "./activity.controller.js";

class UserController {
  // Register a new user
  register = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password, username } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "Email already used",
        success: false,
      })
    }
    
    try {
      const hash = await hashedPassword(password);
      const newUser = new User({
        email,
        password: hash,
        username,
      });

      console.log(newUser)
      
      await newUser.save();
      // console.log("saved data", newUser)
      // logActivity(user._id, "User Register");
      return res.status(201).json({
        message: "User registered successfully",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to register user",
        success: false,
        error,
      });
    }
  });

  // Login a user
login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  try {
    const hash = user.password;
    const match = await verifyPassword(hash, password);
    if (!match) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send token in response body
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,  // Adjust this to match your user schema fields
      },
      token,  // Send the token here
    });
    
    console.log(token);
    logActivity(user._id, "User login");
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login user",
      success: false,
      error,
    });
  }
});


  getActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);

      if (!user) {
        console.error("User not found");
        return;
      }
      if (!user.activities) {
        user.activities = [];
      }

      return res.status(200).json({
        message: "User fetched successfully",
        activities: user.activities,
      });
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  });

  // Logout a user
  logout = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const expirationTime = new Date(decoded.exp * 1000); // Convert expiration time from seconds to milliseconds
      if (expirationTime < new Date()) {
        return res.status(401).json({ message: "Token has already expired" });
      }
      res.clearCookie("token");

      logActivity(decoded._id, "User logout");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res
        .status(500)
        .json({ message: "Logout failed", error: error.message });
    }
  });

  // Get all users
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (!users) {
      throw new Error("No users found!");
    }
    logActivity(users._id, "get users");
    return res.json({
      message: "All users fetched successfully",
      success: true,
      data: users,
    });
  });

  // get a user
  getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    // logActivity(user._id, "get user");
    return res.json({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  });

  // Update a user
  update = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    let hash;
    if (password) {
      hash = await hashedPassword(password);
    } else {
      hash = user.password;
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: username || user.username,
        password: password || user.password,
        email: email || user.email,
      },
      { new: true }
    );
    logActivity(user._id, "update user");
    return res.json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  });

  // Delete a user
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    try {
      await User.findByIdAndDelete(id);
      return res.json({
        message: `User deleted successfully`,
        success: true,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

  // upadte profile picture
  updateProfilePicture = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { profilePicture } = req.body;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePicture = profilePicture; // Update the profile picture
      await user.save();

      res
        .status(200)
        .json({ message: "Profile picture updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile picture", error });
    }
  });
}

// Export an instance of the UserController class
export default new UserController();
