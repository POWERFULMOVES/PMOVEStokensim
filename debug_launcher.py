"""
Debug launcher for the Economic Simulation application.
This is a console-based version that will help identify issues.
"""

print("Starting debug launcher...")

try:
    # Write a startup log immediately
    with open('debug_startup_log.txt', 'w') as f:
        f.write('Debug application starting...\n')

    import os
    import sys
    import threading
    import time
    import socket
    import traceback
    from flask import Flask
    from flask_backend import app
    import webview
    import logging

    # Set up logging to console
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("debug.log"),
            logging.StreamHandler()
        ]
    )

    def is_port_in_use(port):
        """Check if a port is in use"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('127.0.0.1', port)) == 0

    def run_flask():
        """Run Flask in a separate thread"""
        try:
            print("Starting Flask server...")
            app.run(host='127.0.0.1', port=5000, threaded=True)
        except Exception as e:
            print(f"Flask error: {e}")
            logging.error(f"Flask error: {e}\n{traceback.format_exc()}")

    # Start Flask in a separate thread
    print("Creating Flask thread...")
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    
    # Wait for Flask to start (max 10 seconds)
    print("Waiting for Flask server to start...")
    max_wait = 10
    wait_time = 0
    while not is_port_in_use(5000) and wait_time < max_wait:
        time.sleep(0.5)
        wait_time += 0.5
        print(f"Waiting for Flask server... {wait_time}s")
    
    if not is_port_in_use(5000):
        print("ERROR: Flask server failed to start within the timeout period.")
        sys.exit(1)
    
    # Give Flask a moment to initialize routes
    time.sleep(1)
    print("Flask server is running. Starting webview...")

    # Create a native window using pywebview
    print("Creating webview window...")
    window = webview.create_window(
        'Cataclysm Studios Economic Simulation',
        'http://127.0.0.1:5000',
        width=1200,
        height=800,
        resizable=True,
        min_size=(800, 600)
    )
    
    print("Starting webview...")
    webview.start(debug=True)
    
    print("Webview closed.")

except Exception as e:
    error_msg = f"Application error: {e}\n{traceback.format_exc()}"
    print(error_msg)
    
    with open('debug_error_log.txt', 'w') as f:
        f.write(error_msg)
    
    sys.exit(1)
