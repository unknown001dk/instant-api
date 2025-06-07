import Logs from "../models/log.js";
import mongoose from "mongoose";

export const handleAllRequest = async (req, res) => {
  try {
    const logs = await Logs.find().sort({ createdAt: -1 });
    if (!logs.length) {
      return res.status(404).json({
        message: "No logs found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Logs fetched successfully",
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching all logs:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const handleGetRequestByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter, sort, select, limit: limitParam, page: pageParam, search } = req.query;

    const limit = Math.max(parseInt(limitParam, 10) || 10, 1);
    const page = Math.max(parseInt(pageParam, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const query = { userId };

    if (filter) {
      try {
        const filterConditions = JSON.parse(filter);
        Object.assign(query, filterConditions);
      } catch {
        return res.status(400).json({
          message: "Invalid filter format. Must be valid JSON.",
          success: false,
        });
      }
    }

    if (search) {
      query.endpoint = { $regex: search, $options: "i" };
    }

    const [logs, totalItems] = await Promise.all([
      Logs.find(query)
        .sort(sort || { createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select(select || "-__v"),
      Logs.countDocuments(query),
    ]);

    if (!logs.length) {
      return res.status(404).json({
        message: "No logs found for the given criteria",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Logs fetched successfully",
      success: true,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching logs by userId:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUserLogStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const objectUserId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const matchStage = { $match: { userId: objectUserId } };

    const [methodStats, endpointStats, statusStats] = await Promise.all([
      Logs.aggregate([
        matchStage,
        { $group: { _id: "$method", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Logs.aggregate([
        matchStage,
        { $group: { _id: "$endpoint", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Logs.aggregate([
        matchStage,
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return res.status(200).json({
      message: "User log statistics fetched successfully",
      success: true,
      data: {
        methods: methodStats,
        endpoints: endpointStats,
        statusCodes: statusStats,
      },
    });
  } catch (error) {
    console.error("Error in getUserLogStats:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
