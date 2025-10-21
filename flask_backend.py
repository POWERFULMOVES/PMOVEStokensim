"""Flask application exposing the PMOVES simulation backend."""

import logging
import os
import random
from typing import Any, Dict

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from pmoves_backend import DEFAULT_PARAMS, run_simulation

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)


@app.route("/run_simulation", methods=["POST"])
def handle_simulation():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    params: Dict[str, Any] = request.get_json()
    app.logger.info("Received request with params: %s", params)
    try:
        simulation_results = run_simulation(params)
        return jsonify(simulation_results)
    except ValueError as exc:
        app.logger.error("Simulation Value Error: %s", exc, exc_info=True)
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:  # pragma: no cover - defensive logging
        app.logger.error("Unexpected error during simulation: %s", exc, exc_info=True)
        return jsonify({"error": "An unexpected error occurred during simulation."}), 500


@app.route("/get_current_metrics")
def get_current_metrics():
    try:
        return jsonify(
            {
                "health_score": 0.75 + random.random() * 0.1 - 0.05,
                "market_efficiency": 0.68 + random.random() * 0.1 - 0.05,
                "resilience_score": 0.82 + random.random() * 0.1 - 0.05,
                "detailed_metrics": {
                    "velocity": 0.45 + random.random() * 0.1 - 0.05,
                    "inequality": 0.32 + random.random() * 0.1 - 0.05,
                    "growth_rate": 0.03 + random.random() * 0.02 - 0.01,
                    "innovation_score": 0.65 + random.random() * 0.1 - 0.05,
                },
                "trends": {
                    "health_trend": (random.random() - 0.5) * 0.05,
                    "efficiency_trend": (random.random() - 0.5) * 0.05,
                    "resilience_trend": (random.random() - 0.5) * 0.05,
                },
                "warnings": ["Moderate inequality detected"]
                if random.random() > 0.5
                else [],
                "recommendations": ["Consider increasing internal spending"]
                if random.random() > 0.3
                else ["Monitor GroToken value"],
            }
        )
    except Exception as exc:  # pragma: no cover - defensive logging
        return jsonify({"error": str(exc)}), 500


@app.route("/run_scenario", methods=["POST"])
def run_scenario():
    scenario_data = request.json or {}
    app.logger.info("Running scenario: %s", scenario_data.get("name", "Custom"))
    try:
        results = run_simulation(DEFAULT_PARAMS)
        scenario_results = {
            "scenario_name": scenario_data.get("name", "Custom Scenario"),
            "outcome": results.get("summary", {}).get(
                "conclusion", "Simulation completed."
            ),
            "metrics": {
                "final_wealth": results.get("history", [{}])[-1].get(
                    "AvgWealth_B", "N/A"
                ),
                "gini": results.get("history", [{}])[-1].get("Gini_B", "N/A"),
                "poverty_rate": results.get("history", [{}])[-1].get(
                    "PovertyRate_B", "N/A"
                ),
            },
        }
        return jsonify(
            {
                "scenario_results": scenario_results,
                "comparative_analysis": "Scenario performed similarly to baseline in this mock run.",
                "recommendations": [
                    "Adjust savings parameters for different outcomes."
                ],
            }
        )
    except Exception as exc:  # pragma: no cover - defensive logging
        app.logger.error("Error running scenario: %s", exc, exc_info=True)
        return jsonify({"error": str(exc)}), 500


@app.route("/test_shock", methods=["POST"])
def test_shock():
    shock_params = request.json or {}
    app.logger.info("Testing shock: %s", shock_params)
    try:
        results = {
            "shock_type": shock_params.get("type", "income_reduction"),
            "magnitude": shock_params.get("magnitude", 0.2),
            "duration": shock_params.get("duration", 4),
            "impact": {
                "wealth_reduction": 0.15 + random.random() * 0.1,
                "poverty_increase": 0.08 + random.random() * 0.05,
                "recovery_time": random.randint(8, 20),
            },
        }
        return jsonify(
            {
                "shock_results": results,
                "recovery_metrics": {
                    "recovery_rate": 0.05 + random.random() * 0.03,
                    "resilience_score": 0.72 + random.random() * 0.1 - 0.05,
                },
                "recommendations": [
                    "Build emergency reserves",
                    "Diversify income sources",
                ],
            }
        )
    except Exception as exc:  # pragma: no cover - defensive logging
        app.logger.error("Error testing shock: %s", exc, exc_info=True)
        return jsonify({"error": str(exc)}), 500


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    host_ip = "127.0.0.1"
    app.run(debug=debug_mode, host=host_ip, port=5000)
