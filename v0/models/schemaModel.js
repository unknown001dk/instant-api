const mongoose = require('mongoose');

const SchemaDefinition = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schemaName: { type: String, required: true },
  fields: { type: Array, required: true }, // Store fields as an array of objects
});

module.exports = mongoose.model('Schema', SchemaDefinition);