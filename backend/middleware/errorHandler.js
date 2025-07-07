function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({ error: err.message });
}

function notFoundHandler(req, res, next) {
    res.status(404).json({ error: "Route not found" });
}

module.exports = { errorHandler, notFoundHandler };