import PyInstaller.__main__
import os
import shutil

def build_executable():
    # Define application name
    app_name = "Economic_Simulation"

    # Clean previous builds
    for dir_name in ['build', 'dist']:
        if os.path.exists(dir_name):
            try:
                shutil.rmtree(dir_name)
            except PermissionError:
                print(f"Warning: Could not remove {dir_name} directory. It may be in use.")
                print("Please close any running instances of the application and try again.")
                # Continue anyway, PyInstaller will handle existing files

    # PyInstaller arguments
    args = [
        'launcher.py',  # Your main script
        '--name=%s' % app_name,
        '--onefile',  # Create a single executable
        '--windowed',  # Don't show console window
        '--icon=app_icon.ico',  # Add your icon file
        '--add-data=templates;templates',  # Include template folder
        '--add-data=static;static',  # Include static folder
        '--add-data=Cataclysm Studios Inc PMOVES Economy Simulation.HTML;.',  # Include the HTML file
        '--hidden-import=flask',
        '--hidden-import=numpy',
        '--hidden-import=pandas',
        '--hidden-import=webview',
        # Add any other required hidden imports
    ]

    # Run PyInstaller
    PyInstaller.__main__.run(args)

    print("Build completed! Executable can be found in the dist folder.")

if __name__ == '__main__':
    build_executable()