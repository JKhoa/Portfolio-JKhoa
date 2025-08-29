const config = {
    user: 'sa', // Replace with your SQL Server username
    password: '0912224438a', // Replace with your SQL Server password
    server: 'DESKTOP-E826Q7Q', // Replace with your SQL Server address (e.g., 'localhost' or an IP address)
    database: 'DrowsinessDetectionDB', // Replace with your database name
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

module.exports = config;