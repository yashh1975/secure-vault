const File = require('../models/File');
const { uploadToS3, getS3FileStream, deleteFromS3 } = require('../utils/s3');
const { encryptBuffer, decryptStream } = require('../utils/encryption');
const crypto = require('crypto');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, size, mimetype, buffer } = req.file;

    // Encrypt file
    const { iv, encryptedData } = encryptBuffer(buffer);
    
    // Upload to S3
    const s3Key = `${req.user.id}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    await uploadToS3(s3Key, encryptedData, mimetype);

    // Save to DB
    const fileDoc = await File.create({
      user_id: req.user.id,
      file_name: originalname,
      file_size: size,
      file_type: mimetype,
      s3_key: s3Key,
      iv: iv,
    });

    res.status(201).json({ success: true, message: 'File uploaded successfully', data: fileDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const listFiles = async (req, res) => {
  try {
    const { folder_id } = req.query;
    const query = { user_id: req.user.id, is_deleted: false };
    
    if (folder_id) {
      query.folder_id = folder_id;
    } else if (folder_id === 'null') {
      query.folder_id = null;
    }

    const files = await File.find(query).sort({ upload_date: -1 });
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    // Admin can download any file, user only their own
    if (req.user.role !== 'admin' && file.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const s3Stream = await getS3FileStream(file.s3_key);
    const decipher = decryptStream(file.iv);

    res.setHeader('Content-Type', file.file_type);
    if (req.query.view === 'true') {
      res.setHeader('Content-Disposition', `inline; filename="${file.file_name}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    }
    
    s3Stream.pipe(decipher).pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    if (req.user.role !== 'admin' && file.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Soft delete
    file.is_deleted = true;
    file.deleted_at = new Date();
    await file.save();

    res.json({ success: true, message: 'File moved to trash' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrash = async (req, res) => {
  try {
    const files = await File.find({ user_id: req.user.id, is_deleted: true }).sort({ deleted_at: -1 });
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const restoreFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user_id: req.user.id, is_deleted: true });
    if (!file) return res.status(404).json({ success: false, message: 'File not found in trash' });

    file.is_deleted = false;
    file.deleted_at = null;
    await file.save();

    res.json({ success: true, message: 'File restored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const permanentDelete = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user_id: req.user.id, is_deleted: true });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    await deleteFromS3(file.s3_key);
    await file.deleteOne();

    res.json({ success: true, message: 'File permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminListFiles = async (req, res) => {
  try {
    const files = await File.find().populate('user_id', 'email').sort({ upload_date: -1 });
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  uploadFile, 
  listFiles, 
  downloadFile, 
  deleteFile, 
  getTrash, 
  restoreFile, 
  permanentDelete, 
  adminListFiles 
};
