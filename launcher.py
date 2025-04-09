# Write a startup log immediately
with open('startup_log.txt', 'w') as f:
    f.write('Application starting...\n')

import os
import sys
import webbrowser
import threading
import time
import socket
import traceback
from flask import Flask
from flask_backend import app
import webview
import logging

def run_flask():
    """Run Flask in a separate thread"""
    try:
        app.run(host='127.0.0.1', port=5000, threaded=True)
    except Exception as e:
        logging.error(f"Flask error: {e}")

def is_port_in_use(port):
    """Check if a port is in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

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

        # Wait for Flask to start (max 10 seconds)
        max_wait = 10
        wait_time = 0
        while not is_port_in_use(5000) and wait_time < max_wait:
            time.sleep(0.5)
            wait_time += 0.5
            logging.info(f"Waiting for Flask server to start... {wait_time}s")

        if not is_port_in_use(5000):
            logging.error("Flask server failed to start within the timeout period.")
            print("Error: Flask server failed to start. Check the log file for details.")
            sys.exit(1)

        # Give Flask a moment to initialize routes
        time.sleep(1)
        logging.info("Flask server is running. Starting webview...")

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
        error_msg = f"Application error: {e}\n{traceback.format_exc()}"
        logging.error(error_msg)

        # Also write to a separate error log file that's easier to find
        with open('error_log.txt', 'w') as f:
            f.write(error_msg)

        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    try:
        with open('startup_log.txt', 'a') as f:
            f.write('Calling main function...\n')
        main()
    except Exception as e:
        error_msg = f"Fatal error before main: {e}\n{traceback.format_exc()}"
        with open('fatal_error_log.txt', 'w') as f:
            f.write(error_msg)
        sys.exit(1)