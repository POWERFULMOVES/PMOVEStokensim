@echo off
echo ===================================================
echo Creating Distribution Package
echo ===================================================
echo.

REM Create a dist directory if it doesn't exist
if not exist "dist" mkdir dist

REM Define the distribution name
set DIST_NAME=Economic_Simulation_Distribution

REM Create a clean directory for the distribution
if exist "dist\%DIST_NAME%" rmdir /s /q "dist\%DIST_NAME%"
mkdir "dist\%DIST_NAME%"

echo Copying required files...

REM Copy the main Python files
copy launcher.py "dist\%DIST_NAME%\"
copy flask_backend.py "dist\%DIST_NAME%\"
copy requirements.txt "dist\%DIST_NAME%\"
copy setup_and_run.bat "dist\%DIST_NAME%\"
copy README.md "dist\%DIST_NAME%\"
copy "Cataclysm Studios Inc PMOVES Economy Simulation.HTML" "dist\%DIST_NAME%\"
copy app_icon.ico "dist\%DIST_NAME%\"

REM Copy the templates and static directories
xcopy /E /I templates "dist\%DIST_NAME%\templates"
xcopy /E /I static "dist\%DIST_NAME%\static"

echo.
echo Creating ZIP file...

REM Check if PowerShell is available for creating ZIP
powershell -Command "Get-Command Compress-Archive" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    REM Use PowerShell to create a ZIP file
    powershell -Command "Compress-Archive -Path 'dist\%DIST_NAME%\*' -DestinationPath 'dist\%DIST_NAME%.zip' -Force"
    echo ZIP file created: dist\%DIST_NAME%.zip
) else (
    echo PowerShell Compress-Archive command not available.
    echo Please manually ZIP the contents of the dist\%DIST_NAME% directory.
)

echo.
echo ===================================================
echo Distribution package created successfully!
echo ===================================================
echo.
echo You can distribute the entire dist\%DIST_NAME% folder
echo or the dist\%DIST_NAME%.zip file (if created).
echo.
echo Users will need to run setup_and_run.bat to start the application.
echo.
pause
