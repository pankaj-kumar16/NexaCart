
const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// All cart routes require authentication
router.use(authMiddleware);

// Add product to cart
router.post("/add", cartController.addToCart);

// Get user's cart
router.get("/", cartController.getCart);

// Update product quantity
router.put("/update", cartController.updateCartQuantity);

// Remove one product
router.delete("/remove/:productId", cartController.removeFromCart);

// Clear entire cart
router.delete("/clear", cartController.clearCart);

module.exports = router;
