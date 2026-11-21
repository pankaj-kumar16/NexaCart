
const Product = require("../models/Product");

// 1. Add Product
const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
};

// 2. Get All Products
/*const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};*/

//Hum ek hi API mein search, filter, sorting aur pagination implement karenge.


// 2. Get All Products with Search, Filter, Sorting and Pagination
const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort = "createdAt",
            order = "desc",
            page = 1,
            limit = 10
        } = req.query;

        // Pagination values
        const currentPage = Math.max(1, parseInt(page) || 1);
        const productsLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (currentPage - 1) * productsLimit;

        // Build filter object
        const filter = {};

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        // Filter by brand
        if (brand) {
            filter.brand = {
                $regex: `^${brand}$`,
                $options: "i"
            };
        }

        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Allow only supported sorting fields
        const allowedSortFields = ["price", "name", "createdAt"];
        const sortField = allowedSortFields.includes(sort)
            ? sort
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        // Fetch products and total count
        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(productsLimit),

            Product.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            totalProducts,
            currentPage,
            totalPages: Math.ceil(totalProducts / productsLimit),
            productsPerPage: productsLimit,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// 3. Get Product By ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// 4. Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

// 5. Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};


// 6. Reduce Product Stock
const reduceStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Valid productId and quantity are required"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: productId,
                stock: { $gte: quantity }
            },
            {
                $inc: { stock: -quantity }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(400).json({
                message: "Product not found or insufficient stock"
            });
        }

        return res.status(200).json({
            message: "Product stock reduced successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to reduce stock",
            error: error.message
        });
    }
};


// 7. Restore Product Stock
const restoreStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Valid productId and quantity are required"
            });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                $inc: { stock: quantity }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product stock restored successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to restore stock",
            error: error.message
        });
    }
};


// Export functions
module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    reduceStock,
    restoreStock
};
