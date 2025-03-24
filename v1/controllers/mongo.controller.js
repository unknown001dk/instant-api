import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import MongoUri from '../models/mongo.model.js';
import getDatabaseConnection from '../utils/connection.js';

class ModalController {
  // Create new URIs for a user and project
  createURIs = asyncHandler(async (req, res) => {
    const { projectName, atlasURI, localURI } = req.body;
    const userId = req.user.id; // Get userId from token

    // Check if all required data is provided
    if (!projectName || !atlasURI || !localURI) {
      return res.status(400).json({
        message: 'All fields (projectName, atlasURI, localURI) are required',
        success: false,
      });
    }

    try {
      // Check if the user exists
      const userExists = await User.findById(userId);
      // console.log(userExists)
      if (!userExists) {
        return res.status(404).json({
          message: 'User not found',
          success: false,
        });
      }

      // Check if the project already exists for the given user
      const projectExists = await MongoUri.findOne({ userId, projectName });
      if (projectExists) {
        return res.status(409).json({
          message: 'Project name already exists for this user',
          success: false,
        });
      }

      // Create a new project entry
      const project = new MongoUri({
        userId,
        projectName,
        atlasURI,
        localURI,
      });

      console.log(project)

      getDatabaseConnection(localURI);
      // getDatabaseConnection()

      // Save the project to the database
      await project.save();

      res.status(201).json({
        message: 'Project URIs created successfully',
        success: true,
        project,
      });
    } catch (error) {
      console.error('Error creating project URIs:', error);
      console.error(error.message);
      res.status(500).json({
        message: 'Error creating project URIs',
        error: error.message,
      });
    }
  });

  // Fetch saved URIs for a user and project
  getURIs = asyncHandler(async (req, res) => {
    const { projectName } = req.query;
    const userId = req.user.id; // Get userId from token

    // Check if projectName is provided
    if (!projectName) {
      return res.status(400).json({
        message: 'projectName is required',
        success: false,
      });
    }

    try {
      // Find the project URIs for the specified user and project
      const project = await MongoUri.findOne({ userId, projectName });

      if (!project) {
        return res.status(404).json({
          message: 'Project not found',
          success: false,
        });
      }

      res.status(200).json({
        message: 'Project URIs fetched successfully',
        success: true,
        project: {
          userId: project.userId,
          projectName: project.projectName,
          uris: {
            atlasURI: project.atlasURI,
            localURI: project.localURI,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching project URIs:', error);
      res.status(500).json({
        message: 'Error fetching project URIs',
        error: error.message,
      });
    }
  });
}

export default new ModalController();
