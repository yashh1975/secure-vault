const auditLog = (action) => {
  return (req, res, next) => {
    const userId = req.user ? req.user.id : 'Anonymous';
    const fileId = req.params?.id || req.body?.fileId || 'N/A';
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] [${userId}] [${action}] [${fileId}]`);
    next();
  };
};

module.exports = auditLog;
