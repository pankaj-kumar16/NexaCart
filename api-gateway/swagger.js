
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NexaCart API Documentation",
            version: "1.0.0",
            description: "API documentation for NexaCart Microservices E-commerce Platform"
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server"
            }
            
        ],
        components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        },
        serviceAuth: {
            type: "apiKey",
            in: "header",
            name: "x-internal-service-key"
        },
    }
},
        paths: {
            "/api/users/register": {
                post: {
                    summary: "Register a new user",
                    description: "Creates a new NexaCart user account.",
                    tags: ["Authentication"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email", "password"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            example: "Test User"
                                        },
                                        email: {
                                            type: "string",
                                            format: "email",
                                            example: "test@example.com"
                                        },
                                        password: {
                                            type: "string",
                                            minLength: 6,
                                            example: "Test@123"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: "User registered successfully"
                        },
                        400: {
                            description: "Missing required fields or password too short"
                        },
                        409: {
                            description: "Email already registered"
                        },
                        500: {
                            description: "Internal server error"
                        }
                    }
                }
            },


"/api/users/login": {
    post: {
        summary: "Login user",
        description: "Authenticates a user and returns a JWT token.",
        tags: ["Authentication"],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["email", "password"],
                        properties: {
                            email: {
                                type: "string",
                                format: "email",
                                example: "test@example.com"
                            },
                            password: {
                                type: "string",
                                example: "Test@123"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Login successful. JWT token returned."
            },
            400: {
                description: "Email or password missing"
            },
            401: {
                description: "Invalid email or password"
            },
            500: {
                description: "Internal server error"
            }
        }
    }
},



"/api/users/profile": {
    get: {
        summary: "Get logged-in user profile",
        description: "Fetches the profile of the authenticated user.",
        tags: ["User Profile"],
        security: [
            {
                bearerAuth: []
            }
        ],
        responses: {
            200: {
                description: "Profile fetched successfully"
            },
            401: {
                description: "Unauthorized - Invalid or missing token"
            },
            404: {
                description: "User not found"
            },
            500: {
                description: "Error fetching profile"
            }
        }
    },
    put: {
        summary: "Update user profile",
        description: "Updates the authenticated user's name or email.",
        tags: ["User Profile"],
        security: [
            {
                bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                example: "Updated User"
                            },
                            email: {
                                type: "string",
                                format: "email",
                                example: "updated@example.com"
                            }
                        },
                        minProperties: 1
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Profile updated successfully"
            },
            400: {
                description: "Name or email is missing or invalid"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "User not found"
            },
            409: {
                description: "Email already exists"
            },
            500: {
                description: "Error updating profile"
            }
        }
    }
},


"/api/users/change-password": {
    put: {
        summary: "Change user password",
        description: "Allows an authenticated user to change their password.",
        tags: ["User Profile"],
        security: [
            {
                bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["oldPassword", "newPassword"],
                        properties: {
                            oldPassword: {
                                type: "string",
                                example: "OldPass@123"
                            },
                            newPassword: {
                                type: "string",
                                minLength: 6,
                                example: "NewPass@123"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Password changed successfully"
            },
            400: {
                description: "Missing password or new password is not valid"
            },
            401: {
                description: "Old password is incorrect or unauthorized"
            },
            404: {
                description: "User not found"
            },
            500: {
                description: "Error changing password"
            }
        }
    }
},


"/api/users/delete-account": {
    delete: {
        summary: "Delete user account",
        description: "Deletes the authenticated user's account after password verification.",
        tags: ["User Profile"],
        security: [
            {
                bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["password"],
                        properties: {
                            password: {
                                type: "string",
                                example: "Test@123"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Account deleted successfully"
            },
            400: {
                description: "Password not provided"
            },
            401: {
                description: "Incorrect password or unauthorized"
            },
            404: {
                description: "User not found"
            },
            500: {
                description: "Error deleting account"
            }
        }
    }
},


"/api/products": {
    get: {
        summary: "Get all products",
        description: "Fetch products with search, filtering, sorting and pagination.",
        tags: ["Products"],
        parameters: [
            {
                name: "search",
                in: "query",
                required: false,
                schema: { type: "string" },
                description: "Search products by name"
            },
            {
                name: "category",
                in: "query",
                required: false,
                schema: { type: "string" },
                description: "Filter by category"
            },
            {
                name: "brand",
                in: "query",
                required: false,
                schema: { type: "string" },
                description: "Filter by brand"
            },
            {
                name: "minPrice",
                in: "query",
                required: false,
                schema: { type: "number", minimum: 0 }
            },
            {
                name: "maxPrice",
                in: "query",
                required: false,
                schema: { type: "number", minimum: 0 }
            },
            {
                name: "sort",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    enum: ["price", "name", "createdAt"],
                    default: "createdAt"
                }
            },
            {
                name: "order",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    enum: ["asc", "desc"],
                    default: "desc"
                }
            },
            {
                name: "page",
                in: "query",
                required: false,
                schema: { type: "integer", minimum: 1, default: 1 }
            },
            {
                name: "limit",
                in: "query",
                required: false,
                schema: { type: "integer", minimum: 1, maximum: 100, default: 10 }
            }
        ],
        responses: {
            200: {
                description: "Products fetched successfully"
            },
            500: {
                description: "Failed to fetch products"
            }
        }
    }
},


"/api/products/{id}": {
    get: {
        summary: "Get product by ID",
        description: "Fetch a single product using its MongoDB ID.",
        tags: ["Products"],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
            }
        ],
        responses: {
            200: { description: "Product fetched successfully" },
            404: { description: "Product not found" },
            500: { description: "Failed to fetch product" }
        }
    },
    put: {
        summary: "Update product",
        description: "Update an existing product using its ID.",
        tags: ["Products"],
        security: [
            {
                bearerAuth: []
            }
        ],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
                description: "MongoDB Product ID"
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: { type: "string", example: "iPhone 17 Pro" },
                            description: { type: "string", example: "256GB Storage" },
                            price: { type: "number", example: 129999 },
                            category: { type: "string", example: "Electronics" },
                            brand: { type: "string", example: "Apple" },
                            stock: { type: "integer", example: 20 },
                            image: { type: "string", example: "https://example.com/product.jpg" }
                        },
                        minProperties: 1
                    }
                }
            }
        },
        responses: {
            200: { description: "Product updated successfully" },
            401: { description: "Unauthorized" },
            404: { description: "Product not found" },
            500: { description: "Failed to update product" }
        }
    },
delete: {
    summary: "Delete product",
    description: "Delete an existing product using its ID.",
    tags: ["Products"],
    security: [
        {
            bearerAuth: []
        }
    ],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "MongoDB Product ID"
        }
    ],
    responses: {
        200: {
            description: "Product deleted successfully"
        },
        401: {
            description: "Unauthorized"
        },
        404: {
            description: "Product not found"
        },
        500: {
            description: "Failed to delete product"
        }
    }
}
},


"/api/products/reduce-stock": {
    put: {
        summary: "Reduce product stock",
        description: "Reduce product inventory. This internal endpoint is accessible only to authorized services.",
        tags: ["Product Inventory"],
        security: [
            {
                serviceAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["productId", "quantity"],
                        properties: {
                            productId: {
                                type: "string",
                                example: "6afa09f03616fda325378279"
                            },
                            quantity: {
                                type: "integer",
                                minimum: 1,
                                example: 2
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: "Product stock reduced successfully" },
            400: { description: "Invalid product or insufficient stock" },
            500: { description: "Failed to reduce stock" }
        }
    }
},


"/api/products/restore-stock": {
    put: {
        summary: "Restore product stock",
        description: "Restore product inventory after order cancellation or payment failure.",
        tags: ["Product Inventory"],
        security: [
            {
                serviceAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["productId", "quantity"],
                        properties: {
                            productId: {
                                type: "string",
                                example: "6afa09f03616fda325378279"
                            },
                            quantity: {
                                type: "integer",
                                minimum: 1,
                                example: 2
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: "Product stock restored successfully" },
            400: { description: "Invalid product ID or quantity" },
            404: { description: "Product not found" },
            500: { description: "Failed to restore stock" }
        }
    }
},


// CART SERVICE APIs

"/api/cart": {
    get: {
        summary: "Get logged-in user's cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: "Cart fetched successfully or cart is empty"
            },
            401: {
                description: "Unauthorized"
            },
            500: {
                description: "Failed to fetch cart"
            }
        }
    }
},

"/api/cart/add": {
    post: {
        summary: "Add product to cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["productId"],
                        properties: {
                            productId: {
                                type: "string"
                            },
                            quantity: {
                                type: "integer",
                                minimum: 1,
                                default: 1
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: "Product added successfully" },
            400: { description: "Invalid quantity or insufficient stock" },
            401: { description: "Unauthorized" },
            404: { description: "Product not found" },
            502: { description: "Product Service unavailable" },
            500: { description: "Internal server error" }
        }
    }
},

"/api/cart/update": {
    put: {
        summary: "Update cart product quantity",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["productId", "quantity"],
                        properties: {
                            productId: {
                                type: "string"
                            },
                            quantity: {
                                type: "integer",
                                minimum: 1
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: "Cart quantity updated successfully" },
            400: { description: "Invalid quantity or insufficient stock" },
            401: { description: "Unauthorized" },
            404: { description: "Cart or product not found" },
            500: { description: "Internal server error" }
        }
    }
},

"/api/cart/remove/{productId}": {
    delete: {
        summary: "Remove a product from cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "productId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "Product ID to remove"
            }
        ],
        responses: {
            200: { description: "Product removed successfully" },
            401: { description: "Unauthorized" },
            404: { description: "Cart or product not found" },
            500: { description: "Internal server error" }
        }
    }
},

"/api/cart/clear": {
    delete: {
        summary: "Clear entire cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
            200: { description: "Cart cleared successfully" },
            401: { description: "Unauthorized" },
            404: { description: "Cart not found" },
            500: { description: "Internal server error" }
        }
    }
},


"/api/orders": {
    post: {
        summary: "Place a new order",
        description: "Creates an order using the logged-in user's cart and updates product stock.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["shippingAddress"],
                        properties: {
                            shippingAddress: {
                                type: "object",
                                required: [
                                    "fullName",
                                    "phone",
                                    "address",
                                    "city",
                                    "state",
                                    "pincode"
                                ],
                                properties: {
                                    fullName: {
                                        type: "string",
                                        example: "Rahul Kumar"
                                    },
                                    phone: {
                                        type: "string",
                                        example: "9876543210"
                                    },
                                    address: {
                                        type: "string",
                                        example: "Sector 62"
                                    },
                                    city: {
                                        type: "string",
                                        example: "Noida"
                                    },
                                    state: {
                                        type: "string",
                                        example: "Uttar Pradesh"
                                    },
                                    pincode: {
                                        type: "string",
                                        example: "201301"
                                    }
                                }
                            },
                            paymentMethod: {
                                type: "string",
                                enum: ["COD", "ONLINE"],
                                default: "COD",
                                example: "COD"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Order placed successfully"
            },
            400: {
                description: "Invalid shipping address, payment method, or empty cart"
            },
            401: {
                description: "Unauthorized"
            },
            500: {
                description: "Failed to place order"
            }
        }
    }
},


"/api/orders/{orderId}/payment/create": {
    post: {
        summary: "Create Razorpay payment order",
        description: "Creates a Razorpay order for an existing ONLINE payment order.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        responses: {
            201: {
                description: "Razorpay order created successfully"
            },
            400: {
                description: "Order is not online or payment already completed"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Failed to create Razorpay order"
            }
        }
    }
},

"/api/orders/{orderId}/payment/verify": {
    post: {
        summary: "Verify Razorpay payment",
        description: "Verifies Razorpay payment signature and confirms captured payment.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "razorpay_order_id",
                            "razorpay_payment_id",
                            "razorpay_signature"
                        ],
                        properties: {
                            razorpay_order_id: {
                                type: "string",
                                example: "order_example123"
                            },
                            razorpay_payment_id: {
                                type: "string",
                                example: "pay_example123"
                            },
                            razorpay_signature: {
                                type: "string",
                                example: "generated_signature"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Payment verified successfully"
            },
            400: {
                description: "Invalid payment details, signature, or payment status"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Payment verification failed"
            }
        }
    }
},


"/api/orders/{orderId}/payment/verify": {
    post: {
        summary: "Verify Razorpay payment",
        description: "Verifies Razorpay payment signature and confirms captured payment.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "razorpay_order_id",
                            "razorpay_payment_id",
                            "razorpay_signature"
                        ],
                        properties: {
                            razorpay_order_id: {
                                type: "string",
                                example: "order_example123"
                            },
                            razorpay_payment_id: {
                                type: "string",
                                example: "pay_example123"
                            },
                            razorpay_signature: {
                                type: "string",
                                example: "generated_signature"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Payment verified successfully"
            },
            400: {
                description: "Invalid payment details, signature, or payment status"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Payment verification failed"
            }
        }
    }
},


"/api/orders/{orderId}/payment/failure": {
    post: {
        summary: "Handle Razorpay payment failure",
        description: "Verifies failed payment with Razorpay, restores product stock and cancels the order.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["razorpay_payment_id"],
                        properties: {
                            razorpay_payment_id: {
                                type: "string",
                                example: "pay_example123"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Payment failure processed; stock restored and order cancelled"
            },
            400: {
                description: "Invalid payment details or payment status"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Failed to process payment failure"
            }
        }
    }
},


"/api/orders/my-orders": {
    get: {
        summary: "Get all orders of logged-in user",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: "Orders fetched successfully"
            },
            401: {
                description: "Unauthorized"
            },
            500: {
                description: "Failed to fetch orders"
            }
        }
    }
},


"/api/orders/{orderId}": {
    get: {
        summary: "Get single order by ID",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        responses: {
            200: {
                description: "Order fetched successfully"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Failed to fetch order"
            }
        }
    }
},


"/api/orders/{orderId}/cancel": {
    put: {
        summary: "Cancel an order",
        description: "Cancels an eligible order and restores product stock. Cancellation is allowed only for PLACED or CONFIRMED orders.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        responses: {
            200: {
                description: "Order cancelled and product stock restored successfully"
            },
            400: {
                description: "Order cannot be cancelled or its status changed"
            },
            401: {
                description: "Unauthorized"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Failed to cancel order"
            }
        }
    }
},


"/api/orders/{orderId}/status": {
    put: {
        summary: "Update order status (Admin only)",
        description: "Allows admin to update order status according to permitted status transitions.",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                    type: "string"
                },
                description: "NexaCart order ID"
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["orderStatus"],
                        properties: {
                            orderStatus: {
                                type: "string",
                                enum: [
                                    "CONFIRMED",
                                    "SHIPPED",
                                    "DELIVERED",
                                    "CANCELLED"
                                ],
                                example: "CONFIRMED"
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Order status updated successfully"
            },
            400: {
                description: "Invalid order status transition"
            },
            401: {
                description: "Unauthorized"
            },
            403: {
                description: "Only admin can update order status"
            },
            404: {
                description: "Order not found"
            },
            500: {
                description: "Failed to update order status"
            }
        }
    }
},

"/api/notifications": {
    get: {
        summary: "Check Notification Service health",
        tags: ["Notifications"],
        responses: {
            200: {
                description: "Notification Service is running"
            }
        }
    }
},

"/api/notifications/email": {
    post: {
        summary: "Send email notification",
        description: "Send an email using the Notification Service. Requires internal service authentication.",
        tags: ["Notifications"],
        security: [
            {
                serviceAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["to", "subject", "message"],
                        properties: {
                            to: {
                                type: "string",
                                format: "email",
                                example: "user@example.com"
                            },
                            subject: {
                                type: "string",
                                example: "Order Confirmation"
                            },
                            message: {
                                type: "string",
                                example: "Your order has been placed successfully."
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Email sent successfully"
            },
            400: {
                description: "Missing required fields"
            },
            500: {
                description: "Email sending failed"
            }
        }
    }
},


        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
