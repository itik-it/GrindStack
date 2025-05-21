const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose'); //once lang dapat gamitin

//PORT CONNECTION
const port=1337;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//MONGODB CONNECTION - PRODUCT MODEL
const Products = require("./models/product.model");
mongoose.connect("mongodb://127.0.0.1:27017/Shopify")
.then(() => console.log('Connected to MongoDB under Shopify database - Product Model'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/products', async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/products', async (req, res) => {
    const { barcode, name, price, stock } = req.body;
    try {
        const newProduct = new Products({ barcode, name, price, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { barcode, name, price, stock } = req.body;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(id, { barcode, name, price, stock }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Products.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Additional routes to match frontend requests
app.post('/addproductsmongo', async (req, res) => {
    const { barcode, name, price, stock } = req.body;
    try {
        const newProduct = new Products({ barcode, name, price, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/editproductsmongo/:id', async (req, res) => {
    const { id } = req.params;
    const { barcode, name, price, stock } = req.body;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(id, { barcode, name, price, stock }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/deleteproductsmongo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Products.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add this to your index.js file

// Import the Sales model
const Sales = require("./models/sale.model");

// Create a new sale transaction
app.post('/sales', async (req, res) => {
    try {
        const { items, totalAmount, amountReceived, change, cashierId, transactionId } = req.body;
        
        // Use the provided transactionId or generate a new one
        const saleTransactionId = transactionId || `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Process the items to handle missing productId
        const processedItems = items.map(item => {
            // If productId is missing, we'll make it optional
            if (!item.productId) {
                const { productId, ...rest } = item;
                return rest;
            }
            return item;
        });
        
        const newSale = new Sales({
            transactionId: saleTransactionId,
            items: processedItems,
            totalAmount,
            amountReceived,
            change,
            cashierId: cashierId || 'anonymous',
            date: new Date()
        });
        
        // Save the sale transaction
        const savedSale = await newSale.save();
        
        // Update inventory for each product sold (only if we have productId)
        for (const item of items) {
            if (item.productId) {
                const product = await Products.findById(item.productId);
                if (product) {
                    product.stock = Math.max(0, product.stock - item.quantity);
                    await product.save();
                }
            }
        }
        
        res.status(201).json(savedSale);
    } catch (error) {
        console.error('Error creating sale transaction:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Get all sales with optional date range filtering
app.get('/sales', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        
        // Apply date filtering if provided
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(`${endDate}T23:59:59.999Z`) // Include the entire end date
            };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.date = { $lte: new Date(`${endDate}T23:59:59.999Z`) };
        }
        
        // Fetch sales, newest first
        const sales = await Sales.find(query).sort({ date: -1 });
        
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get sales summary statistics - This route needs to be BEFORE the /sales/:id route
app.get('/sales/summary', async (req, res) => {
    console.log('GET /sales/summary route hit');
    try {
        const { startDate, endDate } = req.query;
        
        let matchStage = {};
        
        // Apply date filtering if provided
        if (startDate && endDate) {
            matchStage.date = {
                $gte: new Date(startDate),
                $lte: new Date(`${endDate}T23:59:59.999Z`)
            };
        } else if (startDate) {
            matchStage.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            matchStage.date = { $lte: new Date(`${endDate}T23:59:59.999Z`) };
        }
        
        // Aggregation for summary data
        const summary = await Sales.aggregate([
            { $match: matchStage },
            { 
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    transactionCount: { $sum: 1 },
                    itemsSold: { 
                        $sum: { 
                            $reduce: {
                                input: "$items",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.quantity"] }
                            }
                        }
                    }
                }
            }
        ]);
        
        // If no sales found, return zeros
        if (summary.length === 0) {
            return res.json({
                totalSales: 0,
                transactionCount: 0,
                itemsSold: 0
            });
        }
        
        res.json(summary[0]);
    } catch (error) {
        console.error('Error fetching sales summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific sale by ID - This route should come AFTER the /sales/summary route
app.get('/sales/:id', async (req, res) => {
    try {
        const sale = await Sales.findById(req.params.id);
        
        if (!sale) {
            return res.status(404).json({ error: 'Sale transaction not found' });
        }
        
        res.json(sale);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//MONGODB CONNECTION
const User = require("./models/user.model");
mongoose.connect("mongodb://127.0.0.1:27017/SIS")
.then(() => console.log('Connected to MongoDB under SIS database - User Model'))
.catch(err => console.error('MongoDB connection error:', err));

app.post("/addusermongo", async (req, res) => {
    try{
        const{UID, firstName, lastName, middleName, email, password} = req.body;

        const newUser = new User({
            UID,
            firstName,
            lastName,
            middleName,
            email,
            password
        });

        await newUser.save();
        return res.status(201).json({message: "User added successfully!"});
    }    catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({message: "Error adding user"});
    }});

    app.get("/fetchusermongo", async (req, res) => {
        try {
            const user = await User.find();
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ message: "Error fetching users"});
        }
    });
    
    
    app.put("/updateusermongo/:UID", async (req, res) => {
        try {
            const { UID } = req.params;  
            const { firstName, lastName, middleName, email, password } = req.body;
    
            const updatedUser = await User.findOneAndUpdate(
                { UID: UID }, 
                { firstName, lastName, middleName, email, password },
                { new: true } 
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json({ 
                message: "User updated successfully!", 
                updatedUser 
            });
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: "Error updating user" });
        }
    });
    
    
    app.delete("/deleteusermongo/:UID", async (req, res) => {
        try {
            const { UID } = req.params;
            const deletedUser = await User.findOneAndDelete({ UID: UID });
    
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json({ message: "User deleted successfully!" });
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Error deleting user"});
        }
    });

// Add this route after your other user routes

app.post("/loginmongo", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Return user information (excluding password)
        const userResponse = {
            UID: user.UID,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email
        };
        
        return res.status(200).json({ 
            message: "Login successful", 
            user: userResponse 
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
});
