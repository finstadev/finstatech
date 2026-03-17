@echo off
echo.
echo  Starting FINSTATECH backend...
echo.
start "FINSTATECH Server" cmd /k "cd /d "%~dp0" && node backend/server.js"
timeout /t 2 /nobreak >nul
echo  Opening your site...
start http://localhost:3000/index.html
echo.
echo  Server is running at http://localhost:3000
echo  Admin panel: http://localhost:3000/backend/admin.html
echo.
pause
