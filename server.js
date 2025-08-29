const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const dbConfig = require('./dbConfig');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
// Increase the limit to handle base64 image strings
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection pool
let pool;

async function connectToDb() {
    try {
        if (pool && pool.connected) {
            return pool;
        }
        pool = await new sql.ConnectionPool(dbConfig).connect();
        console.log('Connected to SQL Server');

        // Ensure the Detections table exists
        const tableCheckRequest = pool.request();
        await tableCheckRequest.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Detections' and xtype='U')
            CREATE TABLE Detections (
                ID INT IDENTITY(1,1) PRIMARY KEY,
                Timestamp DATETIME DEFAULT GETDATE(),
                ImageData NVARCHAR(MAX),
                Notes NVARCHAR(MAX) NULL 
            )
        `);
        console.log('Detections table is ready.');

        return pool;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
        // Terminate the process if the database connection fails
        process.exit(1);
    }
}

// API endpoint to get all detections
app.get('/api/detections', async(req, res) => {
    try {
        const db = await connectToDb();
        const result = await db.request().query('SELECT ID, Timestamp, ImageData, Notes FROM Detections ORDER BY Timestamp DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
    }
});

// API endpoint to save a new detection
app.post('/api/detections', async(req, res) => {
    try {
        const { imageData, notes } = req.body;
        if (!imageData) {
            return res.status(400).send('imageData is required');
        }

        const db = await connectToDb();
        const request = db.request();
        request.input('ImageData', sql.NVarChar(sql.MAX), imageData);
        request.input('Notes', sql.NVarChar(sql.MAX), notes || null); // Handle optional notes

        await request.query('INSERT INTO Detections (ImageData, Notes) VALUES (@ImageData, @Notes)');

        res.status(201).send('Detection saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data to database');
    }
});

// API endpoint to clear all detections
app.delete('/api/detections', async(req, res) => {
    try {
        const db = await connectToDb();
        await db.request().query('DELETE FROM Detections');
        res.status(200).send('All detections cleared successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error clearing data from database');
    }
});


// Start the server
app.listen(port, async() => {
    console.log(`Server is running on http://localhost:${port}`);
    // Establish the database connection when the server starts
    await connectToDb();
});