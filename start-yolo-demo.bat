@echo off
echo ========================================
echo    YOLO Demo Server - Portfolio JKhoa
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install express nodemailer body-parser cors
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting YOLO Demo Server...
echo Server will run at: http://localhost:3001
echo Demo page: yolo-demo.html
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
