
const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const serviceAuthMiddleware = require("../middleware/serviceAuthMiddleware");

console.log("reduceStock:", typeof productController.reduceStock);
console.log("restoreStock:", typeof productController.restoreStock);
console.log("serviceAuthMiddleware:", typeof serviceAuthMiddleware);

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected product routes
router.post("/", authMiddleware, productController.addProduct);

// Internal inventory routes (Order Service only)
router.put("/reduce-stock", serviceAuthMiddleware, productController.reduceStock);
router.put("/restore-stock", serviceAuthMiddleware, productController.restoreStock);

// Dynamic product routes
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
