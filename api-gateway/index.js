
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();

const app = express();

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gateway Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "NexaCart API Gateway is running successfully"
    });
});

// User Service
app.use(
    "/api/users",
    createProxyMiddleware({
        target: process.env.USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/api/users${path}`
    })
);

// Product Service
app.use(
    "/api/products",
    createProxyMiddleware({
        target: process.env.PRODUCT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/api/products${path}`
    })
);

// Cart Service
app.use(
    "/api/cart",
    createProxyMiddleware({
        target: process.env.CART_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/api/cart${path}`
    })
);

// Order Service
app.use(
    "/api/orders",
    createProxyMiddleware({
        target: process.env.ORDER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/api/orders${path}`
    })
);

// Notification Service
app.use(
    "/api/notifications",
    createProxyMiddleware({
        target: process.env.NOTIFICATION_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/api/notifications${path}`
    })
);

// Start Gateway
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`NexaCart API Gateway running on port ${PORT}`);
});
