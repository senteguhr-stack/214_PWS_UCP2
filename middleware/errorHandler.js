function notFound(req, res) {
  res.status(404).json({ success: false, message: `Endpoint tidak ditemukan: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server.',
  });
}

module.exports = { notFound, errorHandler };
