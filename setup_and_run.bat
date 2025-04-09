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

REM Check Python version
for /f "tokens=2" %%I in ('python --version 2^>^&1') do set PYTHON_VERSION=%%I
echo Detected Python version: %PYTHON_VERSION%

REM Extract major and minor version
for /f "tokens=1,2 delims=." %%a in ("%PYTHON_VERSION%") do (
    set PYTHON_MAJOR=%%a
    set PYTHON_MINOR=%%b
)

REM Check if Python version is at least 3.8
if %PYTHON_MAJOR% LSS 3 (
    echo ERROR: Python version 3.8 or higher is required.
    echo Your version: %PYTHON_VERSION%
    echo Please install a newer version from https://www.python.org/downloads/
    pause
    exit /b 1
)
if %PYTHON_MAJOR% EQU 3 (
    if %PYTHON_MINOR% LSS 8 (
        echo ERROR: Python version 3.8 or higher is required.
        echo Your version: %PYTHON_VERSION%
        echo Please install a newer version from https://www.python.org/downloads/
        pause
        exit /b 1
    )
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

    REM Check Python version for compatibility
    if %PYTHON_MAJOR% EQU 3 (
        if %PYTHON_MINOR% GEQ 12 (
            echo Detected Python 3.12 or higher. Using compatible package versions...
            uv pip install flask>=2.3.3 numpy>=1.26.0 pandas>=2.1.0 pywebview>=4.3.0 werkzeug>=2.3.7 itsdangerous>=2.1.2 click>=8.1.7 Jinja2>=3.1.2 MarkupSafe>=2.1.3
        ) else (
            echo Using standard requirements file...
            uv pip install -r requirements.txt
        )
    ) else (
        echo Using standard requirements file...
        uv pip install -r requirements.txt
    )

    set INSTALL_RESULT=%ERRORLEVEL%
) else (
    echo Using pip to install dependencies...

    REM Check Python version for compatibility
    if %PYTHON_MAJOR% EQU 3 (
        if %PYTHON_MINOR% GEQ 12 (
            echo Detected Python 3.12 or higher. Using compatible package versions...
            pip install flask>=2.3.3 numpy>=1.26.0 pandas>=2.1.0 pywebview>=4.3.0 werkzeug>=2.3.7 itsdangerous>=2.1.2 click>=8.1.7 Jinja2>=3.1.2 MarkupSafe>=2.1.3
        ) else (
            echo Using standard requirements file...
            pip install -r requirements.txt
        )
    ) else (
        echo Using standard requirements file...
        pip install -r requirements.txt
    )

    set INSTALL_RESULT=%ERRORLEVEL%
)

if %INSTALL_RESULT% NEQ 0 (
    echo ERROR: Failed to install dependencies.
    echo.
    echo Trying alternative installation method...
    echo.

    REM Try installing dependencies one by one
    echo Installing core dependencies one by one...

    REM Check Python version for compatibility
    if %PYTHON_MAJOR% EQU 3 (
        if %PYTHON_MINOR% GEQ 12 (
            echo Using Python 3.12+ compatible versions...

            echo Installing Flask...
            pip install flask>=2.3.3

            echo Installing Werkzeug...
            pip install werkzeug>=2.3.7

            echo Installing NumPy...
            pip install numpy>=1.26.0

            echo Installing Pandas...
            pip install pandas>=2.1.0

            echo Installing PyWebView...
            pip install pywebview>=4.3.0
        ) else (
            echo Installing Flask...
            pip install flask

            echo Installing Werkzeug...
            pip install werkzeug

            echo Installing NumPy...
            pip install numpy

            echo Installing Pandas...
            pip install pandas

            echo Installing PyWebView...
            pip install pywebview
        )
    ) else (
        echo Installing Flask...
        pip install flask

        echo Installing Werkzeug...
        pip install werkzeug

        echo Installing NumPy...
        pip install numpy

        echo Installing Pandas...
        pip install pandas

        echo Installing PyWebView...
        pip install pywebview
    )

    echo Checking if dependencies were installed...
    python -c "import flask, numpy, pandas, webview" > nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Still unable to install all required dependencies.
        echo Please try manually installing the dependencies listed in requirements.txt
        echo.
        pause
        exit /b 1
    ) else (
        echo Dependencies installed successfully using alternative method.
    )
)

echo.
echo ===================================================
echo Setup complete! Starting the application...
echo ===================================================
echo.

REM Check if the HTML file exists
if not exist "Cataclysm Studios Inc PMOVES Economy Simulation.HTML" (
    echo WARNING: HTML file not found. The application may not work correctly.
    echo Looking for the HTML file...
    dir *.html *.HTML /b
    echo.
    echo If you see the HTML file above with a different name, please rename it to:
    echo "Cataclysm Studios Inc PMOVES Economy Simulation.HTML"
    echo.
    pause
)

REM Run the application
echo Starting the application...
python launcher.py

REM Deactivate the virtual environment when done
call .venv\Scripts\deactivate.bat

echo.
echo Application closed. You can run it again by executing this script.
pause
