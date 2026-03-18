@echo off
echo ========================================
echo   CiviConnect Setup & Run Script
echo ========================================
echo.

echo [1/4] Installing root dependencies...
cd /d "%~dp0"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Installing server dependencies...
cd /d "%~dp0server"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo.

echo [3/4] Starting Backend server...
start "CiviConnect Backend" cmd /k "cd /d %~dp0server && npm run start"
timeout /t 5 /nobreak >nul
echo.

echo [4/4] Starting Frontend...
start "CiviConnect Frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo   Project is starting!
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:8080
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
