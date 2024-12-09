@echo off
:: Define paths
set FRONT_PATH=C:\Users\amine\Desktop\School\3eme\Projet d'integration\projet_integration_front
set BACK_PATH=C:\Users\amine\Desktop\School\3eme\Projet d'integration\projet_integration_back

:: Start frontend in background
echo Starting frontend...
cd "%FRONT_PATH%"
start /b cmd /c "ng serve"

:: Wait for the frontend server to be up by checking localhost:4200
echo Waiting for frontend to be ready...
:WAIT_FRONTEND
curl -s http://192.168.1.200:4200 >nul
if %errorlevel% equ 0 (
    echo Frontend is ready.
    goto FRONTEND_READY
)

:: If frontend is not yet ready, wait 1 second and retry
timeout /t 1 >nul
goto WAIT_FRONTEND

:FRONTEND_READY
:: Start backend in background
echo Starting backend...
cd "%BACK_PATH%"
start /b cmd /c "node server.js"

:: Wait for backend to start (assuming it will be up within 10 seconds)
timeout /t 10 >nul

:: After both servers are up, open the browser
echo Both servers are running. Opening browser...
start http://192.168.1.200:4200

echo All processes started successfully. Press any key to exit.
pause
