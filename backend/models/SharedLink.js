const mongoose = require('mongoose');

const sharedLinkSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiry_time: {
    type: Date,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SharedLink', sharedLinkSchema);
