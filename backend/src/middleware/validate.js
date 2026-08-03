const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues) {
      return res.status(400).json({
        error: 'Validation Error',
        details: issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    return res.status(400).json({ error: 'Invalid Request Input' });
  }
};

module.exports = validate;
