const mongoose = require('mongoose');

const connectionLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ConnectionLog = mongoose.model('ConnectionLog', connectionLogSchema);

module.exports = ConnectionLog;
