# Cataclysm Studios Inc PMOVES Economy Simulation

This application simulates economic systems with a focus on token-based economies.

## Features

- Run economic simulations with customizable parameters
- Compare traditional economic systems with token-based alternatives
- Visualize results through interactive charts
- Analyze key economic metrics like wealth distribution and inequality

## Getting Started

1. Launch the application using one of the methods described below
2. Adjust simulation parameters as needed
3. Click "Run Simulation" to start
4. View and analyze the results

## Running the Application

### Option 1: Run with Docker (Recommended)

#### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Steps

1. Clone or download this repository
2. Open a terminal/command prompt in the project directory
3. Run the application using the provided script:

```
run_docker.bat
```

Or manually with:

```
docker-compose up --build
```

4. Open your browser and navigate to: http://localhost:5000

#### Development Mode

To run the application in development mode with hot-reloading:

```
run_docker_dev.bat
```

Or manually with:

```
docker-compose -f docker-compose.dev.yml up --build
```

### Option 2: Run Locally

#### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)

#### Steps

1. Clone or download this repository
2. Open a terminal/command prompt in the project directory
3. Install the required dependencies:

```
pip install -r requirements.txt
```

4. Run the application:

```
python launcher.py
```

5. The application should open in a desktop window

### Option 3: Easy Setup with Virtual Environment (Recommended for Windows)

This option automatically creates a virtual environment and installs all dependencies:

1. Make sure Python is installed and in your PATH
2. Double-click the `setup_and_run.bat` file
3. The application will set up everything and start automatically

This is the most reliable method for running the application on Windows systems.

### Option 4: Setup with uv (Faster Installation)

[uv](https://github.com/astral-sh/uv) is a much faster alternative to pip for installing Python packages.

1. Make sure Python is installed and in your PATH
2. Double-click the `setup_with_uv.bat` file
3. The script will install uv if needed, create a virtual environment, and install dependencies

This method is recommended if you want faster dependency installation.

## Distribution

To distribute this application to other users:

### Option 1: Share the Repository (Recommended)

1. Share the entire repository with users
2. Users can run the application using one of the methods described above
3. The `setup_and_run.bat` or `setup_with_uv.bat` scripts make it easy for Windows users

### Option 2: Create a Distribution Package

1. Run the `create_distribution.bat` script
2. This will create a clean distribution package in the `dist/Economic_Simulation_Distribution/` folder
3. Share this folder with users
4. Users can run the application by executing the `setup_and_run.bat` script

### System Requirements

- Windows 10 or later
- Python 3.8 or later (including Python 3.12)
- 4GB RAM minimum
- 100MB free disk space

> **Note for Python 3.12 users**: The setup scripts automatically detect Python 3.12 and use compatible package versions.

## Project Structure

- `flask_backend.py` - The Flask backend that handles the simulation logic
- `launcher.py` - Desktop application launcher using pywebview
- `static/` - Static assets (CSS, JavaScript, images)
- `templates/` - HTML templates
- `Dockerfile` and `docker-compose.yml` - Docker configuration files
- `setup_and_run.bat` - Script to set up a virtual environment and run the application
- `setup_with_uv.bat` - Script to set up a virtual environment using uv and run the application
- `create_distribution.bat` - Script to create a clean distribution package

## Troubleshooting

If you encounter issues running the application:

1. **Python not found**: Make sure Python is installed and in your PATH
2. **Missing dependencies**: Try running `pip install -r requirements.txt` manually
3. **Application doesn't start**: Check if any log files were created in the application directory
4. **Blank window**: The Flask server might not be starting correctly. Try running the application from a command prompt to see any error messages.

## License

See the [LICENSE.txt](LICENSE.txt) file for details.

## Contact

For support or questions, please contact Cataclysm Studios.

© 2025 Cataclysm Studios Inc. All rights reserved.
