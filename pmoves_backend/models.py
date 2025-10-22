"""Data models and default configuration for the PMOVES simulator."""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Dict, Any

import numpy as np


DEFAULT_PARAMS: Dict[str, Any] = {
    "NUM_MEMBERS": 50,
    "SIMULATION_WEEKS": 52 * 3,
    "INITIAL_WEALTH_MEAN_LOG": np.log(1000),
    "INITIAL_WEALTH_SIGMA_LOG": 0.6,
    "WEEKLY_FOOD_BUDGET_AVG": 75.0,
    "WEEKLY_FOOD_BUDGET_STDDEV": 15.0,
    "MIN_WEEKLY_BUDGET": 20.0,
    "WEEKLY_INCOME_AVG": 150.0,
    "WEEKLY_INCOME_STDDEV": 40.0,
    "MIN_WEEKLY_INCOME": 0.0,
    "GROUP_BUY_SAVINGS_PERCENT": 0.15,
    "LOCAL_PRODUCTION_SAVINGS_PERCENT": 0.25,
    "PERCENT_SPEND_INTERNAL_AVG": 0.60,
    "PERCENT_SPEND_INTERNAL_STDDEV": 0.20,
    "GROTOKEN_REWARD_PER_WEEK_AVG": 0.5,
    "GROTOKEN_REWARD_STDDEV": 0.2,
    "GROTOKEN_USD_VALUE": 2.0,
    "WEEKLY_COOP_FEE_B": 1.0,
}


@dataclass
class SimMember:
    """Represents a single community member in the simulation."""

    id: str
    initial_wealth: float
    params: Dict[str, Any]

    def __post_init__(self) -> None:
        self.wealth_scenario_A = max(0.0, self.initial_wealth)
        self.wealth_scenario_B = max(0.0, self.initial_wealth)
        self.food_usd_balance = max(0.0, self.initial_wealth)
        self.grotoken_balance = 0.0

        self.weekly_food_budget = max(
            self.params["MIN_WEEKLY_BUDGET"],
            random.gauss(
                self.params["WEEKLY_FOOD_BUDGET_AVG"],
                self.params["WEEKLY_FOOD_BUDGET_STDDEV"],
            ),
        )
        self.propensity_to_spend_internal = max(
            0.0,
            min(
                1.0,
                random.gauss(
                    self.params["PERCENT_SPEND_INTERNAL_AVG"],
                    self.params["PERCENT_SPEND_INTERNAL_STDDEV"],
                ),
            ),
        )
        self.weekly_income = max(
            self.params["MIN_WEEKLY_INCOME"],
            random.gauss(
                self.params["WEEKLY_INCOME_AVG"],
                self.params["WEEKLY_INCOME_STDDEV"],
            ),
        )

        # Additional placeholders for advanced metrics at member level
        self.internal_transaction_count = 0
        self.grotoken_usage_rate = random.random() * 0.1
