@echo off
title Underwater Image Enhancer Starter
echo Starting Underwater Image Enhancer...

:: Ensure we are in the correct directory (where the script is located)
cd /d "%~dp0"

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && python app.py"

echo Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo Waiting 3 seconds for servers to start...
timeout /t 3 /nobreak > nul

echo Opening the website in your default browser...
start http://localhost:5173

echo Done! You can close this small window.
