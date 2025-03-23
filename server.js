// const express = require("express");
// // const mysql = require("mysql");
// const sql = require("mssql");
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // if (process.env.NODE_ENV != 'production') {
// require("dotenv").config();
// // }


// var config = {
//     server: "LAPTOP-866PGD3E\SQLEXPRESS",
//     database: "eximtrac",
//     driver: "ODBC Driver 17 for SQL Server",
//     options: {
//         trustedConnection: true,
//         integratedSecurity: true,
//         enableArithAbort: true, // Sometimes required for compatibility with SQL Server
//         connectionTimeout: 30000, // Increase timeout to 30 seconds
//         requestTimeout: 30000     // Increase request timeout if needed
//     },
// };

// console.log("Config:", config);

// const db = sql.connect(config, function (err) {
//     if (err) throw err;
//     console.log("Database Connected");
// });


// const db = mysql.createConnection({
// host : process.env.HOST,
// user : process.env.USER,
// passowrd : process.env.PASSWORD,
// database : process.env.DATABASE,
// });

// db.connect((err) => {
// if(err){
//     throw err;
// }
//     console.log("MSSQL Database Connected")
// });


// app.get("/getAllProducts", function (req, res) {

//     let query = "SELECT * FROM cornitos_master";
//     db.query(query, (err, result) => {

//         if (err) {
//             res.json({ msg: err });
//         }

//         else {
//             res.json({ msg: result });
//         }

//     });
// res.json({msg: "Welcome"}) just for testing
// });


// app.get("/GetAllProducts", async function (req, res) {

//     let request = db.request();

//     const result = await request.query("SELECT * FROM cornitos_master");
//     res.json({ msg: "Data Fetched Successfully", data: result.recordsets });
// });



// app.post("/signup", function(req,res){

//     let query = "insert into signup SET ?";

// let postData = {
//     "username" : req.body.username,
//     "password" : req.body.password,
//     "name" : req.body.name,
//     "emailid" : req.body.emailid,
//     "phoneno" : req.body.phoneno,
//     "companyname" : req.body.companyname,
//     "companyaddress" : req.body.companyaddress,
//     "country" : req.body.country,
//     "state" : req.body.state,
//     "city" : req.body.city,
//     "zipcode" : req.body.zipcode,
//     "dischargeport" : req.body.dischargeport,
//     "alternatephoneno" : req.body.alternatephoneno,
//     "taxid" : req.body.taxid
// }

//     db.query(query,postData,(err,result)=>{

// if(err){
//     res.json({mdg:err});
// }

// else{
//     res.json({msg:result});
// }

//     });
// res.json({msg: "Welcome"}) just for testing
// });



// app.get("/", function (req, res) {

//     res.send("<p> welcome to node js </p>");

// });


// PORT = process.env.PORT || 3000

// app.listen(PORT, function () {

//     console.log(`Server is listening at port ${PORT}`);

// });







const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based mysql2
const app = express();
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const csvParser = require('csv-parser');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require('./auth');
const nodemailer = require("nodemailer");

app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET; // Change in production

// Configuration for MSSQL
// const config = {
//     server: process.env.SERVER,
//     database: process.env.DATABASE,
//     user: "ayush",
//     password: "ayush@12345",
//     options: {
//         encrypt: true, // Use encryption
//         trustServerCertificate: true, // Add this line for development
//     },
//     driver: "msnodesqlv8",
//     // driver: "ODBC Driver 17 for SQL Server",

//     // connectionTimeout: 30000,
//     // requestTimeout: 30000,
// };

// // Connect to the database and store the pool connection
// let pool;
// sql.connect(config)
//     .then((p) => {
//         console.log("Database Connected");
//         pool = p;
//     })
//     .catch((err) => {
//         console.error("Database Connection Failed:", err);
//     });


// Create a MySQL connection pool
const pool = mysql.createPool({
    host: "deepaspheresolutions.co.in",
    user: "ayush",
    password: "ayush@123!@#",
    database: "eximtrac",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000, // ⏳ 20 seconds timeout
});


// Test the database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to MySQL database");
        connection.release();
    } catch (error) {
        console.error("Error connecting to MySQL:", error.message);
    }
}

testConnection();


// sql.connect(config)
//     .then(() => console.log('Connected to SQL Server'))
//     .catch(err => console.error('Database connection failed:', err));

// Define routes
app.get("/GetAllProducts", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/GetCategoryandSubCategory", async (req, res) => {
    try {
        const [rows] = await pool.query("select distinct CATEGORY, SUB_CATEGORY from cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


// app.get("/GetCategory", async (req, res) => {
//     try {
//         if (!pool) { // Check if connection is available
//             throw new Error("Database connection is not initialized");
//         }
//         const result = await pool.request().query("select distinct CATEGORY as name from cornitos_master");
//         res.json({ msg: "Data Fetched Successfully", data: result.recordset });
//     } catch (err) {
//         console.error("Query Failed:", err);
//         res.status(500).json({ msg: "Error Fetching Data", error: err.message });
//     }
// });

// app.get("/GetBrand", async (req, res) => {
//     try {
//         if (!pool) { // Check if connection is available
//             throw new Error("Database connection is not initialized");
//         }
//         const result = await pool.request().query("select distinct BRAND from cornitos_master");
//         res.json({ msg: "Data Fetched Successfully", data: result.recordset });
//     } catch (err) {
//         console.error("Query Failed:", err);
//         res.status(500).json({ msg: "Error Fetching Data", error: err.message });
//     }
// });

// app.get("/GetSubCategory", async (req, res) => {
//     try {
//         if (!pool) { // Check if connection is available
//             throw new Error("Database connection is not initialized");
//         }
//         const result = await pool.request().query("select distinct SUB_CATEGORY from cornitos_master");
//         res.json({ msg: "Data Fetched Successfully", data: result.recordset });
//     } catch (err) {
//         console.error("Query Failed:", err);
//         res.status(500).json({ msg: "Error Fetching Data", error: err.message });
//     }
// });


app.get("/GetCategory", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT CATEGORY AS name FROM cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

// Fetch subcategories
app.get("/GetSubCategory", async (req, res) => {
    try {
        const { category } = req.query;
        let query = "SELECT DISTINCT SUB_CATEGORY FROM cornitos_master";
        let params = [];
        if (category) {
            query += " WHERE CATEGORY = ?";
            params.push(category);
        }
        const [rows] = await pool.query(query, params);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

// Fetch brands
app.get("/GetBrand", async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        let query = "SELECT DISTINCT BRAND FROM cornitos_master";
        let params = [];
        if (category || subCategory) {
            query += " WHERE";
            if (category) {
                query += " CATEGORY = ?";
                params.push(category);
            }
            if (subCategory) {
                query += (category ? " AND" : "") + " SUB_CATEGORY = ?";
                params.push(subCategory);
            }
        }
        const [rows] = await pool.query(query, params);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

// Fetch category, subcategory, and brand
app.get("/GetFilter", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT CATEGORY, SUB_CATEGORY, BRAND FROM cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

// Fetch user's added-to-container data
app.get("/Get-add-to-container/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT
                tc.TC_ID,
                tc.Quantity,
                tc.ProductID,
                tc.CartonQty,
                cm.PRODUCT_DESCRIPTION,
                cm.CATEGORY,
                cm.BRAND,
                cm.SUB_CATEGORY,
                cm.UNIT,
                cm.UNIT_PER_CTN,
                cm.WEIGHT_PER_PKT_GRAMS,
                tc.UserID,
                u.FirstName
            FROM
                to_container tc
            INNER JOIN
                cornitos_master cm ON tc.ProductID = cm.ID
            INNER JOIN
                users u ON tc.UserID = u.UserID
            WHERE
                tc.UserID = ?
        `, [userId]);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-data-for-order-page/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT DISTINCT OrderID, UploadDate, UserID
            FROM container_place_enquiry
            WHERE UserID = ?
        `, [userId]);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-data-for-user-side-enquiry-page/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT DISTINCT
                cpe.OrderID,
                cpe.UploadDate,
                cpe.UserID,
                u.FirstName,
                u.LastName,
                u.EmailID,
                u.CompanyName
            FROM
                container_place_enquiry cpe
            JOIN
                users u ON cpe.UserID = u.UserID
            WHERE
                cpe.UserID = ?
            ORDER BY
                UploadDate DESC
        `, [userId]);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-data-for-enquiry-page", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                cpe.OrderID,
                cpe.UploadDate,
                cpe.UserID,
                u.FirstName,
                u.LastName,
                u.EmailID,
                u.CompanyName
            FROM
                container_place_enquiry cpe
            JOIN
                users u ON cpe.UserID = u.UserID
            ORDER BY
                cpe.UploadDate DESC
        `);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-data-for-admin-dash-enquiry-page", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                cpe.OrderID,
                cpe.UploadDate,
                cpe.UserID,
                u.FirstName,
                u.LastName,
                u.EmailID,
                u.CompanyName
            FROM
                container_place_enquiry cpe
            JOIN
                users u ON cpe.UserID = u.UserID
            ORDER BY
                cpe.UploadDate DESC
            LIMIT 3
        `);
        res.json({ msg: "Data Fetched Successfully", data: rows });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-container-place-enquiry-user-and-admin/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const query = `
            SELECT
                cpe.CPE_ID,
                cpe.CartonQty,
                cpe.ProductID,
                cpe.OrderID,
                cpe.UploadDate,
                cpe.TotalCases,
                cpe.TotalQty,
                cpe.RatePerUnitUSD,
                cpe.RatePerCaseUSD,
                cpe.TotalRateInUSDFobIndia,
                cpe.TotalNetWeight,
                cpe.TotalGrossWeight,
                cpe.TotalVolume,
                cpe.UserStatus,
                c_m.PRODUCT_DESCRIPTION,
                c_m.SKU_CODE,
                c_m.CATEGORY,
                c_m.BRAND,
                c_m.SUB_CATEGORY,
                c_m.UNIT,
                c_m.UNIT_PER_CTN,
                c_m.WEIGHT_PER_PKT_GRAMS,
                cpe.UserID,
                u.FirstName
            FROM
                container_place_enquiry cpe
            INNER JOIN
                cornitos_master c_m ON cpe.ProductID = c_m.ID
            INNER JOIN
                users u ON cpe.UserID = u.UserID
            WHERE
                cpe.UserID = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        res.status(200).json({ data: rows });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ msg: 'Error Fetching Data', error: err.message });
    }
});

app.get("/Get-container-place-enquiry-user-and-admin/:userId/:orderId?", async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ message: "UserID is required" });
        }

        let query = `
            SELECT
                cpe.CPE_ID,
                cpe.CartonQty,
                cpe.ProductID,
                cpe.OrderID,
                cpe.UploadDate,
                cpe.TotalCases,
                cpe.TotalQty,
                cpe.RatePerUnitUSD,
                cpe.RatePerCaseUSD,
                cpe.TotalRateInUSDFobIndia,
                cpe.TotalNetWeight,
                cpe.TotalGrossWeight,
                cpe.TotalVolume,
                cpe.UserStatus,
                c_m.PRODUCT_DESCRIPTION,
                c_m.SKU_CODE,
                c_m.CATEGORY,
                c_m.BRAND,
                c_m.SUB_CATEGORY,
                c_m.UNIT,
                c_m.UNIT_PER_CTN,
                c_m.WEIGHT_PER_PKT_GRAMS,
                cpe.UserID,
                u.FirstName
            FROM
                container_place_enquiry cpe
            INNER JOIN
                cornitos_master c_m ON cpe.ProductID = c_m.ID
            INNER JOIN
                users u ON cpe.UserID = u.UserID
            WHERE
                cpe.UserID = ?
        `;
        const queryParams = [userId];

        if (orderId) {
            query += " AND cpe.OrderID = ?";
            queryParams.push(orderId);
        }

        const [rows] = await pool.query(query, queryParams);
        res.status(200).json({ data: rows });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

const { v4: uuidv4 } = require('uuid');

// Add to Container
app.post('/add-to-container', authMiddleware, async (req, res) => {
    console.log(req.body); // Debugging: Log request body
    try {
        const { Quantity, ProductID, UserID, CartonQty } = req.body;

        // Validate inputs
        if (!Quantity || !ProductID || !UserID || !CartonQty) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get a connection from the pool
        const connection = await pool.getConnection();

        try {
            // Check if ProductID and UserID exist
            const [productResult] = await connection.execute(
                'SELECT COUNT(*) AS count FROM cornitos_master WHERE ID = ?',
                [ProductID]
            );
            const [userResult] = await connection.execute(
                'SELECT COUNT(*) AS count FROM users WHERE UserID = ?',
                [UserID]
            );

            if (productResult[0].count === 0) {
                return res.status(400).json({ message: 'Invalid ProductID' });
            }
            if (userResult[0].count === 0) {
                return res.status(400).json({ message: 'Invalid UserID' });
            }

            // Insert into the database
            await connection.execute(
                'INSERT INTO to_container (Quantity, ProductID, UserID, CartonQty) VALUES (?, ?, ?, ?)',
                [Quantity, ProductID, UserID, CartonQty]
            );

            res.status(201).json({ message: 'Added to container successfully!' });
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error('Error in /add-to-container:', error.message, error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = app;

// Container Place Enquiry
app.post('/container-place-enquiry', authMiddleware, async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'An array of data is required' });
    }

    for (const item of data) {
        const { ProductID, UserID, CartonQty } = item;
        if (!ProductID || !UserID || CartonQty === undefined) {
            return res.status(400).json({ message: 'All fields (ProductID, UserID, CartonQty) are required' });
        }
    }

    try {
        const orderId = uuidv4();
        const uploadDate = new Date();

        const query = `
            INSERT INTO container_place_enquiry (ProductID, UserID, CartonQty, OrderID, UploadDate)
            VALUES ?
        `;

        const values = data.map(item => [item.ProductID, item.UserID, item.CartonQty, orderId, uploadDate]);

        await pool.query(query, [values]);

        console.log("✅ Enquiry placed successfully:", orderId);
        res.status(201).json({ message: "Enquiry placed successfully!", orderId });
    } catch (error) {
        console.error("❌ Error in /container-place-enquiry:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Delete all container data for a user
app.delete('/delete-container-data', authMiddleware, async (req, res) => {
    try {
        const userId = req.query.userId; // ✅ Fix: Get userId from query params

        console.log("🛑 DELETE API hit, UserID:", userId);

        if (!userId) {
            return res.status(400).json({ message: "UserID is required" });
        }

        const query = `DELETE FROM to_container WHERE UserID = ?`;
        const [result] = await pool.query(query, [userId]);

        console.log("🗑️ Delete result:", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No data found for the given UserID" });
        }

        res.status(200).json({ message: "Container data deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting data:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});



// Delete a specific container item for a user
app.delete('/delete-container-item/:productId/:userId', authMiddleware, async (req, res) => {
    const { productId, userId } = req.params;

    if (!productId || !userId) {
        return res.status(400).json({ message: 'ProductID and UserID are required' });
    }

    try {
        const query = `DELETE FROM to_container WHERE ProductID = ? AND UserID = ?`;
        const [result] = await pool.query(query, [productId, userId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update a category
app.put("/update-categories", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        const query = `UPDATE cornitos_master SET CATEGORY = ? WHERE CATEGORY = ?`;
        const [result] = await pool.query(query, [newName, oldName]);

        if (result.affectedRows > 0) {
            return res.json({ message: "Category updated successfully" });
        } else {
            return res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: "Error updating category", error: err.message });
    }
});

// Update a subcategory
app.put("/update-subcategories", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Run the SQL UPDATE query
        const [result] = await pool.query(
            `UPDATE cornitos_master SET SUB_CATEGORY = ? WHERE SUB_CATEGORY = ?`,
            [newName, oldName]
        );

        // Check if any row was updated
        if (result.affectedRows > 0) {
            return res.json({ message: "Sub-Category updated successfully" });
        } else {
            return res.status(404).json({ message: "Sub-Category not found" });
        }
    } catch (err) {
        console.error('Error updating sub-category:', err);
        return res.status(500).json({ message: "Error updating sub-category", error: err.message });
    }
});

// Update a brand
app.put("/update-brand", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Run the SQL UPDATE query
        const [result] = await pool.query(
            `UPDATE cornitos_master SET BRAND = ? WHERE BRAND = ?`,
            [newName, oldName]
        );

        // Check if any row was updated
        if (result.affectedRows > 0) {
            return res.json({ message: "Brand updated successfully" });
        } else {
            return res.status(404).json({ message: "Brand not found" });
        }
    } catch (err) {
        console.error('Error updating brand:', err);
        return res.status(500).json({ message: "Error updating brand", error: err.message });
    }
});


// Update a brand
app.put("/update-product", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Run the SQL UPDATE query
        const [result] = await pool.query(
            `UPDATE cornitos_master SET PRODUCT_DESCRIPTION = ? WHERE PRODUCT_DESCRIPTION = ?`,
            [newName, oldName]
        );

        // Check if any row was updated
        if (result.affectedRows > 0) {
            return res.json({ message: "Product updated successfully" });
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        console.error('Error updating Product:', err);
        return res.status(500).json({ message: "Error updating Product", error: err.message });
    }
});


// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // Validate input
//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required' });
//         }

//         // Query to check the login credentials
//         const query = `
//             SELECT * 
//             FROM login 
//             WHERE username = @username AND password = @password
//         `;

//         const request = new sql.Request();
//         request.input('username', sql.VarChar, username);
//         request.input('password', sql.VarChar, password);

//         const result = await request.query(query);

//         if (result.recordset.length > 0) {
//             // Successful login
//             res.status(200).json({
//                 message: 'Login successful',
//                 user: result.recordset[0], // Send the user details (optional)
//             });
//         } else {
//             // Invalid credentials
//             res.status(401).json({ message: 'Invalid username or password' });
//         }
//     } catch (err) {
//         console.error('Error during login:', err);
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });


// Sign Up Route
// app.post("/signup", async (req, res) => {
//     const { EmailID, Password } = req.body;

//     if (!EmailID || !Password) {
//         return res.status(400).json({ message: "Email and Password are required" });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(Password, 10);

//         const query = `
//             INSERT INTO users (EmailID, PasswordHash) 
//             VALUES (@EmailID, @PasswordHash)
//         `;

//         const poolRequest = (await pool).request();
//         poolRequest.input("EmailID", sql.VarChar, EmailID);
//         poolRequest.input("PasswordHash", sql.VarChar, hashedPassword);

//         await poolRequest.query(query);

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// Login Route
// app.post("/login", async (req, res) => {
//     const { EmailID, Password } = req.body;

//     try {
//         const query = `
//             SELECT * FROM users WHERE EmailID = @EmailID
//         `;
//         const poolRequest = (await pool).request();
//         poolRequest.input("EmailID", sql.VarChar, EmailID);

//         const result = await poolRequest.query(query);
//         const user = result.recordset[0];

//         if (!user) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const isMatch = await bcrypt.compare(Password, user.PasswordHash);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         // Generate Token
//         const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         res.json({ message: "Login successful", token });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: "Server error" });
//     }
// });


app.post("/signup", async (req, res) => {
    const { EmailID, Password } = req.body;

    try {
        const query = `
            INSERT INTO users (EmailID, Password) VALUES (?, ?)
        `;
        await pool.query(query, [EmailID, Password]); // Use await here
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Login route
app.post("/loginuser", async (req, res) => {
    const { EmailID, Password } = req.body;

    try {
        const query = `
            SELECT EmailID, Password, UserID FROM users WHERE EmailID = ?
        `;
        const [results] = await pool.query(query, [EmailID]); // Use await here

        const user = results[0];
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare plain-text password directly
        if (Password !== user.Password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ UserID: user.UserID, EmailID: user.EmailID }, process.env.SECRET_KEY, {
            expiresIn: '24h' // Token expiration time
        });

        res.json({
            message: "Login successful", user:
                { UserID: user.UserID, EmailID: user.EmailID }, token: token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Protected route
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.EmailID}` });
});

// Profile update route
app.put("/profile", authMiddleware, async (req, res) => {
    const { userId } = req.body; // Get userId from token after middleware
    const { FirstName, LastName, PhoneNumber, CompanyName, CompanyAddress, City, State, Country, ZipCode, DischargePort, AlternatePhone, AlternateEmailID, FinalDestination } = req.body;

    try {
        const query = `
            UPDATE users 
            SET FirstName = ?, LastName = ?, PhoneNumber = ?, CompanyName = ?, 
                CompanyAddress = ?, City = ?, State = ?, Country = ?, ZipCode = ?, 
                DischargePort = ?, AlternatePhone = ?, AlternateEmailID = ?,FinalDestination = ? 
            WHERE UserID = ?
        `;

        await pool.query(query, [FirstName, LastName, PhoneNumber, CompanyName, CompanyAddress, City, State, Country, ZipCode, DischargePort, AlternatePhone, AlternateEmailID, FinalDestination, userId]); // Use await here

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// GET API to fetch user profile
app.get("/get-profile/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `SELECT * FROM users WHERE userId = ?`;
        const [results] = await pool.execute(query, [userId]); // ✅ Await the result

        if (results.length > 0) {
            res.status(200).json(results[0]); // ✅ Return a single object
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get customers route
app.get("/get-customers", async (req, res) => {
    try {
        const query = `SELECT UserID, EmailID, FirstName, LastName, CompanyName FROM users`;

        const [results] = await pool.execute(query);

        res.status(200).json(results); // Return all users
    } catch (error) {
        console.error("Error fetching customer list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Admin login route
app.post('/adminlogin', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        // Validate input
        if (!Username || !Password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const query = `
            SELECT * 
            FROM admin_login 
            WHERE Username = ? AND Password = ?
        `;

        const [results] = await pool.query(query, [Username, Password]); // Use await here

        if (results.length > 0) {
            // Successful login
            res.status(200).json({
                message: 'Login Successful',
                user: results[0], // Send the user details (optional)
            });
        } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API endpoint to save contact messages
app.post('/contact-us-messages', async (req, res) => {
    const { Name, Email, ContactNumber, Message } = req.body;

    if (!Name || !Email || !ContactNumber || !Message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const query = `
            INSERT INTO ContactUsMessages (Name, Email, ContactNumber, Message)
            VALUES (?, ?, ?, ?)
        `;

        await pool.query(query, [Name, Email, ContactNumber, Message]); // Use await here

        res.status(201).json({ message: 'Message saved successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'An error occurred while saving the message.' });
    }
});


// API endpoint to fetch all contact messages

// API route to get contact messages
app.get('/Get-contact-us-messages', async (req, res) => {
    try {
        const query = `
            SELECT 
                ContactUsID, 
                Name, 
                Email, 
                ContactNumber, 
                Message, 
                CreatedAt 
            FROM 
                ContactUsMessages
            ORDER BY CreatedAt DESC
        `;

        const [results] = await pool.query(query); // Use pool.query directly
        res.status(200).json(results); // Return all contact messages
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching the messages.' });
    }
});


// Configure multer for file uploads
const store = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'uploads/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
}).fields([
    { name: 'quotationFile', maxCount: 1 },
    { name: 'proformaFile', maxCount: 1 },
    { name: 'shippingDocuments', maxCount: 20 },
]);

app.post('/upload-files-to-user/:orderId/:userId', store, async (req, res) => {
    const { orderId, userId } = req.params;
    let { ShippingStatus, BLNumber, ShippingLines, ETA, ProformaInvoiceNumber,
        CommercialInvoiceNumber, CommercialInvoiceDate, ProformaInvoiceDate, DischargePort, FinalDestination } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    try {
        // Check if the OrderID belongs to the UserID
        const [rows] = await pool.query(`
            SELECT 1 FROM Orders WHERE OrderID = ? AND UserID = ?
        `, [orderId, userId]);

        if (!rows?.length) {
            return res.status(404).json({ message: 'Order not found for this user' });
        }

        // Update order details to avoid duplicate entries
        await pool.query(`
            UPDATE OrderFiles SET 
                ShippingStatus = IF(? = '', ShippingStatus, ?),
                BLNumber = IF(? = '', BLNumber, ?),
                ShippingLines = IF(? = '', ShippingLines, ?),
                ETA = IF(? = '', ETA, ?),
                ProformaInvoiceNumber = IF(? = '', ProformaInvoiceNumber, ?),
                CommercialInvoiceNumber = IF(? = '', CommercialInvoiceNumber, ?),
                CommercialInvoiceDate = IF(? = '', CommercialInvoiceDate, ?),
                ProformaInvoiceDate = IF(? = '', ProformaInvoiceDate, ?),
                DischargePort = IF(? = '', DischargePort, ?),
                FinalDestination = IF(? = '', FinalDestination, ?)
            WHERE OrderID = ?
        `, [
            ShippingStatus, ShippingStatus,
            BLNumber, BLNumber,
            ShippingLines, ShippingLines,
            ETA, ETA,
            ProformaInvoiceNumber, ProformaInvoiceNumber,
            CommercialInvoiceNumber, CommercialInvoiceNumber,
            CommercialInvoiceDate, CommercialInvoiceDate,
            ProformaInvoiceDate, ProformaInvoiceDate,
            DischargePort, DischargePort,
            FinalDestination, FinalDestination,
            orderId
        ]);

        // Function to insert file records
        const insertFileRecord = async (documentType, file) => {
            const { originalname: fileName, path: filePath = '', mimetype: fileType = '' } = file;

            await pool.query(`
                INSERT INTO OrderFiles 
                (OrderID, UserID, DocumentType, FileName, FilePath, FileType, UploadDate)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [orderId, userId, documentType, fileName, filePath, fileType]);
        };

        // Check if files exist before inserting into OrderFiles
        const files = req.files || {};
        if (files.quotationFile) {
            await insertFileRecord('Quotation', files.quotationFile[0]);
        }

        if (files.proformaFile) {
            await insertFileRecord('Proforma Invoice', files.proformaFile[0]);
        }

        if (files.shippingDocuments) {
            await Promise.all(
                files.shippingDocuments.map((file) =>
                    insertFileRecord('Shipping Documents', file)
                )
            );
        }

        res.status(200).json({ message: 'Files uploaded and order details updated successfully' });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
});

module.exports = app;



// API route to get files data for a specific user and order
app.get('/get-files-data/:userId/:orderId', async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT OrderID, UserID, DocumentType, FileName, FilePath, FileType,
                   UploadDate, ShippingStatus, BLNumber,
                   ShippingLines, ETA,
                   ProformaInvoiceNumber, CommercialInvoiceNumber, 
                   CommercialInvoiceDate, ProformaInvoiceDate, DischargePort, FinalDestination
            FROM OrderFiles
            WHERE UserID = ? AND OrderID = ?
        `, [userId, orderId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found for the specified user and order"
            });
        }

        res.status(200).json({
            success: true,
            files: rows
        });
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve files",
            error: error.message
        });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API route to get all uploaded files for a specific user
app.get('/get-uploaded-files', async (req, res) => {
    const { UserID } = req.query;

    if (!UserID) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    try {
        const [rows] = await pool.query(`
            SELECT FileID, DocumentType,
                   FileName,
                   FilePath,
                   FileType,
                   ShippingStatus,
                   BLNumber,
                   ShippingLines,
                   ETA
            FROM UploadedFiles
            WHERE UserID = ?
        `, [UserID]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ message: 'Error retrieving files', error: error.message });
    }
});

module.exports = app;


// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Ensure folder exists
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer file filter: Allow only CSV files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true); // Accept file
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only CSV files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter
}).any();  // Accept any field name

// API Route
// API Route
app.post('/upload-csv', upload, async (req, res) => {
    try {
        console.log(req.files); // Log uploaded file details

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Process only the first CSV file
        const file = req.files[0];
        const filePath = file.path;
        const rows = [];

        // Read and parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                try {
                    for (const row of rows) {
                        if (!row['CATEGORY'] || !row['PRODUCT_DESCRIPTION'] || !row['SKU_CODE']) {
                            console.warn("Skipping invalid row:", row);
                            continue;
                        }

                        // Check if SKU_CODE already exists
                        const checkQuery = `SELECT COUNT(*) AS count FROM cornitos_master WHERE SKU_CODE = ?`;
                        const [existing] = await pool.query(checkQuery, [row['SKU_CODE']]);

                        if (existing[0].count > 0) {
                            console.warn(`SKU_CODE ${row['SKU_CODE']} already exists. Skipping insertion.`);
                            return res.status(400).json({
                                message: `Data already exists for SKU_CODE: ${row['SKU_CODE']}.`,
                                skuCode: row['SKU_CODE']
                            });
                        }

                        // If SKU_CODE does not exist, insert the new record
                        const insertQuery = `
                            INSERT INTO cornitos_master (
                                CATEGORY, CATEGORY_CODE, SUB_CATEGORY, BRAND, CODE, SKU_CODE, PRODUCT_DESCRIPTION,
                                UNIT, UNIT_PER_CTN, WEIGHT_PER_PKT_GRAMS, SHELF_LIFE_MONTHS, NET_WEIGHT,
                                LENGTH_INCHES, WIDTH_INCHES, HEIGHT_INCHES, VOL_PER_CTN, BARCODE, MRP, REMARKS,
                                UNIT_MEASUREMENT_TYPE
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                        const values = [
                            row['CATEGORY'] || null, row['CATEGORY_CODE'] || null, row['SUB_CATEGORY'] || null,
                            row['BRAND'] || null, row['CODE'] || null, row['SKU_CODE'] || null,
                            row['PRODUCT_DESCRIPTION'] || null, row['UNIT'] || null, row['UNIT_PER_CTN'] || null,
                            row['WEIGHT_PER_PKT_GRAMS'] || null, row['SHELF_LIFE_MONTHS'] || null, row['NET_WEIGHT'] || null,
                            row['LENGTH_INCHES'] || null, row['WIDTH_INCHES'] || null, row['HEIGHT_INCHES'] || null,
                            row['VOL_PER_CTN'] || null, row['BARCODE'] || null, row['MRP'] || null,
                            row['REMARKS'] || null, row['UNIT_MEASUREMENT_TYPE'] || null
                        ];

                        await pool.query(insertQuery, values);
                    }

                    // Delete the uploaded file after processing
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Error deleting file:", err);
                    });

                    console.log("✅ CSV data successfully uploaded and saved!");
                    return res.status(200).json({ message: 'CSV data successfully uploaded and saved!' });

                } catch (error) {
                    console.error('Error inserting data:', error);
                    return res.status(500).json({ message: 'Error inserting data', error: error.message });
                }
            })
            .on('error', (error) => {
                console.error("Error reading CSV file:", error);
                return res.status(500).json({ message: "Error processing file", error: error.message });
            });

    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: error.message });
        }

        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Endpoint to upload a single file
app.post('/upload-single', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { documentType, referenceID } = req.body; // Expect these fields in the request
    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname);

    try {
        // Save metadata to the database
        const query = `
            INSERT INTO UploadedFiles (DocumentType, ReferenceID, FileName, FilePath, FileType)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            documentType,
            referenceID,
            req.file.originalname,
            filePath,
            fileType
        ];

        await pool.query(query, values);

        res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error saving file metadata.', error });
    }
});


// Storage configuration
const stor = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer instance with field-based file handling
const uploa = multer({
    storage: stor
});

module.exports = uploa;

// Route for uploading quotation files
app.post('/enquiry-quotation-files/:orderId/:userId',
    uploa.fields([{ name: 'quotationFile', maxCount: 1 }]), // Ensure correct field name
    async (req, res) => {
        const { orderId, userId } = req.params;
        const { DocumentType } = req.body; // Ensure DocumentType is correctly received

        console.log("Request Body:", req.body);
        console.log("Received Files:", req.files); // Log received files

        if (!DocumentType) {
            return res.status(400).json({ message: 'DocumentType is required' });
        }

        if (!req.files || !req.files.quotationFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            // Check if the user exists
            const [userCheck] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE UserID = ?', [userId]);
            if (userCheck[0].count === 0) {
                return res.status(404).json({ message: 'Invalid UserID' });
            }

            // Check if the order exists for the user
            const [orderCheck] = await pool.query(`
                SELECT COUNT(*) AS count 
                FROM container_place_enquiry 
                WHERE OrderID = ? AND UserID = ?
            `, [orderId, userId]);

            if (orderCheck[0].count === 0) {
                console.error(`Invalid OrderID: ${orderId} for UserID: ${userId}`);
                return res.status(404).json({ message: 'Invalid OrderID or Order does not belong to the user' });
            }

            // Process the uploaded file
            const file = req.files.quotationFile[0]; // Get the file
            const fileName = file.originalname;
            const filePath = file.path;
            const fileType = file.mimetype;

            // Save file metadata to the database
            await pool.query(`
                INSERT INTO EnquiryQuotationFiles (OrderID, UserID, DocumentType, ReferenceID, FileName, FilePath, FileType, UploadDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [orderId, userId, DocumentType, null, fileName, filePath, fileType, new Date()]);

            res.status(200).json({
                message: 'File uploaded and metadata saved to database successfully!',
                fileDetails: { fileName, filePath, fileType }
            });
        } catch (error) {
            console.error('Error saving file metadata to database:', error);
            res.status(500).json({ message: 'Failed to save file metadata to database', error: error.message });
        }
    });



// Route for user-specific file retrieval
app.get('/enquiry-quotation-files/:userId/:orderId', authMiddleware, async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        // Query files specific to the authenticated user and order
        const query = `
            SELECT FileName, FilePath, FileType, UploadDate 
            FROM EnquiryQuotationFiles
            WHERE UserID = ? AND OrderID = ?
        `;

        const [rows] = await pool.query(query, [userId, orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No files found for the specified user and order" });
        }

        res.status(200).json({ files: rows });
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ message: "Failed to retrieve files", error: error.message });
    }
});

// API for admin file retrieval for a specific user and order
app.get('/enquiry-quotation-files-admin/:userId/:orderId', async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        // Query files specific to the user and order
        const query = `
            SELECT FileName, FilePath, FileType, UploadDate 
            FROM EnquiryQuotationFiles
            WHERE UserID = ? AND OrderID = ?
        `;

        const [rows] = await pool.query(query, [userId, orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No files found for the specified user and order" });
        }

        res.status(200).json({ files: rows });
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ message: "Failed to retrieve files", error: error.message });
    }
});

// API for downloading a specific file
app.get('/download-file/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName); // Adjust 'uploads' if your directory differs

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error("File download error:", err);
            res.status(500).send("File not found");
        }
    });
});

// API to convert enquiry to order
app.post('/convert-enquiry-to-order', async (req, res) => {
    const { cpeIds } = req.body;

    if (!Array.isArray(cpeIds) || cpeIds.length === 0) {
        return res.status(400).json({ message: 'No CPE_IDs provided. Please select at least one CPE_ID.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const cpeId of cpeIds) {
            // Check if CPE_ID already exists in Orders
            const checkQuery = `
                SELECT COUNT(*) AS count 
                FROM Orders 
                WHERE CPE_ID = ?
            `;
            const [checkResult] = await connection.execute(checkQuery, [cpeId]);

            if (checkResult[0].count > 0) {
                continue; // Skip if the CPE_ID already exists
            }

            // Verify the data before inserting
            const selectQuery = `
                SELECT DISTINCT OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate, TotalCases, TotalQty, RatePerUnitUsd, RatePerCaseUSD, TotalRateInUSDFobIndia, TotalNetWeight, TotalGrossWeight, TotalVolume
                FROM container_place_enquiry
                WHERE CPE_ID = ?
            `;
            const [selectResult] = await connection.execute(selectQuery, [cpeId]);

            // Check if the result has valid data
            if (selectResult.length === 0) {
                console.log('No data found for CPE_ID:', cpeId);
                continue;
            }

            // Insert the data into the Orders table using CPE_ID
            const insertQuery = `
                INSERT INTO Orders (OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate, TotalCases, TotalQty, RatePerUnitUsd, RatePerCaseUSD, TotalRateInUSDFobIndia, TotalNetWeight, TotalGrossWeight, TotalVolume)
                SELECT DISTINCT OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate, TotalCases, TotalQty, RatePerUnitUsd, RatePerCaseUSD, TotalRateInUSDFobIndia, TotalNetWeight, TotalGrossWeight, TotalVolume
                FROM container_place_enquiry
                WHERE CPE_ID = ?
            `;
            try {
                await connection.execute(insertQuery, [cpeId]);
            } catch (err) {
                console.error('Error during INSERT query:', err);
                continue; // Continue with next iteration if insert fails
            }

            // Mark the enquiry data as converted
            const updateQuery = `
                UPDATE container_place_enquiry
                SET IsConverted = 1
                WHERE CPE_ID = ?
            `;
            await connection.execute(updateQuery, [cpeId]);
        }

        await connection.commit(); // Commit the transaction
        res.status(200).json({ message: 'Selected enquiries successfully converted to orders.' });
    } catch (err) {
        if (connection) {
            await connection.rollback(); // Rollback in case of error
        }
        console.error('Error during transaction:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
});

// API to Get Orders Data
app.get('/Get-orders', async (req, res) => {
    try {
        if (!pool) throw new Error("Database connection is not initialized");

        const query = `
            SELECT DISTINCT
                o.OrderID, o.CartonQty, o.ProductID, o.UploadDate,
                u.EmailID, u.UserID, u.FirstName, u.LastName, u.CompanyName,
                ofiles.ShippingStatus
            FROM Orders o
            INNER JOIN users u ON o.UserID = u.UserID
            LEFT JOIN OrderFiles ofiles ON o.OrderID = ofiles.OrderID
            ORDER BY o.UploadDate DESC
        `;

        const [rows] = await pool.query(query);
        res.json({ msg: "Data Fetched Successfully", data: rows });

    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});



// Route for getting orders by user ID
app.get('/Get-orders-data-user-side/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // SQL query with parameterized input for fetching orders specific to the user
        const query = `
            SELECT 
                o.OrderID,
                o.CartonQty,
                o.ProductID,
                o.UploadDate,
                cm.PRODUCT_DESCRIPTION,
                cm.SKU_CODE,
                cm.CATEGORY,
                cm.BRAND,
                cm.SUB_CATEGORY,
                cm.UNIT,
                cm.UNIT_PER_CTN,
                cm.WEIGHT_PER_PKT_GRAMS,
                u.EmailID,
                u.UserID,
                u.FirstName,
                u.LastName,
                u.CompanyName,
                GROUP_CONCAT(DISTINCT ofiles.ShippingStatus SEPARATOR ', ') AS ShippingStatus
            FROM 
                Orders o
            INNER JOIN 
                cornitos_master cm ON o.ProductID = cm.ID
            INNER JOIN 
                users u ON o.UserID = u.UserID
            LEFT JOIN 
                OrderFiles ofiles ON o.OrderID = ofiles.OrderID
            WHERE 
                o.UserID = ?
            GROUP BY 
                o.OrderID
            ORDER BY 
                o.UploadDate DESC
            `;

        const [rows] = await pool.query(query, [userId]);
        res.status(200).json({ msg: 'Data Fetched Successfully', data: rows });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Orders Data for Admin Dashboard
app.get('/Get-orders-for-admin-dash', async (req, res) => {
    try {
        const query = `
            SELECT 
                o.OrderID,
                o.CartonQty,
                o.ProductID,
                o.UploadDate,
                cm.PRODUCT_DESCRIPTION,
                cm.SKU_CODE,
                cm.CATEGORY,
                cm.BRAND,
                cm.SUB_CATEGORY,
                cm.UNIT,
                cm.UNIT_PER_CTN,
                cm.WEIGHT_PER_PKT_GRAMS,
                u.EmailID,
                u.UserID,
                u.FirstName,
                u.LastName,
                u.CompanyName
            FROM 
                Orders o
            INNER JOIN 
                cornitos_master cm ON o.ProductID = cm.ID
            INNER JOIN 
                users u ON o.UserID = u.UserID
            ORDER BY 
                o.UploadDate DESC
            LIMIT 3
        `;

        const [rows] = await pool.query(query);
        res.status(200).json({ data: rows });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Customer Count for Admin
app.get('/Get-admin-customer', async (req, res) => {
    try {
        const query = `SELECT COUNT(*) AS TotalCount FROM users`;
        const [rows] = await pool.query(query);

        console.log("Fetched Customer Count:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching customer count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Distinct Order Enquiry Count for Admin
app.get('/Get-admin-enquiry', async (req, res) => {
    try {
        const query = `SELECT COUNT(DISTINCT OrderID) AS TotalDistinctCount FROM container_place_enquiry`;
        const [rows] = await pool.query(query);

        console.log("Fetched Enquiry Count:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No enquiries found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching enquiry count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Order Count for Admin
app.get('/Get-admin-order', async (req, res) => {
    try {
        const query = `SELECT COUNT(*) AS TotalCount FROM Orders`;
        const [rows] = await pool.query(query);

        console.log("Fetched Order Count:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching order count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Product Count for Admin
app.get('/Get-admin-products', async (req, res) => {
    try {
        const query = `SELECT COUNT(*) AS TotalCount FROM cornitos_master`;
        const [rows] = await pool.query(query);

        console.log("Fetched Product Count:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching product count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Distinct Category Count for Admin
app.get('/Get-admin-category', async (req, res) => {
    try {
        const query = `SELECT COUNT(DISTINCT CATEGORY) AS TotalCategories FROM cornitos_master`;
        const [rows] = await pool.query(query);

        console.log("Fetched Data:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching category count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Distinct Subcategory Count for Admin
app.get('/Get-admin-subcategory', async (req, res) => {
    try {
        const query = `SELECT COUNT(DISTINCT SUB_CATEGORY) AS TotalSubCategories FROM cornitos_master`;
        const [rows] = await pool.query(query);

        console.log("Fetched Data:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No subcategories found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching subcategory count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Get Total Distinct Brand Count for Admin
app.get('/Get-admin-brand', async (req, res) => {
    try {
        const query = `SELECT COUNT(DISTINCT BRAND) AS TotalBrands FROM cornitos_master`;
        const [rows] = await pool.query(query);

        console.log("Fetched Data:", rows); // Debugging

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No brands found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error('Error fetching brand count:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// API to Download the Product Catalogue
app.get('/download-catalogue', (req, res) => {
    const filePath = path.join(__dirname, 'EXIMTRAC INDIAN MERCHANT GROCERY EXPORTER PRODUCT CATALOGUE 2024.pdf');
    res.download(filePath, 'EXIMTRAC INDIAN MERCHANT GROCERY EXPORTER PRODUCT CATALOGUE 2024.pdf', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

module.exports = app;


app.post("/send-enquiry-email", async (req, res) => {
    const { email } = req.body;  // Email ID of the user

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Configure your email transporter (use your SMTP credentials)
    let transporter = nodemailer.createTransport({
        service: "gmail",  // You can use your email provider (Gmail, Outlook, etc.)
        auth: {
            user: "ayushsshah04@gmail.com",  // Replace with your email
            pass: "wlfy yekg dvwq aqcq",  // Replace with your email app password
        },
    });

    let mailOptions = {
        from: "ayushsshah04@gmail.com",
        to: email,
        subject: "Order Enquiry Placed",
        text: `Dear Customer, \n\nYour order enquiry has been placed successfully. We will get back to you shortly.\n\nBest Regards,\nEximtrac`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Failed to send email", error: error.toString() });
    }
});

module.exports = app;





// **1. Forgot Password - Generate Token & Send Email**
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE EmailID = ?", [email]);
        if (rows.length === 0) return res.status(404).send("User not found");

        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

        await pool.query(
            "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE EmailID = ?",
            [resetToken, expiry, email]
        );

        // **Send Reset Email**
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "ayushsshah04@gmail.com", pass: "wlfy yekg dvwq aqcq" },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password",
            html: `<p>Click <a href="http://localhost:3001/reset-password/${resetToken}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.send("Reset link sent to email");

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// **2. Reset Password - Validate Token & Update Password**
app.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE EmailID = ? AND reset_token = ? AND reset_token_expiry > NOW()",
            [email, token]
        );

        if (rows.length === 0) return res.status(400).send("Invalid or expired token");

        await pool.query(
            "UPDATE users SET Password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE EmailID = ?",
            [password, email]
        );

        res.send("Password reset successful");

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Invalid token or Internal Server Error");
    }
});

module.exports = app;




// Update Enquiry Data API
app.post("/update-enquiry", async (req, res) => {
    const updatedRows = req.body.data;

    if (!updatedRows || updatedRows.length === 0) {
        return res.status(400).json({ message: "No data to update" });
    }

    try {
        // Use a single database connection for all updates
        const connection = await pool.getConnection();

        for (const row of updatedRows) {
            const query = `
                UPDATE container_place_enquiry SET 
                TotalCases = ?, 
                TotalQty = ?, 
                RatePerUnitUSD = ?, 
                RatePerCaseUSD = ?, 
                TotalRateInUSDFobIndia = ?, 
                TotalNetWeight = ?, 
                TotalGrossWeight = ?, 
                TotalVolume = ?
                WHERE CPE_ID = ?;
            `;

            const values = [
                row.TotalCases || null,
                row.TotalQty || null,
                row.RatePerUnitUSD || null,
                row.RatePerCaseUSD || null,
                row.TotalRateInUSDFobIndia || null,
                row.TotalNetWeight || null,
                row.TotalGrossWeight || null,
                row.TotalVolume || null,
                row.CPE_ID,
            ];

            await connection.query(query, values);
        }

        connection.release(); // Release connection after updates
        res.json({ message: "Data updated successfully" });
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ message: "Database update failed" });
    }
});



app.post("/update-enquiry-user-side", async (req, res) => {
    const { cpeId, status } = req.body;

    if (!cpeId || !status) {
        return res.status(400).json({ message: "Missing CPE_ID or status" });
    }

    try {
        await pool.execute(
            "UPDATE container_place_enquiry SET UserStatus = ? WHERE CPE_ID = ?",
            [status, cpeId]
        );
        res.json({ message: "Status updated successfully" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Storage Configuration (Extract SKU from Filename)
const imagestorage = multer.diskStorage({
    destination: "uploads/", // Change if using cloud storage
    filename: (req, file, cb) => {
        const sku = path.parse(file.originalname).name; // Extract SKU from filename
        cb(null, `${sku}${path.extname(file.originalname)}`); // Save as SKU.ext
    }
});

const uploadimage = multer({ storage: imagestorage });

app.post("/upload-images", uploadimage.array("images"), async (req, res) => {
    try {
        const files = req.files;
        let updatedProducts = [];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        for (const file of files) {
            const SKU_CODE = path.parse(file.filename).name; // Extract SKU from filename
            const Image_URL = `uploads/${file.filename}`;

            console.log(`Updating SKU: ${SKU_CODE} with Image URL: ${Image_URL}`);

            // ✅ Use `pool.execute()` instead of `db.query()`
            const [result] = await pool.execute(
                "UPDATE cornitos_master SET Image_URL = ? WHERE SKU_CODE = ?",
                [Image_URL, SKU_CODE]
            );

            if (result.affectedRows > 0) {
                updatedProducts.push({ SKU_CODE, Image_URL });
            }
        }

        if (updatedProducts.length === 0) {
            return res.status(400).json({ error: "No valid SKUs found in filenames" });
        }

        res.json({ message: "Images uploaded successfully", updatedProducts });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to upload images", details: error.message });
    }
});



// Set the server to listen on PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});