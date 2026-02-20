const buckets = new Map();

function cleanupExpired(now) {
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

function rateLimit({ windowMs = 60_000, max = 30, keyPrefix = "global" } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > 5000) cleanupExpired(now);

    const ip = req.ip || req.connection?.remoteAddress || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(retryAfter, 1)));
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    current.count += 1;
    return next();
  };
}

module.exports = { rateLimit };
