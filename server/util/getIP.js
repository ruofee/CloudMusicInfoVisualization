module.exports = req => req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';