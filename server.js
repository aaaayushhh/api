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







const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const csvParser = require('csv-parser');
const bodyParser = require('body-parser');
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require('./auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use(bodyParser.json());

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





const connection = mysql.createConnection({
    host: "deepaspheresolutions.co.in",   // Example: "localhost" or a remote host
    user: "ayush",
    password: "ayush@123!@#",
    database: "eximtrac"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = connection;



// sql.connect(config)
//     .then(() => console.log('Connected to SQL Server'))
//     .catch(err => console.error('Database connection failed:', err));

// Define routes
app.get("/GetAllProducts", async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }
        const result = await pool.request().query("SELECT * FROM cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get("/GetCategoryandSubCategory", async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }
        const result = await pool.request().query("select distinct CATEGORY, SUB_CATEGORY from cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
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
        if (!pool) {
            throw new Error("Database connection is not initialized");
        }
        const result = await pool.request().query("SELECT DISTINCT CATEGORY AS name FROM cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/GetSubCategory", async (req, res) => {
    try {
        const { category } = req.query;
        if (!pool) {
            throw new Error("Database connection is not initialized");
        }

        let query = "SELECT DISTINCT SUB_CATEGORY FROM cornitos_master";
        if (category) {
            query += ` WHERE CATEGORY = '${category}'`;
        }

        const result = await pool.request().query(query);
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/GetBrand", async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        if (!pool) {
            throw new Error("Database connection is not initialized");
        }

        let query = "SELECT DISTINCT BRAND FROM cornitos_master";
        if (category || subCategory) {
            query += " WHERE";
            if (category) {
                query += ` CATEGORY = '${category}'`;
            }
            if (subCategory) {
                query += `${category ? " AND" : ""} SUB_CATEGORY = '${subCategory}'`;
            }
        }

        const result = await pool.request().query(query);
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});





app.get("/GetFilter", async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }
        const result = await pool.request().query("select distinct CATEGORY, SUB_CATEGORY, BRAND from cornitos_master");
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-add-to-container/:userId", authMiddleware, async (req, res) => {
    try {
        if (!pool) {
            throw new Error("Database connection is not initialized");
        }

        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ msg: "UserID is required" });
        }

        // Query filtered by UserID
        const result = await pool.request()
            .input("UserID", userId)
            .query(`
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
                    l.username
                FROM 
                    to_container tc
                INNER JOIN 
                    cornitos_master cm
                    ON tc.ProductID = cm.ID
                INNER JOIN 
                    login l
                    ON tc.UserID = l.ID
                WHERE 
                    tc.UserID = @UserID;
            `);

        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get("/Get-data-for-order-page/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }
        // Execute the SQL query with parameter binding to prevent SQL injection
        const result = await pool
            .request()
            .input("userId", sql.VarChar, userId) // Bind the userId parameter
            .query(
                "SELECT DISTINCT OrderID, UploadDate, UserID FROM container_place_enquiry WHERE UserID = @userId"
            );
        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get("/Get-data-for-user-side-enquiry-page/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }

        // Execute the SQL query with a join to the users table
        const result = await pool
            .request()
            .input("userId", sql.VarChar, userId) // Bind the userId parameter
            .query(
                `SELECT DISTINCT 
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
                        cpe.UserID = @UserID
                     ORDER BY 
                        UploadDate DESC`
            );

        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});

app.get("/Get-data-for-enquiry-page", async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }

        // Execute the SQL query with a join to the users table
        const result = await pool
            .request()
            .query(
                `SELECT DISTINCT 
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
                    ORDER BY UploadDate DESC`
            );

        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get("/Get-data-for-admin-dash-enquiry-page", async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }

        // Execute the SQL query with a join to the users table
        const result = await pool
            .request()
            .query(
                `SELECT DISTINCT TOP 3
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
                    ORDER BY UploadDate DESC`
            );

        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get("/Get-container-place-enquiry-user-and-admin/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params; // Get UserID from the route parameter

    try {
        // Validate UserID
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
    c_m.PRODUCT_DESCRIPTION,         -- Data from cornitos_master
    c_m.SKU_CODE,
	c_m.CATEGORY,
	c_m.BRAND,
	c_m.SUB_CATEGORY,
	c_m.UNIT,
	c_m.UNIT_PER_CTN,
	c_m.WEIGHT_PER_PKT_GRAMS,
    cpe.UserID,
    lo.username              -- Data from login

FROM 
    container_place_enquiry cpe
INNER JOIN 
    cornitos_master c_m
    ON cpe.ProductID = c_m.ID
INNER JOIN 
    login lo
    ON cpe.UserID = lo.ID

WHERE
	userId = @userId
        `;

        const request = new sql.Request();
        request.input('UserID', sql.Int, userId); // Pass the UserID dynamically

        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ msg: 'Error Fetching Data', error: err.message });
    }
});

app.get("/Get-container-place-enquiry-user-and-admin/:userId/:orderId", async (req, res) => {
    const { userId, orderId } = req.params; // Get UserID and OrderID from the route parameters

    try {
        // Validate UserID
        if (!userId) {
            return res.status(400).json({ message: "UserID is required" });
        }

        const query = `
            SELECT 
                cpe.CPE_ID,
                cpe.CartonQty,
                cpe.ProductID,
                cpe.OrderID,
                cpe.UploadDate,
                c_m.PRODUCT_DESCRIPTION, -- Data from cornitos_master
                c_m.SKU_CODE,
                c_m.CATEGORY,
                c_m.BRAND,
                c_m.SUB_CATEGORY,
                c_m.UNIT,
                c_m.UNIT_PER_CTN,
                c_m.WEIGHT_PER_PKT_GRAMS,
                cpe.UserID,
                lo.username              -- Data from login
            FROM 
                container_place_enquiry cpe
            INNER JOIN 
                cornitos_master c_m
                ON cpe.ProductID = c_m.ID
            INNER JOIN 
                login lo
                ON cpe.UserID = lo.ID
            WHERE
                cpe.UserID = @userId
                ${orderId ? "AND cpe.OrderID = @orderId" : ""}
        `;

        const request = new sql.Request();
        request.input("UserID", sql.Int, userId); // Pass the UserID dynamically
        if (orderId) request.input("OrderID", sql.VarChar(15), orderId); // Pass the OrderID if provided

        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});




// POST API to insert data into the table

app.post('/add-to-container', authMiddleware, async (req, res) => {
    console.log(req.body); // Debugging: Log request body
    try {
        const { Quantity, ProductID, UserID, CartonQty } = req.body;

        // Validate inputs
        if (!Quantity || !ProductID || !UserID || !CartonQty) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // if (!Number.isInteger(CartonQty) || CartonQty <= 0) {
        //     return res.status(400).json({ message: 'CartonQty must be a positive integer' });
        // }

        // Check if ProductID and UserID exist in their respective tables
        const checkProductQuery = `
            SELECT COUNT(*) AS count 
            FROM cornitos_master 
            WHERE ID = @ProductID
        `;
        const checkUserQuery = `
            SELECT COUNT(*) AS count 
            FROM login 
            WHERE ID = @UserID
        `;

        const request = new sql.Request();
        request.input('ProductID', sql.Int, ProductID);
        request.input('UserID', sql.Int, UserID);

        const productResult = await request.query(checkProductQuery);
        const userResult = await request.query(checkUserQuery);

        if (productResult.recordset[0].count === 0) {
            return res.status(400).json({ message: 'Invalid ProductID' });
        }
        if (userResult.recordset[0].count === 0) {
            return res.status(400).json({ message: 'Invalid UserID' });
        }

        // Insert into the database
        const insertQuery = `
            INSERT INTO to_container (Quantity, ProductID, UserID, CartonQty)
            VALUES (@Quantity, @ProductID, @UserID, @CartonQty)
        `;
        request.input('Quantity', sql.Int, Quantity);
        request.input('CartonQty', sql.Int, CartonQty);
        await request.query(insertQuery);

        res.status(201).json({ message: 'Added to container successfully!' });
    } catch (error) {
        console.error('Error in /add-to-container:', error.message, error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



const { v4: uuidv4 } = require('uuid'); // Import UUID library for generating unique IDs

app.post('/container-place-enquiry', authMiddleware, async (req, res) => {
    const data = req.body; // This should be an array of objects

    // Validate the input
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'An array of data is required' });
    }

    // Validate each item in the array
    for (const item of data) {
        const { ProductID, UserID, CartonQty } = item;
        if (!ProductID || !UserID || CartonQty === undefined) {
            return res.status(400).json({ message: 'All fields (ProductID, UserID, CartonQty) are required for each item' });
        }
    }

    try {
        // Generate a unique Order ID (UUID) for this batch of data
        const orderId = uuidv4().slice(0, 15); // Ensure OrderID fits VARCHAR(15)

        // Prepare the query for multiple inserts
        const query = `
            INSERT INTO container_place_enquiry (OrderID, CartonQty, ProductID, UserID)
            VALUES 
            ${data.map((item, index) => `(@OrderID, @CartonQty${index}, @ProductID${index}, @UserID${index})`).join(', ')}
        `;

        const request = new sql.Request();

        // Add inputs for each item in the array, including the unique OrderID
        request.input('OrderID', sql.VarChar(15), orderId); // OrderID is the same for all rows
        data.forEach((item, index) => {
            request.input(`CartonQty${index}`, sql.Int, item.CartonQty);
            request.input(`ProductID${index}`, sql.Int, item.ProductID);
            request.input(`UserID${index}`, sql.Int, item.UserID);
        });

        // Execute the query
        await request.query(query);

        res.status(201).json({ message: 'Data inserted successfully', orderId: orderId });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.delete('/delete-container-data', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body; // Assuming you are using UserID to identify the data to delete

        if (!userId) {
            return res.status(400).json({ message: "UserID is required" });
        }

        const query = `DELETE FROM to_container WHERE UserID = @UserID`; // Update table name as per your schema
        const request = new sql.Request();
        request.input("UserID", sql.Int, userId);

        await request.query(query);

        res.status(200).json({ message: "Container data deleted successfully" });
    } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


app.delete('/delete-container-item/:productId/:userId', authMiddleware, async (req, res) => {
    const { productId, userId } = req.params;

    if (!productId || !userId) {
        return res.status(400).json({ message: 'ProductID and UserID are required' });
    }

    try {
        const request = new sql.Request();
        request.input('ProductID', sql.Int, productId);
        request.input('UserID', sql.Int, userId);

        const query = `DELETE FROM to_container WHERE ProductID = @ProductID AND UserID = @UserID`;
        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// API to update a category
app.put("/update-categories", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Connect to the database
        await sql.connect(config);

        // Prepare the request and define parameters
        const request = new sql.Request();
        request.input('oldName', sql.NVarChar, oldName);  // old category name
        request.input('newName', sql.NVarChar, newName);  // new category name

        // Run the SQL UPDATE query
        const result = await request.query(`
            UPDATE cornitos_master
            SET CATEGORY = @newName
            WHERE CATEGORY = @oldName
        `, {
            oldName: oldName,
            newName: newName
        });

        // Check if any row was updated
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: "Category updated successfully" });
        } else {
            return res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: "Error updating category", error: err });
    }
});



app.put("/update-subcategories", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Connect to the database
        await sql.connect(config);

        // Prepare the request and define parameters
        const request = new sql.Request();
        request.input('oldName', sql.NVarChar, oldName);  // old category name
        request.input('newName', sql.NVarChar, newName);  // new category name

        // Run the SQL UPDATE query
        const result = await request.query(`
            UPDATE cornitos_master
            SET SUB_CATEGORY = @newName
            WHERE SUB_CATEGORY = @oldName
        `, {
            oldName: oldName,
            newName: newName
        });

        // Check if any row was updated
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: "Sub-Category updated successfully" });
        } else {
            return res.status(404).json({ message: "Sub-Category not found" });
        }
    } catch (err) {
        console.error('Error updating sub-category:', err);
        return res.status(500).json({ message: "Error updating sub-category", error: err });
    }
});



app.put("/update-brand", async (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
        return res.status(400).json({ message: "Both oldName and newName are required." });
    }

    try {
        // Connect to the database
        await sql.connect(config);

        // Prepare the request and define parameters
        const request = new sql.Request();
        request.input('oldName', sql.NVarChar, oldName);  // old category name
        request.input('newName', sql.NVarChar, newName);  // new category name

        // Run the SQL UPDATE query
        const result = await request.query(`
            UPDATE cornitos_master
            SET BRAND = @newName
            WHERE BRAND = @oldName
        `, {
            oldName: oldName,
            newName: newName
        });

        // Check if any row was updated
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: "Brand updated successfully" });
        } else {
            return res.status(404).json({ message: "Brand not found" });
        }
    } catch (err) {
        console.error('Error updating brand:', err);
        return res.status(500).json({ message: "Error updating brand", error: err });
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
            INSERT INTO users (EmailID, Password) VALUES (@EmailID, @Password)
        `;
        const poolRequest = (await pool).request();
        poolRequest.input("EmailID", sql.VarChar, EmailID);
        poolRequest.input("Password", sql.VarChar, Password); // Store plain-text password

        await poolRequest.query(query);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});


app.post("/loginuser", async (req, res) => {
    const { EmailID, Password } = req.body;

    try {
        const query = `
            SELECT EmailID, Password, UserID FROM users WHERE EmailID = @EmailID
        `;
        const poolRequest = (await pool).request();
        poolRequest.input("EmailID", sql.VarChar, EmailID);

        const result = await poolRequest.query(query);
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare plain-text password directly
        if (Password !== user.Password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ UserID: user.UserID, EmailID: user.EmailID }, process.env.SECRET_KEY, {
            expiresIn: '1h' // Token expiration time
        });

        res.json({ message: "Login successful", user: { UserID: user.UserID }, token: token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.EmailID}` });
});


// Profile Update Route
app.put("/profile", authMiddleware, async (req, res) => {
    const { userId } = req.body; // Get userId from token after middleware
    const { FirstName, LastName, PhoneNumber, CompanyName, CompanyAddress, City, State, Country, ZipCode, DischargePort, AlternatePhone } = req.body;

    try {
        const query = `
            UPDATE users 
            SET FirstName = @FirstName, LastName = @LastName, PhoneNumber = @PhoneNumber, CompanyName = @CompanyName,
                CompanyAddress = @CompanyAddress, City = @City, State = @State, Country = @Country, ZipCode = @ZipCode,
                DischargePort = @DischargePort, AlternatePhone = @AlternatePhone
            WHERE UserID = @UserID
        `;

        const poolRequest = (await pool).request();
        poolRequest.input("FirstName", sql.VarChar, FirstName);
        poolRequest.input("LastName", sql.VarChar, LastName);
        poolRequest.input("PhoneNumber", sql.VarChar, PhoneNumber);
        poolRequest.input("CompanyName", sql.VarChar, CompanyName);
        poolRequest.input("CompanyAddress", sql.VarChar, CompanyAddress);
        poolRequest.input("City", sql.VarChar, City);
        poolRequest.input("State", sql.VarChar, State);
        poolRequest.input("Country", sql.VarChar, Country);
        poolRequest.input("ZipCode", sql.VarChar, ZipCode);
        poolRequest.input("DischargePort", sql.VarChar, DischargePort);
        poolRequest.input("AlternatePhone", sql.VarChar, AlternatePhone);
        poolRequest.input("UserID", sql.Int, userId);

        await poolRequest.query(query);

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
        // Establish a connection pool
        const pool = await sql.connect(config);

        // Query the database
        const result = await pool
            .request()
            .input("userId", sql.Int, userId) // Use the correct datatype for your `userId`
            .query("SELECT * FROM users WHERE userId = @userId"); // Replace 'Users' and fields as per your DB

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]); // Send the user data
        } else {
            res.status(404).json({ error: "User not found" });
        }

        // Close the pool connection after the query
        pool.close();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/get-customers", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT UserID, EmailID, FirstName, LastName, CompanyName FROM users"); // Modify the query as per your DB

        res.status(200).json(result.recordset); // Return all users
    } catch (error) {
        console.error("Error fetching customer list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.post('/adminlogin', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        // Validate input
        if (!Username || !Password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Query to check the login credentials
        const query = `
            SELECT * 
            FROM admin_login 
            WHERE Username = @Username AND Password = @Password
        `;

        const request = new sql.Request();
        request.input('Username', sql.VarChar, Username);
        request.input('Password', sql.VarChar, Password);

        const result = await request.query(query);

        if (result.recordset.length > 0) {
            // Successful login
            res.status(200).json({
                message: 'Login Successful',
                user: result.recordset[0], // Send the user details (optional)
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
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Email', sql.NVarChar, Email)
            .input('ContactNumber', sql.NVarChar, ContactNumber)
            .input('Message', sql.NVarChar, Message)
            .query(`
                INSERT INTO ContactUsMessages (Name, Email, ContactNumber, Message)
                VALUES (@Name, @Email, @ContactNumber, @Message)
            `);

        res.status(201).json({ message: 'Message saved successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'An error occurred while saving the message.' });
    }
});

// API endpoint to fetch all contact messages
app.get('/Get-contact-us-messages', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
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
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching the messages.' });
    }
});



const store = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Ensure this directory exists
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
    const { ShippingStatus, BLNumber, ShippingLines, ETA, ProformaInvoiceNumber } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    const pool = await sql.connect(config);

    try {
        // Check if the OrderID belongs to the UserID
        const checkOrder = await pool.request()
            .input('OrderID', sql.VarChar(100), orderId)
            .input('UserID', sql.Int, userId)
            .query(`
                SELECT 1 
                FROM Orders 
                WHERE OrderID = @OrderID AND UserID = @UserID
            `);

        if (checkOrder.recordset.length === 0) {
            return res.status(404).json({ message: 'Order not found for this user' });
        }

        const files = req.files;
        if (!files) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const insertFileRecord = async (documentType, file) => {
            const { originalname: fileName, path: filePath, mimetype: fileType } = file;

            await pool.request()
                .input('OrderID', sql.VarChar(100), orderId)
                .input('UserID', sql.Int, userId)
                .input('DocumentType', sql.NVarChar(50), documentType)
                .input('FileName', sql.NVarChar(255), fileName)
                .input('FilePath', sql.NVarChar(500), filePath)
                .input('FileType', sql.NVarChar(50), fileType)
                .input('ShippingStatus', sql.NVarChar(100), ShippingStatus || null)
                .input('BLNumber', sql.NVarChar(100), BLNumber || null)
                .input('ShippingLines', sql.NVarChar(100), ShippingLines || null)
                .input('ETA', sql.NVarChar(100), ETA || null)
                .input('ProformaInvoiceNumber', sql.NVarChar(20), ProformaInvoiceNumber || null)
                .query(`
                    INSERT INTO OrderFiles (
                        OrderID, UserID, DocumentType, FileName, FilePath, 
                        FileType, UploadDate, ShippingStatus, BLNumber, ShippingLines, ETA, ProformaInvoiceNumber
                    ) VALUES (
                        @OrderID, @UserID, @DocumentType, @FileName, @FilePath, 
                        @FileType, GETDATE(), @ShippingStatus, @BLNumber, @ShippingLines, @ETA, @ProformaInvoiceNumber
                    )
                `);
        };

        if (files.quotationFile) {
            await insertFileRecord('Quotation', files.quotationFile[0]);
        }

        if (files.proformaFile) {
            await insertFileRecord('Proforma Invoice', files.proformaFile[0]);
        }

        if (files.shippingDocuments) {
            for (const file of files.shippingDocuments) {
                await insertFileRecord('Shipping Documents', file);
            }
        }

        res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'File upload error', error: error.message });
    } finally {
        pool.close();
    }
});

module.exports = app;



app.get('/get-files-data/:userId/:orderId', authMiddleware, async (req, res) => {
    const { userId, orderId } = req.params; // Extract userId and orderId from the route parameters

    try {
        const pool = await sql.connect(config); // Establish connection with the database

        // Execute the query with parameterized inputs
        const result = await pool.request()
            .input('userId', sql.Int, userId) // Use sql.Int if userId is an integer in the database
            .input('orderId', sql.VarChar, orderId) // Use sql.VarChar if orderId is a string in the database
            .query(`
                SELECT 
                    OrderID, UserID, DocumentType, FileName, FilePath, FileType, UploadDate, 
                    ShippingStatus, BLNumber, ShippingLines, ETA, ProformaInvoiceNumber
                FROM OrderFiles
                WHERE UserID = @userId AND OrderID = @orderId
            `);

        // Check if any files are found
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found for the specified user and order"
            });
        }

        // Return the file data if found
        res.status(200).json({
            success: true,
            files: result.recordset
        });
    } catch (error) {
        console.error("Error retrieving files:", error);

        // Return a 500 response for server errors
        res.status(500).json({
            success: false,
            message: "Failed to retrieve files",
            error: error.message
        });
    }
});

const filepath = require('path');

app.use('/uploads', express.static(filepath.join(__dirname, 'uploads')));

module.exports = app;



// API route to get uploaded files for a specific order and user
app.get('/get-uploaded-files', authMiddleware, async (req, res) => {
    // const { OrderID, UserID } = req.query; // Get OrderID and UserID from query parameters
    const { UserID } = req.query; // Get OrderID and UserID from query parameters

    // if (!OrderID || !UserID) {
    //     return res.status(400).json({ message: 'OrderID and UserID are required' });
    // }

    if (!UserID) {
        return res.status(400).json({ message: 'UserID are required' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            // .input('OrderID', sql.VarChar(100), OrderID)
            .input('UserID', sql.Int, UserID)
            .query(`
                SELECT FileID, DocumentType, FileName, FilePath, FileType, ShippingStatus, BLNumber, ShippingLines, ETA
                FROM UploadedFiles
                WHERE OrderID = @OrderID AND UserID = @UserID
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ message: 'Error retrieving files', error: error.message });
    }
});




// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload and process CSV
app.post('/upload-csv', upload.single('file'), async (req, res) => {
    console.log(req.file); // Should log file details if uploaded correctly
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    const filePath = req.file.path;

    // Connect to the database
    try {
        // const pool = await sql.connect(dbConfig);

        const rows = [];
        // Read and parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // console.log('Parsed Row:', row);
                rows.push(row);
            })
            .on('end', async () => {
                try {
                    // Insert each row into the database
                    for (const row of rows) {
                        await pool.request()
                            .input('Category', sql.VarChar(50), row['CATEGORY'] || null)
                            .input('CategoryCode', sql.VarChar(10), row['CATEGORY_CODE'] || null)
                            .input('SubCategory', sql.VarChar(50), row['SUB_CATEGORY'] || null)
                            .input('Brand', sql.VarChar(50), row['BRAND'] || null)
                            .input('Code', sql.VarChar(20), row['CODE'] || null)
                            .input('SkuCode', sql.VarChar(20), row['SKU_CODE'] || null)
                            .input('ProductDescription', sql.Text, row['PRODUCT_DESCRIPTION'] || null)
                            .input('Unit', sql.VarChar(10), row['UNIT'] || null)
                            .input('UnitPerCtn', sql.Int, row['UNIT_PER_CTN'] || null)
                            .input('WeightPerPktGrams', sql.VarChar(20), row['WEIGHT_PER_PKT_GRAMS'] || null)
                            .input('ShelfLifeMonths', sql.Int, row['SHELF_LIFE_MONTHS'] || null)
                            .input('NetWeight', sql.Decimal(10, 2), row['NET_WEIGHT'] || null)
                            .input('LengthInches', sql.Decimal(10, 2), row['LENGTH_INCHES'] || null)
                            .input('WidthInches', sql.Decimal(10, 2), row['WIDTH_INCHES'] || null)
                            .input('HeightInches', sql.Decimal(10, 2), row['HEIGHT_INCHES'] || null)
                            .input('VolPerCtn', sql.Decimal(10, 2), row['VOL_PER_CTN'] || null)
                            .input('Barcode', sql.VarChar(20), row['BARCODE'] || null)
                            .input('Mrp', sql.VarChar(20), row['MRP'] || null)
                            .input('Remarks', sql.Text, row['REMARKS'] || null)
                            .input('UnitMeasurementType', sql.VarChar(10), row['UNIT_MEASUREMENT_TYPE'] || null)
                            .query(`
                                INSERT INTO cornitos_master (
                                    CATEGORY, CATEGORY_CODE, SUB_CATEGORY, BRAND, CODE, SKU_CODE, PRODUCT_DESCRIPTION,
                                    UNIT, UNIT_PER_CTN, WEIGHT_PER_PKT_GRAMS, SHELF_LIFE_MONTHS, NET_WEIGHT,
                                    LENGTH_INCHES, WIDTH_INCHES, HEIGHT_INCHES, VOL_PER_CTN, BARCODE, MRP, REMARKS,
                                    UNIT_MEASUREMENT_TYPE
                                ) VALUES (
                                    @Category, @CategoryCode, @SubCategory, @Brand, @Code, @SkuCode, @ProductDescription,
                                    @Unit, @UnitPerCtn, @WeightPerPktGrams, @ShelfLifeMonths, @NetWeight,
                                    @LengthInches, @WidthInches, @HeightInches, @VolPerCtn, @Barcode, @Mrp, @Remarks,
                                    @UnitMeasurementType
                                )
                            `);
                    }

                    // Cleanup: delete the uploaded file after processing
                    fs.unlinkSync(filePath);

                    res.status(200).json({ message: 'CSV data successfully uploaded and saved!' });
                } catch (error) {
                    console.error('Error inserting data:', error);
                    res.status(500).json({ message: 'Error inserting data', error });
                }
            });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ message: 'Database connection error', error: err });
    }
});



app.post('/upload-single', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { documentType, referenceID } = req.body; // Expect these fields in the request
    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname);

    try {
        // Save metadata to the database
        const pool = await sql.connect(dbConfig); // dbConfig should be your MSSQL configuration
        await pool.request()
            .input('DocumentType', sql.NVarChar(50), documentType)
            .input('ReferenceID', sql.Int, referenceID)
            .input('FileName', sql.NVarChar(255), req.file.originalname)
            .input('FilePath', sql.NVarChar(500), filePath)
            .input('FileType', sql.NVarChar(50), fileType)
            .query(`
                INSERT INTO UploadedFiles (DocumentType, ReferenceID, FileName, FilePath, FileType)
                VALUES (@DocumentType, @ReferenceID, @FileName, @FilePath, @FileType)
            `);

        res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error saving file metadata.', error });
    }
});



// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const storing = multer({ storage }).fields([{ name: 'quotationFile', maxCount: 1 }]);

// Route for file upload
app.post('/enquiry-quotation-files/:orderId/:userId', async (req, res) => {
    const { orderId, userId } = req.params;
    const { DocumentType } = req.body;

    console.log("Request Body:", req.body);
    console.log("Received UserID:", userId);
    console.log("Received OrderID:", orderId);
    console.log("Received DocumentType:", DocumentType);

    if (!DocumentType) {
        return res.status(400).json({ message: 'DocumentType is required' });
    }

    const pool = await sql.connect(config);

    storing(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }

        try {
            const userCheck = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT COUNT(*) AS count FROM Users WHERE UserID = @UserID');
            if (userCheck.recordset[0].count === 0) {
                return res.status(404).json({ message: 'Invalid UserID' });
            }

            const orderCheck = await pool.request()
                .input('OrderID', sql.VarChar(15), orderId)
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT COUNT(*) AS count 
                    FROM Orders 
                    WHERE OrderID = @OrderID AND UserID = @UserID
                `);
            if (orderCheck.recordset[0].count === 0) {
                console.error(`Invalid OrderID: ${orderId} for UserID: ${userId}`);
                return res.status(404).json({ message: 'Invalid OrderID or Order does not belong to the user' });
            }

            const uploadedFiles = req.files.quotationFile || [];
            if (uploadedFiles.length === 0) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const file = uploadedFiles[0];
            const fileName = file.originalname;
            const filePath = `uploads/${file.filename}`;
            const fileType = file.mimetype;

            await pool.request()
                .input('OrderID', sql.VarChar(15), orderId)
                .input('UserID', sql.Int, userId)
                .input('DocumentType', sql.NVarChar(50), DocumentType)
                .input('ReferenceID', sql.Int, null)
                .input('FileName', sql.NVarChar(255), fileName)
                .input('FilePath', sql.NVarChar(500), filePath)
                .input('FileType', sql.NVarChar(50), fileType)
                .input('UploadDate', sql.DateTime, new Date())
                .query(`
                    INSERT INTO EnquiryQuotationFiles (OrderID, UserID, DocumentType, ReferenceID, FileName, FilePath, FileType, UploadDate)
                    VALUES (@OrderID, @UserID, @DocumentType, @ReferenceID, @FileName, @FilePath, @FileType, @UploadDate)
                `);

            res.status(200).json({
                message: 'File uploaded and metadata saved to database successfully!',
                fileDetails: { fileName, filePath, fileType }
            });
        } catch (error) {
            console.error('Error saving file metadata to database:', error);
            res.status(500).json({ message: 'Failed to save file metadata to database', error: error.message });
        }
    });
});

module.exports = app;


// Route for user-specific file retrieval
app.get('/enquiry-quotation-files/:userId/:orderId', authMiddleware, async (req, res) => {
    const { userId, orderId } = req.params; // Extract userId and orderId from route parameters

    try {
        const pool = await sql.connect(config);

        // Query files specific to the authenticated user and order
        const result = await pool.request()
            .input('userId', sql.VarChar, userId) // Bind userId to prevent SQL injection
            .input('orderId', sql.VarChar, orderId) // Bind orderId to prevent SQL injection
            .query(`
                SELECT FileName, FilePath, FileType, UploadDate 
                FROM EnquiryQuotationFiles
                WHERE UserID = @userId AND OrderID = @orderId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No files found for the specified user and order" });
        }

        // Return the file metadata
        res.status(200).json({ files: result.recordset });
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ message: "Failed to retrieve files", error: error.message });
    } finally {
        sql.close(); // Close the SQL connection
    }
});

// Route for admin-specific file retrieval
app.get('/enquiry-quotation-files-admin/:userId/:orderId', async (req, res) => {
    const { userId, orderId } = req.params; // Extract userId and orderId from route parameters

    try {
        const pool = await sql.connect(config);

        // Query files specific to the user and order
        const result = await pool.request()
            .input('userId', sql.VarChar, userId) // Bind userId to prevent SQL injection
            .input('orderId', sql.VarChar, orderId) // Bind orderId to prevent SQL injection
            .query(`
                SELECT FileName, FilePath, FileType, UploadDate 
                FROM EnquiryQuotationFiles
                WHERE UserID = @userId AND OrderID = @orderId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No files found for the specified user and order" });
        }

        // Return the file metadata
        res.status(200).json({ files: result.recordset });
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ message: "Failed to retrieve files", error: error.message });
    } finally {
        sql.close(); // Close the SQL connection
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


app.post('/convert-enquiry-to-order', async (req, res) => {
    const { cpeIds } = req.body; // assuming you're passing CPE_IDs now instead of OrderIDs

    if (!Array.isArray(cpeIds) || cpeIds.length === 0) {
        return res.status(400).json({ message: 'No CPE_IDs provided. Please select at least one CPE_ID.' });
    }

    let transaction;
    try {
        transaction = new sql.Transaction();
        await transaction.begin();

        for (const cpeId of cpeIds) {
            const request = new sql.Request(transaction);

            // Check if CPE_ID already exists in Orders
            const checkQuery = `
                SELECT COUNT(*) AS count 
                FROM Orders 
                WHERE CPE_ID = @CPE_ID
            `;
            request.input('CPE_ID', sql.Int, cpeId);  // Assuming CPE_ID is an integer
            const checkResult = await request.query(checkQuery);
            console.log('checkResult:', checkResult);

            if (checkResult.recordset[0].count > 0) {
                continue; // Skip if the CPE_ID already exists
            }

            // Verify the data before inserting
            const selectQuery = `
                SELECT DISTINCT OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate
                FROM container_place_enquiry
                WHERE CPE_ID = @CPE_ID;
            `;
            console.log('Executing selectQuery:', selectQuery);
            const selectResult = await request.query(selectQuery);
            console.log('Select Query Result:', selectResult);

            // Check if the result has valid data
            if (selectResult.recordset.length === 0) {
                console.log('No data found for CPE_ID:', cpeId);
                continue;
            }

            // Insert the data into the Orders table using CPE_ID
            const insertQuery = `
                INSERT INTO Orders (OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate)
                SELECT DISTINCT OrderID, CPE_ID, CartonQty, ProductID, UserID, UploadDate
                FROM container_place_enquiry
                WHERE CPE_ID = @CPE_ID;
            `;
            try {
                console.log('Executing insertQuery:', insertQuery);
                await request.query(insertQuery);
            } catch (err) {
                console.error('Error during INSERT query:', err);
                continue; // Continue with next iteration if insert fails
            }

            // Mark the enquiry data as converted
            const updateQuery = `
                UPDATE container_place_enquiry
                SET IsConverted = 1
                WHERE CPE_ID = @CPE_ID
            `;
            console.log('Executing updateQuery:', updateQuery);
            await request.query(updateQuery);
        }

        await transaction.commit();
        res.status(200).json({ message: 'Selected enquiries successfully converted to orders.' });
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error during transaction:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-orders', async (req, res) => {
    try {
        if (!pool) { // Check if connection is available
            throw new Error("Database connection is not initialized");
        }

        // Execute the SQL query with a join to the users table
        const result = await pool
            .request()
            .query(
                `SELECT DISTINCT
                o.OrderID,
                o.CartonQty,
                o.ProductID,
                o.UploadDate,
                u.EmailID,
                u.UserID,
                u.FirstName,
                u.LastName,
                u.CompanyName,
                ofiles.ShippingStatus
            FROM 
                Orders o
            INNER JOIN 
                users u ON o.UserID = u.UserID
            LEFT JOIN 
                OrderFiles ofiles ON o.OrderID = ofiles.OrderID
            ORDER BY 
                o.UploadDate DESC`
            );

        res.json({ msg: "Data Fetched Successfully", data: result.recordset });
    } catch (err) {
        console.error("Query Failed:", err);
        res.status(500).json({ msg: "Error Fetching Data", error: err.message });
    }
});


app.get('/Get-orders-data-user-side/:userId', async (req, res) => {
    const { userId } = req.params; // Extracting userId from route parameters

    try {
        // SQL query with parameterized input
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
                ofiles.ShippingStatus
            FROM 
                Orders o
            INNER JOIN 
                cornitos_master cm ON o.ProductID = cm.ID
            INNER JOIN 
                users u ON o.UserID = u.UserID
            LEFT JOIN 
                OrderFiles ofiles ON o.OrderID = ofiles.OrderID
            WHERE 
                o.UserID = @userId
            ORDER BY 
                o.UploadDate DESC
        `;

        // Creating a SQL request and binding the userId parameter
        const request = new sql.Request();
        request.input('userId', sql.Int, userId); // Binding 'userId' to the query

        const result = await request.query(query);

        // Send back the response
        res.status(200).json({ msg: 'Data Fetched Successfully', data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-orders-for-admin-dash', async (req, res) => {
    try {
        const query = `
            SELECT TOP 3
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
                u.EmailID,  -- Changed from 'u.username' to 'u.EmailID'
                u.UserID,
                u.FirstName,
                u.LastName,
                u.CompanyName
            FROM 
                Orders o
            INNER JOIN 
                cornitos_master cm ON o.ProductID = cm.ID
            INNER JOIN 
                users u ON o.UserID = u.UserID  -- No change here, 'users' table is being used
            ORDER BY 
                o.UploadDate DESC
        `;

        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-customer', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) AS TotalCount FROM users`;

        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-enquiry', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(DISTINCT OrderID) AS TotalDistinctCount FROM container_place_enquiry`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-order', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) AS TotalCount FROM Orders`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-products', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) AS TotalCount FROM cornitos_master`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-category', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(DISTINCT CATEGORY) AS TotalCategories FROM cornitos_master`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-subcategory', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(DISTINCT SUB_CATEGORY) AS TotalSubCategories FROM cornitos_master`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/Get-admin-brand', async (req, res) => {
    try {
        const query = `
            SELECT COUNT(DISTINCT BRAND) AS TotalBrands FROM cornitos_master`;


        const request = new sql.Request();
        const result = await request.query(query);

        res.status(200).json({ data: result.recordset });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/download-catalogue', (req, res) => {
    const filePath = path.join(__dirname, 'EXIMTRAC INDIAN MERCHANT GROCERY EXPORTER PRODUCT CATALOGUE 2024.pdf');
    res.download(filePath, 'EXIMTRAC INDIAN MERCHANT GROCERY EXPORTER PRODUCT CATALOGUE 2024.pdf', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});




// Set the server to listen on PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});