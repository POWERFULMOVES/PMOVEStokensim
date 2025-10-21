"""Unit tests for the simulation loop independent of Flask routing."""

from pathlib import Path
import random
import sys

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pmoves_backend.simulator import run_simulation


def test_run_simulation_returns_expected_structure():
    random.seed(42)
    np.random.seed(42)

    params = {
        "NUM_MEMBERS": 5,
        "SIMULATION_WEEKS": 4,
        "description": "unit-test",
    }

    results = run_simulation(params)

    assert "history" in results
    assert len(results["history"]) == params["SIMULATION_WEEKS"]
    assert all("Week" in entry for entry in results["history"])

    assert "final_members" in results
    assert len(results["final_members"]) == params["NUM_MEMBERS"]

    assert "summary" in results
    summary = results["summary"]
    assert "title" in summary
    assert "conclusion" in summary

    assert "key_events" in results
    assert isinstance(results["key_events"], list)
