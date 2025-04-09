import PyInstaller.__main__
import os
import shutil

def build_executable():
    # Define application name
    app_name = "Economic_Simulation"
    
    # Clean previous builds
    for dir_name in ['build', 'dist']:
        if os.path.exists(dir_name):
            shutil.rmtree(dir_name)

    # PyInstaller arguments
    args = [
        'launcher.py',  # Your main script
        '--name=%s' % app_name,
        '--onefile',  # Create a single executable
        '--windowed',  # Don't show console window
        '--icon=app_icon.ico',  # Add your icon file
        '--add-data=templates;templates',  # Include template folder
        '--add-data=static;static',  # Include static folder
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