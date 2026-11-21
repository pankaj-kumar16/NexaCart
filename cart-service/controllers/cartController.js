
const Cart = require("../models/Cart");

// 1. Add Product to Cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity = 1 } = req.body;
        const productIdString = String(productId);

        // Validate input
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Valid productId and quantity are required"
            });
        }

        // Fetch product details from Product Service
        const response = await fetch(
            `${process.env.PRODUCT_SERVICE_URL}/api/products/${productIdString}`
        );

        if (response.status === 404) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (!response.ok) {
            return res.status(502).json({
                message: "Product Service is unavailable"
            });
        }

        const data = await response.json();
        const product = data.product;

        // Check available stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock available"
            });
        }

        // Find user's existing cart
        let cart = await Cart.findOne({ userId });

        // Create cart if it doesn't exist
        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(
            item => item.productId === productIdString
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                return res.status(400).json({
                    message: "Requested quantity exceeds available stock"
                });
            }

            existingItem.quantity += quantity;

        } else {
            cart.items.push({
                productId: String(product._id),
                name: product.name,
                price: product.price,
                quantity,
                image: product.image || ""
            });
        }

        // Save cart in MongoDB
        await cart.save();

        res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add product to cart",
            error: error.message
        });
    }
};


// 2. Get User Cart
const getCart = async (req, res) => {
    try {
        // Get logged-in user's ID
        const userId = req.user.userId;

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        // Check if cart exists
        if (!cart) {
            return res.status(200).json({
                message: "Your cart is empty",
                cart: {
                    userId,
                    items: []
                },
                totalAmount: 0
            });
        }

        // Calculate total cart amount
        const totalAmount = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Send cart response
        res.status(200).json({
            message: "Cart fetched successfully",
            cart,
            totalAmount
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};


 // 3. Update Cart Item Quantity
const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        // Validate quantity
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Valid productId and quantity are required"
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Find product inside cart
        const item = cart.items.find(
            item => item.productId === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // Check latest product stock
        const response = await fetch(
            `${process.env.PRODUCT_SERVICE_URL}/api/products/${productId}`
        );

        if (!response.ok) {
            return res.status(404).json({
                message: "Product not found in Product Service"
            });
        }

        const data = await response.json();
        const product = data.product;

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            });
        }

        // Update quantity
        item.quantity = quantity;

        // Save updated cart
        await cart.save();

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update cart quantity",
            error: error.message
        });
    }
};

 // 4. Remove Product from Cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Check if product exists in cart
        const itemExists = cart.items.some(
            item => item.productId === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // Remove product from cart
        cart.items = cart.items.filter(
            item => item.productId !== productId
        );

        // Save updated cart
        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};


// 5. Clear Entire Cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Remove all products
        cart.items = [];

        // Save updated cart
        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
};



module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};