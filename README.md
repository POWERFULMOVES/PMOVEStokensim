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

### Option 4: Build Executable

To build a standalone executable:

1. Install the required dependencies:

```
pip install -r requirements.txt
```

2. Run the build script:

```
python build_app.py
```

3. The executable will be created in the `dist` directory

4. For a more reliable distribution, use:

```
python build_complete.py
```

This creates a directory-based distribution in `dist/Economic_Simulation/` that can be shared with users.

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
