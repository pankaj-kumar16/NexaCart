const crypto = require("crypto");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");
const axios = require("axios");


const sendOrderEmail = async (email, subject, message) => {
    try {
        await axios.post(
            `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/email`,
            {
                to: email,
                subject,
                message
            },
            {
                headers: {
                    "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY
                }
            }
        );

        console.log("Order notification email sent successfully");

    } catch (error) {
        console.error(
            "Notification Error:",
            error.response?.data || error.message
        );
    }
};


// Helper: Communicate with Product Service
const updateProductStock = async (endpoint, productId, quantity) => {
    const response = await fetch(
        `${process.env.PRODUCT_SERVICE_URL}/api/products/${endpoint}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY
            },
            body: JSON.stringify({
                productId,
                quantity
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || "Stock update failed"
        );
        error.statusCode = response.status;
        throw error;
    }

    return data;
};


const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find order belonging to logged-in user
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Only online payments
        if (order.paymentMethod !== "ONLINE") {
            return res.status(400).json({
                message: "This order is not an online payment order"
            });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({
                message: "Payment already completed"
            });
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        });

        // Save Razorpay order ID
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            message: "Razorpay order created successfully",
            keyId: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error.message);

        return res.status(500).json({
            message: "Failed to create Razorpay order",
            error: error.message
        });
    }
};


const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment details are required"
            });
        }





        // Find user's order
        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }


// Fetch customer profile
const userResponse = await fetch(
    `${process.env.USER_SERVICE_URL}/api/users/profile`,
    {
        headers: {
            Authorization: req.headers.authorization
        }
    }
);

if (!userResponse.ok) {
    throw new Error("Unable to fetch customer profile");
}

const userData = await userResponse.json();
const customerEmail = userData.user.email;



        if (order.paymentMethod !== "ONLINE") {
            return res.status(400).json({
                message: "Order is not an online payment order"
            });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({
                message: "Payment already verified"
            });
        }

        // Generate expected signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        // Compare signatures safely
        const signatureBuffer = Buffer.from(generatedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature);

        if (
            signatureBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        // Verify payment directly with Razorpay
        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== razorpay_order_id ||
            payment.amount !== Math.round(order.totalAmount * 100) ||
            payment.currency !== "INR" ||
            payment.status !== "captured"
        ) {
            return res.status(400).json({
                message: "Payment is not successfully captured"
            });
        }

        // Update order
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentStatus = "PAID";

        await order.save();

 // Send Payment Success Email
await sendOrderEmail(
    customerEmail,
    "NexaCart - Payment Successful",
    `Hello!

Your payment has been successfully received.

Order ID: ${order._id}
Payment ID: ${razorpay_payment_id}
Amount Paid: ₹${order.totalAmount}
Payment Status: PAID

Thank you for shopping with NexaCart!`
);


        return res.status(200).json({
            message: "Payment verified successfully",
            paymentStatus: order.paymentStatus,
            orderId: order._id
        });

    } catch (error) {
        console.error("Payment Verification Error:", error.message);

        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message
        });
    }
};



const placeOrder = async (req, res) => {
    let reducedItems = [];

    try {
        const userId = req.user.userId;
       
        
        
        // Fetch customer details from User Service
         const userResponse = await fetch(
        `${process.env.USER_SERVICE_URL}/api/users/profile`,
        {
            headers: {
                Authorization: req.headers.authorization
            }
        }
    );

    if (!userResponse.ok) {
        throw new Error("Unable to fetch customer profile");
    }

    const userData = await userResponse.json();
    const customerEmail = userData.user.email;
    console.log("JWT User ID:", userId);
    console.log("Profile User ID:", userData.user.id);
    console.log("Profile Email:", customerEmail);

    const { shippingAddress, paymentMethod = "COD" } = req.body;


        // Validate shipping address
        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                message: "Please provide complete shipping address"
            });
        }

        // Validate payment method
        if (!["COD", "ONLINE"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        // Fetch cart
        const cartResponse = await fetch(
            `${process.env.CART_SERVICE_URL}/api/cart`,
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        if (!cartResponse.ok) {
            throw new Error("Unable to fetch cart");
        }

        const cartData = await cartResponse.json();
        const cart = cartData.cart;

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        // Reduce stock for every cart item
        for (const item of cart.items) {
            await updateProductStock(
                "reduce-stock",
                item.productId,
                item.quantity
            );

            reducedItems.push(item);
        }

        // Calculate total
        const totalAmount = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Create order
        const order = await Order.create({
            userId,
            items: cart.items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Clear cart
        const clearResponse = await fetch(
            `${process.env.CART_SERVICE_URL}/api/cart/clear`,
            {
                method: "DELETE",
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        if (!clearResponse.ok) {
            console.error("Order created, but cart could not be cleared");
        }
        // Send Order Confirmation Email
await sendOrderEmail(
     customerEmail,
    "NexaCart - Order Confirmation",
    `Hello! Your order has been placed successfully.

Order ID: ${order._id}
Total Amount: ₹${order.totalAmount}

Thank you for shopping with NexaCart!`
);

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        // Restore stock if order creation fails
        for (const item of [...reducedItems].reverse()) {
            try {
                await updateProductStock(
                    "restore-stock",
                    item.productId,
                    item.quantity
                );
            } catch (restoreError) {
                console.error(
                    "Stock restoration failed:",
                    restoreError.message
                );
            }
        }

        console.error("Place Order Error:", error.message);

        return res.status(error.statusCode || 500).json({
            message: "Failed to place order",
            error: error.message
        });
    }
};



// 2. Get All Orders of Logged-in User
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders fetched successfully",
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// Get All Orders (Admin Only)
const getAllOrders = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        // Fetch all orders from database
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All orders fetched successfully",
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch all orders",
            error: error.message
        });
    }
};


// 3. Get Single Order By ID
const getOrderById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// 4. Cancel Order


const cancelOrder = async (req, res) => {
    const restoredItems = [];
    let previousStatus = "PLACED";

    try {
        const { orderId } = req.params;
        const userId = req.user.userId;

        // Find user's order
        const existingOrder = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check whether cancellation is allowed
        if (!["PLACED", "CONFIRMED"].includes(existingOrder.orderStatus)) {
            return res.status(400).json({
                message: `Order cannot be cancelled in ${existingOrder.orderStatus} status`
            });
        }

        // Store original order status
        previousStatus = existingOrder.orderStatus;

        // Atomically mark order as cancelled
        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                userId,
                orderStatus: previousStatus
            },
            {
                $set: { orderStatus: "CANCELLED" }
            },
            { new: true }
        );

        if (!order) {
            return res.status(400).json({
                message: "Order status changed. Please try again."
            });
        }

        // Restore stock for each item
        for (const item of order.items) {
            await updateProductStock(
                "restore-stock",
                item.productId,
                item.quantity
            );

            restoredItems.push(item);
        }

        return res.status(200).json({
            message: "Order cancelled and product stock restored successfully",
            order
        });

    } catch (error) {

        // Rollback stock already restored
        for (const item of [...restoredItems].reverse()) {
            try {
                await updateProductStock(
                    "reduce-stock",
                    item.productId,
                    item.quantity
                );
            } catch (rollbackError) {
                console.error(
                    "Stock rollback failed:",
                    rollbackError.message
                );
            }
        }

        // Restore original order status
        try {
            const { orderId } = req.params;

            await Order.updateOne(
                {
                    _id: orderId,
                    userId: req.user.userId,
                    orderStatus: "CANCELLED"
                },
                {
                    $set: {
                        orderStatus: previousStatus
                    }
                }
            );

        } catch (statusError) {
            console.error(
                "Order status rollback failed:",
                statusError.message
            );
        }

        console.error("Cancel Order Error:", error.message);

        return res.status(error.statusCode || 500).json({
            message: "Failed to cancel order",
            error: error.message
        });
    }
};


 // 5. Update Order Status (Admin Only)


const updateOrderStatus = async (req, res) => {
    const restoredItems = [];

    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        // 1. Check admin permission
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can update order status"
            });
        }

        // 2. Find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

// Fetch actual customer's email using order userId
let customerEmail = null;

if (orderStatus === "SHIPPED" || orderStatus === "DELIVERED") {
    const userResponse = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/internal/${order.userId}`,
        {
            headers: {
                "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY
            }
        }
    );

    customerEmail = userResponse.data.user.email;
}

        // 3. Allowed transitions
        const allowedTransitions = {
            PLACED: ["CONFIRMED", "CANCELLED"],
            CONFIRMED: ["SHIPPED", "CANCELLED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };

        if (!allowedTransitions[order.orderStatus]?.includes(orderStatus)) {
            return res.status(400).json({
                message: `Cannot change order status from ${order.orderStatus} to ${orderStatus}`
            });
        }

        

        const previousStatus = order.orderStatus;

        // 4. Restore stock if admin cancels order
        if (orderStatus === "CANCELLED") {
            for (const item of order.items) {
                await updateProductStock(
                    "restore-stock",
                    item.productId,
                    item.quantity
                );

                restoredItems.push(item);
            }
        }

        // 5. Update order status
        order.orderStatus = orderStatus;
        await order.save();

// Send Shipping / Delivery Email
if (orderStatus === "SHIPPED") {
    await sendOrderEmail(
        customerEmail,
        "NexaCart - Your Order Has Been Shipped",
        `Hello!

Great news! Your order has been shipped.

Order ID: ${order._id}
Order Status: SHIPPED
Total Amount: ₹${order.totalAmount}

Your order is on its way!

Thank you for shopping with NexaCart!`
    );
}

if (orderStatus === "DELIVERED") {
    await sendOrderEmail(
        customerEmail,
        "NexaCart - Your Order Has Been Delivered",
        `Hello!

Your order has been successfully delivered.

Order ID: ${order._id}
Order Status: DELIVERED
Total Amount: ₹${order.totalAmount}

We hope you enjoy your purchase!

Thank you for shopping with NexaCart!`
    );
}

        return res.status(200).json({
            message: orderStatus === "CANCELLED"
                ? "Order cancelled and stock restored successfully"
                : "Order status updated successfully",
            order
        });

    } catch (error) {

        // Rollback restored stock if update fails
        for (const item of [...restoredItems].reverse()) {
            try {
                await updateProductStock(
                    "reduce-stock",
                    item.productId,
                    item.quantity
                );
            } catch (rollbackError) {
                console.error(
                    "Stock rollback failed:",
                    rollbackError.message
                );
            }
        }

        console.error("Update Order Status Error:", error.message);

        return res.status(error.statusCode || 500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
};


const handlePaymentFailure = async (req, res) => {
    const restoredItems = [];

    try {
        const { orderId } = req.params;
        const { razorpay_payment_id } = req.body || {};

        // Validate payment ID
        if (!razorpay_payment_id) {
            return res.status(400).json({
                message: "Razorpay payment ID is required"
            });
        }

        // Find user's order
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check payment method
        if (order.paymentMethod !== "ONLINE") {
            return res.status(400).json({
                message: "This order does not use online payment"
            });
        }

        // Check payment status
        if (order.paymentStatus !== "PENDING") {
            return res.status(400).json({
                message: "Order payment is not pending"
            });
        }

        // Check Razorpay order ID
        if (!order.razorpayOrderId) {
            return res.status(400).json({
                message: "Razorpay order ID not found"
            });
        }

        // Fetch actual payment from Razorpay
        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        // Verify payment belongs to this order
        if (payment.order_id !== order.razorpayOrderId) {
            return res.status(400).json({
                message: "Payment does not belong to this order"
            });
        }

        // Verify payment amount
        if (
            payment.amount !== Math.round(order.totalAmount * 100) ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                message: "Payment amount or currency mismatch"
            });
        }

        // Only process genuinely failed payments
        if (payment.status !== "failed") {
            return res.status(400).json({
                message: "Payment is not failed"
            });
        }

        // Fetch customer profile
const userResponse = await fetch(
    `${process.env.USER_SERVICE_URL}/api/users/profile`,
    {
        headers: {
            Authorization: req.headers.authorization
        }
    }
);

if (!userResponse.ok) {
    throw new Error("Unable to fetch customer profile");
}

const userData = await userResponse.json();
const customerEmail = userData.user.email;

        // Restore product stock
        for (const item of order.items) {
            await updateProductStock(
                "restore-stock",
                item.productId,
                item.quantity
            );

            restoredItems.push(item);
        }

        // Update payment and order status
        order.paymentStatus = "FAILED";
        order.orderStatus = "CANCELLED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        // Send Payment Failure Email
await sendOrderEmail(
    customerEmail,
    "NexaCart - Payment Failed",
    `Hello!

Unfortunately, your payment could not be processed.

Order ID: ${order._id}
Payment ID: ${razorpay_payment_id}
Amount: ₹${order.totalAmount}
Payment Status: FAILED
Order Status: CANCELLED

The reserved product stock has been restored.

Please try placing your order again.

Thank you for shopping with NexaCart!`
);

        return res.status(200).json({
            message: "Payment failure processed successfully",
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            orderId: order._id
        });

    } catch (error) {

        console.error("Payment Failure Error:", error);

        // Rollback restored stock
        for (const item of [...restoredItems].reverse()) {
            try {
                await updateProductStock(
                    "reduce-stock",
                    item.productId,
                    item.quantity
                );
            } catch (rollbackError) {
                console.error(
                    "Stock rollback failed:",
                    rollbackError.message
                );
            }
        }

        return res.status(error.statusCode || 500).json({
            message: "Failed to process payment failure",
            error: error.error?.description || error.message
        });
    }
};




module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    createRazorpayOrder,
    verifyRazorpayPayment,
    handlePaymentFailure
};
