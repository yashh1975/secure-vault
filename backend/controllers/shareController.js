const SharedLink = require('../models/SharedLink');
const File = require('../models/File');
const crypto = require('crypto');
const { getS3FileStream } = require('../utils/s3');
const { decryptStream } = require('../utils/encryption');

const createShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    if (file.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry_time = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    const sharedLink = await SharedLink.create({
      file_id: file._id,
      token,
      expiry_time,
      created_by: req.user.id
    });

    res.json({ success: true, data: { link: `${process.env.CLIENT_URL}/share/${token}`, token, expiry_time } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const accessSharedFile = async (req, res) => {
  try {
    const { token } = req.params;
    const sharedLink = await SharedLink.findOne({ token }).populate('file_id');

    if (!sharedLink) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    if (new Date() > sharedLink.expiry_time) {
      return res.status(410).json({ success: false, message: 'Link has expired' });
    }

    const file = sharedLink.file_id;
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

module.exports = { createShareLink, accessSharedFile };
