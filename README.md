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
- `home/pmoves/PMOVES.AI/integrations-workspace/` - Git submodules for Firefly-iii and PMOVES-DoX integration

## Integration Workspace (Firefly-iii + PMOVES-DoX)

The repository now vendors the upstream Firefly-iii and PMOVES-DoX projects as Git submodules so you can operate the full cooperative economics stack from a single workspace.

### 1. Pull the integration submodules

```bash
git submodule update --init --recursive
```

This materialises the upstream code under `home/pmoves/PMOVES.AI/integrations-workspace/`:

- `PMOVES-Firefly-iii/`
- `PMOVES-DoX/`

Prefer a repository-local workspace? The same submodules are mirrored under `integrations/` so you
can keep the upstream copies intact while iterating locally:

- `integrations/PMOVES-Firefly-iii/`
- `integrations/PMOVES-DoX/`

### 2. Launch PMOVES-DoX (analysis platform)

```bash
cd home/pmoves/PMOVES.AI/integrations-workspace/PMOVES-DoX
Copy-Item .env.example .env   # Windows PowerShell
# cp .env.example .env        # macOS/Linux
docker compose -f docker-compose.cpu.yml up --build -d
```

The backend listens on `http://localhost:8001` and the frontend on `http://localhost:3000` when launched via Docker Compose. Refer to the submodule README for GPU profiles, Ollama integration, or local-dev instructions.

### 3. Launch Firefly-iii (financial data source)

Firefly-iii offers multiple deployment options. The quickest path is Docker:

```bash
cd home/pmoves/PMOVES.AI/integrations-workspace/PMOVES-Firefly-iii
Copy-Item .env.example .env   # Windows PowerShell
# cp .env.example .env        # macOS/Linux
docker compose up -d          # see upstream docs for variants
```

Once running, Firefly will expose its web UI (default `http://localhost:8080`) and REST API for simulation validation. Consult the Firefly-iii documentation in the submodule for additional setup tasks (database seeding, OAuth, etc.).

> **Heads-up:** the bundled `docker-compose.pmoves-net.yml` references the GHCR image `ghcr.io/POWERFULMOVES/pmoves-firefly-iii:main`. Docker expects repository names to be lowercase, so the pull fails with `invalid reference format`. Until the upstream image is republished, either (a) edit the compose file to use a lowercase image name that you host yourself, or (b) fall back to the official Firefly III compose file in the submodule (`docker-compose.yml`) which builds the containers locally.

### 4. Run PMOVEStokensim and integration checks

With Firefly-iii and PMOVES-DoX online:

1. Start PMOVEStokensim (see options above).
2. Optionally execute the integration workflow to export a scenario and push it into PMOVES-DoX:

	```bash
	python scripts/integrate_with_dox.py --scenario my_scenario
	```

	Use `--params-file path/to/overrides.json` or `--seed` for reproducible runs. The script expects the DoX API at `http://localhost:8001` (adjust if you run DoX manually) and writes exports under `exports/` by timestamp.

3. Explore DoX dashboards at `http://localhost:5173` (datavzrd) and answer questions via the DoX frontend. Pull Firefly data via its API to calibrate future simulations.

> Tip: if you only need to confirm DoX availability, run `python scripts/integrate_with_dox.py --health-only`.

## Next.js analytics dashboard

The advanced charts and `/analytics` experience live in the `pmoves-nextjs` workspace.

```bash
cd pmoves-nextjs
npm install
npm run dev
```

Visit `http://localhost:3000/analytics` to explore violin plots, Sankey diagrams, correlation heatmaps, and waterfall charts generated from the most recent simulation exports. Use `npm run build` / `npm run start` for a production build.

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
