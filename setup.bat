@echo off
echo ========================================
echo   Wadi Hawar Democratic Front Website
echo   Complete Setup Script
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend\wadi-hawar-cms
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Backend setup complete!
echo.
echo [3/3] Setup Instructions:
echo.
echo 1. Start the backend server:
echo    cd backend
echo    node start-server.js
echo.
echo 2. Open admin panel:
echo    http://localhost:1337/admin
echo    Create your admin account
echo.
echo 3. Open frontend:
echo    Open frontend/index.html in your browser
echo    Or use Live Server extension
echo.
echo ========================================
echo   Setup Complete! 
echo   Your Arabic CMS is ready to use!
echo ========================================
echo.
pause
