const express = require('express');
const { createShareLink, accessSharedFile } = require('../controllers/shareController');
const { verifyToken } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.get('/share/:token', auditLog('ACCESS_SHARED_FILE'), accessSharedFile);
router.post('/files/:id/share', verifyToken, auditLog('CREATE_SHARE_LINK'), createShareLink);

module.exports = router;
