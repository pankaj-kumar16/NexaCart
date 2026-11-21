
const crypto = require("crypto");

const serviceAuthMiddleware = (req, res, next) => {
    const serviceKey = req.headers["x-internal-service-key"];
    const expectedKey = process.env.INTERNAL_SERVICE_KEY;

    if (!serviceKey || !expectedKey) {
        return res.status(401).json({
            message: "Service authentication failed"
        });
    }

    const provided = Buffer.from(serviceKey);
    const expected = Buffer.from(expectedKey);

    if (
        provided.length !== expected.length ||
        !crypto.timingSafeEqual(provided, expected)
    ) {
        return res.status(403).json({
            message: "Unauthorized service"
        });
    }

    next();
};

module.exports = serviceAuthMiddleware;
