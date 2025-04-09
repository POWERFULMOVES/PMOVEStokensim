@echo off
echo ===================================================
echo Cataclysm Studios Economic Simulation - Setup
echo ===================================================
echo.

REM Check if Python is installed
python --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8 or later from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo Python is installed. Setting up environment...
echo.

REM Create a virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create virtual environment.
        pause
        exit /b 1
    )
)

REM Activate the virtual environment and install dependencies
echo Activating virtual environment and installing dependencies...
call .venv\Scripts\activate.bat

REM Check if uv is installed, if not use pip
uv --version > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using uv to install dependencies...
    uv pip install -r requirements.txt
) else (
    echo Using pip to install dependencies...
    pip install -r requirements.txt
)

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Setup complete! Starting the application...
echo ===================================================
echo.

REM Run the application
python launcher.py

REM Deactivate the virtual environment when done
call .venv\Scripts\deactivate.bat

echo.
echo Application closed. You can run it again by executing this script.
pause
