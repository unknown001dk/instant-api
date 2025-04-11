import memory from '../data/memory.js';
import { getCollections, getSampleSchema } from './utils.js';

// Dummy function to simulate dynamic API creation
async function createDynamicApi(collectionName, schema, mongoUri) {
  return `https://yourdomain.com/api/${collectionName}`;
}

export const handleMessage = async (req, res) => {
  const { userId, message } = req.body;

  // Initialize memory if not present
  if (!memory[userId]) {
    memory[userId] = { step: "ASK_MONGO_URI" };
  }

  const session = memory[userId];

  try {
    if (session.step === "ASK_MONGO_URI") {
      session.mongoUri = message;
      session.collections = await getCollections(message);
      session.currentIndex = 0;
      session.step = "SHOW_SCHEMA";
      return res.json({
        reply: `✅ Connected! Found collections: ${session.collections.join(", ")}.\n\nType "next" to continue.`,
      });
    }

    if (session.step === "SHOW_SCHEMA" && message === "next") {
      const collection = session.collections[session.currentIndex];
      session.currentCollection = collection;
      session.currentSchema = await getSampleSchema(session.mongoUri, collection);
      session.step = "CONFIRM_SCHEMA";

      return res.json({
        reply: `Detected schema for '${collection}':\n${JSON.stringify(session.currentSchema, null, 2)}\n\nType "yes" to accept, or "edit" to modify.`,
      });
    }

    if (session.step === "CONFIRM_SCHEMA") {
      if (message === "yes") {
        const url = await createDynamicApi(session.currentCollection, session.currentSchema, session.mongoUri);
        session.generatedApis = session.generatedApis || [];
        session.generatedApis.push(url);

        session.currentIndex++;
        if (session.currentIndex >= session.collections.length) {
          session.step = "DONE";
          return res.json({
            reply: `🎉 All APIs created!\n\nYour endpoints:\n${session.generatedApis.join("\n")}`,
          });
        } else {
          session.step = "SHOW_SCHEMA";
          return res.json({ reply: `✅ API created. Type "next" for the next collection.` });
        }
      } else if (message === "edit") {
        session.step = "WAIT_EDIT";
        return res.json({ reply: `Send the modified schema in JSON format:` });
      } else {
        return res.json({ reply: `Type "yes" to confirm, or "edit" to modify.` });
      }
    }

    if (session.step === "WAIT_EDIT") {
      try {
        const newSchema = JSON.parse(message);
        session.currentSchema = newSchema;
        session.step = "CONFIRM_SCHEMA";
        return res.json({
          reply: `New schema set:\n${JSON.stringify(newSchema, null, 2)}\n\nType "yes" to accept.`,
        });
      } catch (e) {
        return res.json({ reply: `⚠️ Invalid JSON. Please try again.` });
      }
    }

    if (session.step === "DONE") {
      return res.json({ reply: `✅ All done! Want to start again? Type "restart".` });
    }

    if (message === "restart") {
      delete memory[userId];
      return res.json({ reply: `🔄 Restarted. Send your MongoDB URI to begin.` });
    }

    return res.json({ reply: `🤖 I didn’t understand. Please follow the flow.` });

  } catch (err) {
    console.error(err);
    return res.json({ reply: `❌ Error: ${err.message}` });
  }
};
