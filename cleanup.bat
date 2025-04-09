@echo off
echo ===================================================
echo Cleaning up project directory
echo ===================================================
echo.

REM Ask for confirmation
echo This script will remove unnecessary files and directories.
echo Please make sure you have committed your changes to Git before proceeding.
echo.
set /p CONFIRM=Are you sure you want to continue? (Y/N): 

if /i "%CONFIRM%" NEQ "Y" (
    echo Cleanup cancelled.
    exit /b 0
)

echo.
echo Starting cleanup...
echo.

REM Remove duplicate virtual environment
if exist venv (
    echo Removing duplicate virtual environment (venv)...
    rmdir /s /q venv
)

REM Remove economic_simulation directory (duplicate files)
if exist economic_simulation (
    echo Removing economic_simulation directory (contains duplicate files)...
    rmdir /s /q economic_simulation
)

REM Remove build directory
if exist build (
    echo Removing build directory...
    rmdir /s /q build
)

REM Clean up dist directory
if exist dist (
    echo Cleaning up dist directory...
    if exist "dist\Economic_Simulation.exe" (
        del "dist\Economic_Simulation.exe"
    )
    if exist "dist\startup_log.txt" (
        del "dist\startup_log.txt"
    )
)

REM Remove debug and log files
echo Removing debug and log files...
if exist debug.log del debug.log
if exist debug_startup_log.txt del debug_startup_log.txt
if exist flask_startup_log.txt del flask_startup_log.txt
if exist error_log.txt del error_log.txt
if exist startup_log.txt del startup_log.txt
if exist import_error_log.txt del import_error_log.txt
if exist fatal_error_log.txt del fatal_error_log.txt

REM Consolidate requirements files
if exist requirements-updated.txt (
    echo Consolidating requirements files...
    copy requirements-updated.txt requirements.txt /y
    del requirements-updated.txt
)

REM Remove PyInstaller spec file
if exist Economic_Simulation.spec (
    echo Removing PyInstaller spec file...
    del Economic_Simulation.spec
)

REM Remove __pycache__ directories
echo Removing __pycache__ directories...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"

echo.
echo ===================================================
echo Cleanup complete!
echo ===================================================
echo.
pause
