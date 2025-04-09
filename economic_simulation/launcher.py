import os
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
    main()