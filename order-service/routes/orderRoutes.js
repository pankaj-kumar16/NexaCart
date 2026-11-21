
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    createRazorpayOrder,
    verifyRazorpayPayment,
    handlePaymentFailure

} = require("../controllers/orderController");

// All order routes require authentication
router.use(authMiddleware);

// Place new order
router.post("/", placeOrder);

// Create Razorpay payment order
router.post("/:orderId/payment/create", createRazorpayOrder);

router.post(
    "/:orderId/payment/verify",
    verifyRazorpayPayment
); 

router.post(
    "/:orderId/payment/failure",
    handlePaymentFailure
);

// Get logged-in user's orders
router.get("/my-orders", getMyOrders);

// Get single order
router.get("/:orderId", getOrderById);

// Cancel order
router.put("/:orderId/cancel", cancelOrder);

// Update order status (Admin only)
router.put("/:orderId/status", updateOrderStatus);

module.exports = router;
