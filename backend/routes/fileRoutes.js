const express = require('express');
const { uploadFile, listFiles, downloadFile, deleteFile, getTrash, restoreFile, permanentDelete } = require('../controllers/fileController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(verifyToken);
router.use(auditLog('ACCESS_FILE_ROUTE'));

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadFile);

router.get('/trash', getTrash);
router.get('/', listFiles);
router.get('/:id/download', auditLog('DOWNLOAD_FILE'), downloadFile);
router.put('/:id/restore', auditLog('RESTORE_FILE'), restoreFile);
router.delete('/:id/permanent', auditLog('PERMANENT_DELETE_FILE'), permanentDelete);
router.delete('/:id', auditLog('DELETE_FILE'), deleteFile);

module.exports = router;
