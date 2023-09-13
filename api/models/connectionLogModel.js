const mongoose = require('mongoose');

const connectionLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  connectionCount: Number,
});

const ConnectionLog = mongoose.model('ConnectionLog', connectionLogSchema);

module.exports = ConnectionLog;
