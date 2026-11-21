
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const serviceAuthMiddleware = require("../middleware/serviceAuthMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected test route
router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You have accessed a protected route!",
        user: req.user
    });
});

//change pass

router.put(
    "/change-password",
    authMiddleware,
    userController.changePassword
);
// delete account router
router.delete(
    "/delete-account",
    authMiddleware,
    userController.deleteAccount
);


router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);



// Internal service API - Get customer email by user ID
router.get(
    "/internal/:userId",
    serviceAuthMiddleware,
    userController.getUserEmailById
);
module.exports = router;
