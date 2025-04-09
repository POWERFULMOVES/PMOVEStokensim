import os
import shutil

def copy_file_with_content(source_content, dest_path):
    """Copy content to destination file, creating directories if needed"""
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(source_content)
    print(f"Created file with content: {dest_path}")

def create_project_structure():
    # Define the base directory
    base_dir = "economic_simulation"
    
    # Define the directory structure
    directories = [
        "",  # base directory
        "templates",
        "static",
        "static/css",
        "static/js",
        "static/images",
    ]
    
    # Create directories
    for dir_path in directories:
        full_path = os.path.join(base_dir, dir_path)
        os.makedirs(full_path, exist_ok=True)
        print(f"Created directory: {full_path}")

    # Define file contents
    file_contents = {
        "launcher.py": '''import os
import sys
import webbrowser
import threading
from flask import Flask
from flask_backend import app
import webview
import logging

def run_flask():
    """Run Flask in a separate thread"""
    try:
        app.run(port=5000, threaded=True)
    except Exception as e:
        logging.error(f"Flask error: {e}")

def main():
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        filename='simulation_app.log'
    )

    try:
        # Start Flask in a separate thread
        flask_thread = threading.Thread(target=run_flask, daemon=True)
        flask_thread.start()

        # Create a native window using pywebview
        webview.create_window(
            'Cataclysm Studios Economic Simulation',
            'http://127.0.0.1:5000',
            width=1200,
            height=800,
            resizable=True,
            min_size=(800, 600)
        )
        webview.start()

    except Exception as e:
        logging.error(f"Application error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()''',

        "build_app.py": '''import PyInstaller.__main__
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
    ]

    # Run PyInstaller
    PyInstaller.__main__.run(args)

    print("Build completed! Executable can be found in the dist folder.")

if __name__ == '__main__':
    build_executable()''',

        "requirements.txt": '''flask==2.0.1
numpy==1.21.0
pandas==1.3.0
pywebview==3.7.2
pyinstaller==5.13.0''',

        "create_installer.iss": '''[Setup]
AppName=Economic Simulation
AppVersion=1.0
DefaultDirName={pf}\CataclysmStudios\EconomicSimulation
DefaultGroupName=Cataclysm Studios
OutputDir=installer
OutputBaseFilename=EconomicSimulation_Setup

[Files]
Source: "dist\Economic_Simulation.exe"; DestDir: "{app}"
Source: "README.txt"; DestDir: "{app}"; Flags: isreadme
Source: "LICENSE.txt"; DestDir: "{app}"

[Icons]
Name: "{group}\Economic Simulation"; Filename: "{app}\Economic_Simulation.exe"
Name: "{commondesktop}\Economic Simulation"; Filename: "{app}\Economic_Simulation.exe"''',

        "templates/index.html": '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cataclysm Studios Inc PMOVES Economy Simulation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="{{ url_for('static', filename='css/styles.css') }}" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Your existing HTML content -->
    </div>
    <script src="{{ url_for('static', filename='js/main.js') }}"></script>
</body>
</html>''',

        "static/css/styles.css": '''/* Add your CSS styles here */
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
}''',

        "static/js/main.js": '''// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
});'''
    }

    # Copy files with content
    for file_path, content in file_contents.items():
        full_path = os.path.join(base_dir, file_path)
        copy_file_with_content(content, full_path)

    # Copy your existing flask_backend.py content
    flask_backend_content = '''# Your existing flask_backend.py content goes here
import os
import sys
from flask import Flask, send_from_directory

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = Flask(__name__,
            static_folder=resource_path('static'),
            template_folder=resource_path('templates'))

@app.route('/')
def serve_app():
    return send_from_directory(app.template_folder, 'index.html')

# Add your existing routes and functionality here
'''
    copy_file_with_content(flask_backend_content, os.path.join(base_dir, "flask_backend.py"))

    # Create a placeholder icon file
    icon_path = os.path.join(base_dir, "app_icon.ico")
    if not os.path.exists(icon_path):
        # Create an empty icon file
        with open(icon_path, 'wb') as f:
            pass
        print(f"Created placeholder icon: {icon_path}")

    print("\nProject structure created successfully!")
    print("\nDirectory structure:")
    for root, dirs, files in os.walk(base_dir):
        level = root.replace(base_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")

    print("\nNext steps:")
    print("1. Copy your existing flask_backend.py content into the new flask_backend.py file")
    print("2. Replace the placeholder app_icon.ico with your actual icon")
    print("3. Update the HTML template with your actual content")
    print("4. Add your CSS and JavaScript code to the respective files")
    print("5. Run 'pip install -r requirements.txt' to install dependencies")
    print("6. Test the application by running launcher.py")
    print("7. Build the executable using build_app.py")

if __name__ == "__main__":
    create_project_structure()
