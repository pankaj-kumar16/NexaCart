
const serviceAuthMiddleware = (req, res, next) => {
    const serviceKey = req.headers["x-internal-service-key"];

    if (!serviceKey || serviceKey !== process.env.INTERNAL_SERVICE_KEY) {
        return res.status(401).json({
            message: "Unauthorized service access"
        });
    }

    next();
};

module.exports = serviceAuthMiddleware;
