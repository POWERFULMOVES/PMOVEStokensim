# Cataclysm Studios Inc PMOVES Economy Simulation

This application simulates economic systems with a focus on token-based economies.

## Features

- Run economic simulations with customizable parameters
- Compare traditional economic systems with token-based alternatives
- Visualize results through interactive charts
- Analyze key economic metrics like wealth distribution and inequality

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

## Project Structure

- `flask_backend.py` - The Flask backend that handles the simulation logic
- `launcher.py` - Desktop application launcher using pywebview
- `static/` - Static assets (CSS, JavaScript, images)
- `templates/` - HTML templates
- `Dockerfile` and `docker-compose.yml` - Docker configuration files
- `build_app.py` - Script to build a standalone executable
- `create_installer.iss` - Inno Setup script for creating a Windows installer

## License

See the [LICENSE.txt](LICENSE.txt) file for details.
