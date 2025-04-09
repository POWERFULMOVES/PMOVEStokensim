"""
Build script to create a complete standalone executable with all dependencies.
This script creates a directory-based distribution instead of a single file,
which is more reliable for complex applications.
"""

import os
import shutil
import subprocess
import sys

def main():
    app_name = "Economic_Simulation"
    
    # Clean up previous build artifacts
    for dir_name in ['build', 'dist']:
        if os.path.exists(dir_name):
            try:
                shutil.rmtree(dir_name)
                print(f"Removed {dir_name} directory")
            except PermissionError:
                print(f"Warning: Could not remove {dir_name} directory. It may be in use.")
                print("Please close any running instances of the application and try again.")
    
    # PyInstaller arguments for a directory-based distribution
    args = [
        'launcher.py',  # Your main script
        '--name=%s' % app_name,
        '--onedir',  # Create a directory with all dependencies
        '--windowed',  # Don't show console window
        '--icon=app_icon.ico',  # Add your icon file
        '--add-data=templates;templates',  # Include template folder
        '--add-data=static;static',  # Include static folder
        '--add-data=Cataclysm Studios Inc PMOVES Economy Simulation.HTML;.',  # Include the HTML file
        # Add all required hidden imports
        '--hidden-import=flask',
        '--hidden-import=werkzeug',
        '--hidden-import=jinja2',
        '--hidden-import=itsdangerous',
        '--hidden-import=click',
        '--hidden-import=numpy',
        '--hidden-import=pandas',
        '--hidden-import=webview',
        '--hidden-import=pkg_resources._vendor.jaraco.functools',
        '--hidden-import=pkg_resources._vendor.jaraco.context',
        '--hidden-import=pkg_resources._vendor.jaraco.text',
        '--hidden-import=importlib_resources.trees',
        # Add Flask-specific imports
        '--hidden-import=flask.templating',
        '--hidden-import=flask.app',
        '--hidden-import=flask.json',
        '--hidden-import=flask.config',
        '--hidden-import=flask.ctx',
        '--hidden-import=flask.helpers',
        '--hidden-import=flask.sessions',
        '--hidden-import=flask.blueprints',
        # Add additional imports for webview
        '--hidden-import=webview.platforms.winforms',
        '--collect-all=webview',
        '--collect-all=werkzeug',
        '--collect-all=flask',
        '--collect-all=jinja2',
    ]
    
    # Run PyInstaller
    subprocess.call([sys.executable, '-m', 'PyInstaller'] + args)
    
    # Create a batch file to run the application
    with open(os.path.join('dist', app_name, 'run_app.bat'), 'w') as f:
        f.write(f'@echo off\nstart {app_name}.exe\n')
    
    print("Build completed! Executable can be found in the dist folder.")
    print("To distribute the application, share the entire 'dist/Economic_Simulation' folder.")
    print("Users can run the application by double-clicking 'run_app.bat' or the executable.")

if __name__ == '__main__':
    main()
