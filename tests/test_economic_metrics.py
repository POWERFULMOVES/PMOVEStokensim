import sys
import types
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import pandas as pd
import pytest

flask_stub = types.ModuleType("flask")


class _FlaskStub:
    def __init__(self, *args, **kwargs):
        pass

    def route(self, *args, **kwargs):
        def decorator(func):
            return func
        return decorator

    def run(self, *args, **kwargs):
        return None


flask_stub.Flask = _FlaskStub
flask_stub.request = None
flask_stub.jsonify = lambda *args, **kwargs: None
flask_stub.render_template = lambda *args, **kwargs: None
sys.modules.setdefault("flask", flask_stub)

flask_cors_stub = types.ModuleType("flask_cors")
flask_cors_stub.CORS = lambda *args, **kwargs: None
sys.modules.setdefault("flask_cors", flask_cors_stub)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from flask_backend import EconomicMetrics


def _make_member(member_id, wealth, propensity, budget, *,
                 grotoken=0.0, internal_spend=0.0, external_spend=0.0,
                 total_spend=None, effective_internal=None):
    if total_spend is None:
        total_spend = internal_spend + external_spend
    if effective_internal is None:
        effective_internal = internal_spend
    return SimpleNamespace(
        id=member_id,
        wealth_scenario_A=wealth,
        wealth_scenario_B=wealth,
        initial_wealth=wealth,
        food_usd_balance=wealth,
        grotoken_balance=grotoken,
        weekly_food_budget=budget,
        propensity_to_spend_internal=propensity,
        weekly_income=0.0,
        last_internal_spend=internal_spend,
        last_external_spend=external_spend,
        last_total_spend=total_spend,
        last_effective_internal_cost=effective_internal,
        last_grotoken_reward=0.0,
        internal_transaction_count=0,
    )


def test_wealth_mobility_metrics():
    members = [
        _make_member("M1", 100.0, 0.6, 50.0),
        _make_member("M2", 200.0, 0.6, 50.0),
        _make_member("M3", 300.0, 0.6, 50.0),
        _make_member("M4", 400.0, 0.6, 50.0),
    ]
    metrics = EconomicMetrics(members, {"GROTOKEN_USD_VALUE": 2.0})

    updated_wealth = [200.0, 150.0, 350.0, 250.0]
    for member, wealth in zip(members, updated_wealth):
        member.wealth_scenario_B = wealth

    mobility = metrics.calculate_wealth_mobility()
    mobility_score = metrics.calculate_wealth_mobility_score()

    initial_percentiles = pd.Series({m.id: m.initial_wealth for m in members}).rank(method='average', pct=True)
    current_percentiles = pd.Series({m.id: m.wealth_scenario_B for m in members}).rank(method='average', pct=True)

    expected_mobility = float(np.mean(np.abs(current_percentiles - initial_percentiles)))
    upward_changes = [max(0.0, current_percentiles[m.id] - initial_percentiles[m.id]) for m in members]
    positive_changes = [val for val in upward_changes if val > 0]
    expected_mobility_score = float(np.mean(positive_changes)) if positive_changes else 0.0

    assert mobility == pytest.approx(expected_mobility)
    assert mobility_score == pytest.approx(expected_mobility_score)


def test_velocity_efficiency_diversity_and_innovation():
    members = [
        _make_member("M1", 300.0, 0.6, 100.0, grotoken=10.0,
                     internal_spend=45.0, external_spend=15.0, total_spend=60.0, effective_internal=50.0),
        _make_member("M2", 200.0, 0.4, 80.0, grotoken=0.0,
                     internal_spend=25.0, external_spend=35.0, total_spend=60.0, effective_internal=40.0),
        _make_member("M3", 500.0, 0.5, 120.0, grotoken=5.0,
                     internal_spend=0.0, external_spend=40.0, total_spend=40.0, effective_internal=30.0),
    ]
    params = {"GROTOKEN_USD_VALUE": 2.0}
    metrics = EconomicMetrics(members, params)

    velocity = metrics.calculate_economic_velocity()
    market_efficiency = metrics.calculate_market_efficiency()
    innovation = metrics.calculate_innovation_adoption()
    diversity = metrics.calculate_economic_diversity()

    total_spending = 60.0 + 60.0 + 40.0
    total_wealth = 300.0 + 200.0 + 500.0
    expected_velocity = total_spending / total_wealth

    realised_internal = 45.0 + 25.0 + 0.0
    effective_internal = 50.0 + 40.0 + 30.0
    expected_efficiency = realised_internal / effective_internal

    token_value = (10.0 + 0.0 + 5.0) * params["GROTOKEN_USD_VALUE"]
    expected_innovation = token_value / total_wealth

    internal_spend = realised_internal
    external_spend = 15.0 + 35.0 + 40.0
    total_spend = internal_spend + external_spend
    expected_diversity = (1.0 - ((internal_spend / total_spend) ** 2 + (external_spend / total_spend) ** 2)) * 2

    assert velocity == pytest.approx(expected_velocity)
    assert market_efficiency == pytest.approx(expected_efficiency)
    assert innovation == pytest.approx(expected_innovation)
    assert diversity == pytest.approx(expected_diversity)
