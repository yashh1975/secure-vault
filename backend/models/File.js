const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  file_size: {
    type: Number,
    required: true,
  },
  file_type: {
    type: String,
    required: true,
  },
  s3_key: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
  folder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
}, { timestamps: { createdAt: 'upload_date', updatedAt: false } });

module.exports = mongoose.model('File', fileSchema);
