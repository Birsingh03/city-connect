@echo off
echo ========================================
echo   CiviConnect - Run Project
echo ========================================
echo.

echo Starting Backend server...
start "CiviConnect Backend" cmd /k "cd /d %~dp0server && npm run start"
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "CiviConnect Frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo   Project is running!
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:8080
echo ========================================
echo.
pause
