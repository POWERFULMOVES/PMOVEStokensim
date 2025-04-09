# Cataclysm Studios Economic Simulation

## Distribution Instructions

This document provides instructions for distributing the Economic Simulation application to other users.

### Option 1: Directory Distribution (Recommended)

1. Build the application using the `build_complete.py` script:
   ```
   python build_complete.py
   ```

2. This will create a directory in `dist/Economic_Simulation/` with all the necessary files.

3. Share the entire `dist/Economic_Simulation/` folder with users.

4. Users can run the application by:
   - Double-clicking the `run_app.bat` file, or
   - Running the `Economic_Simulation.exe` directly

### Option 2: Installer Distribution

If you want to create an installer:

1. First, build the application using the `build_complete.py` script.

2. Install NSIS (Nullsoft Scriptable Install System) from https://nsis.sourceforge.io/Download

3. Right-click on the `create_installer.nsi` file and select "Compile NSIS Script"

4. This will create an `Economic_Simulation_Setup.exe` file that you can distribute to users.

5. Users can install the application by running the setup file and following the installation prompts.

### Troubleshooting

If users encounter issues running the application:

1. **Missing DLL errors**: They may need to install the Microsoft Visual C++ Redistributable:
   - Download from: https://aka.ms/vs/17/release/vc_redist.x64.exe

2. **Application doesn't start**: Check if there are any log files created in the application directory:
   - `startup_log.txt`
   - `error_log.txt`
   - `flask_startup_log.txt`

3. **Blank window**: The Flask server might not be starting correctly. Try running the application from a command prompt to see any error messages.

## System Requirements

- Windows 10 or later
- 4GB RAM minimum
- 100MB free disk space
- Microsoft Visual C++ Redistributable 2019 or later
