// import UserSession from "../models/UserSession.js";
// import MongoUri from "../models/MongoUri.js";
// import Schema from "../models/Schema.js";

import MongoUri from "../models/mongo.model.js";
import Schema from "../models/schema.model.js";
import UserSession from "../models/UserSession.js";
import { MongoClient } from "mongodb";

const botController = {
  handleMessage: async (req, res) => {
    const { userId, message } = req.body;

    let session = await UserSession.findOne({ userId });
    if (!session) {
      session = await UserSession.create({
        userId,
        state: "ASK_PROJECT_NAME",
        data: {},
      });
      return res.json({ reply: "👋 Hello! What is your project name?" });
    }

    switch (session.state) {
      case "ASK_PROJECT_NAME":
        session.data.projectName = message;
        session.state = "ASK_MONGO_URI";
        break;

      case "ASK_MONGO_URI":
        try {
          const client = new MongoClient(message);
          await client.connect();

          await MongoUri.create({
            userId,
            projectName: session.data.projectName,
            atlasURI: message,
            localURI:
              process.env.LOCAL_MONGO_URI || "mongodb://localhost:27017",
          });

          session.data.mongodbUri = message;
          session.state = "SUGGEST_SCHEMA";
          session.data.schema = [
            { field: "username", type: "String" },
            { field: "password", type: "String" },
            { field: "email", type: "String" },
          ];

          await session.save();
          return res.json({
            reply: `Connected to MongoDB!\n\nSuggested schema:\n${JSON.stringify(
              session.data.schema,
              null,
              2
            )}\n\nType "yes" to accept or "edit" to customize.`,
          });
        } catch (err) {
          return res.json({
            reply: "MongoDB connection failed. Please check your URI.",
          });
        }

      case "SUGGEST_SCHEMA":
        if (message.toLowerCase() === "yes") {
          session.state = "SAVE_SCHEMA";
        } else if (message.toLowerCase() === "edit") {
          session.state = "EDIT_SCHEMA";
          return res.json({
            reply:
              'Send your schema as JSON array (e.g. [{"field":"name","type":"String"}])',
          });
        }
        break;

      case "EDIT_SCHEMA":
        try {
          const parsed = JSON.parse(message);
          session.data.schema = parsed;
          session.state = "SAVE_SCHEMA";
        } catch {
          return res.json({ reply: "Invalid JSON format. Try again." });
        }
        break;

      case "SAVE_SCHEMA":
        await Schema.create({
          userId,
          name: "users",
          schemaDefinition: session.data.schema,
          projectName: session.data.projectName,
        });

        const finalUrl = `/api/${userId}/${session.data.projectName.toLowerCase()}/users`;

        await session.deleteOne();
        return res.json({
          reply: `All done! Your auto-generated API URL is:\n${finalUrl}`,
        });
    }

    await session.save();
    res.json({ reply: 'Noted. Type "next" to continue.' });
  },
};

export default botController;
