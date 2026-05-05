const express = require('express');
const { adminListFiles } = require('../controllers/fileController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);
router.use(auditLog('ADMIN_ACCESS'));

router.get('/files', adminListFiles);

module.exports = router;
