# YOLO Demo Server - Portfolio JKhoa
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   YOLO Demo Server - Portfolio JKhoa" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    try {
        npm install express nodemailer body-parser cors
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting YOLO Demo Server..." -ForegroundColor Green
Write-Host "Server will run at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Demo page: yolo-demo.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
try {
    node server.js
} catch {
    Write-Host "Server stopped." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"
