# Write a startup log immediately
# (Optional: remove if not needed or causing issues)
# try:
#     with open('flask_startup_log.txt', 'w') as f:
#         f.write('Flask backend starting...\n')
# except Exception as log_e:
#     print(f"Warning: Could not write startup log: {log_e}")

import os
import sys
import random
import numpy as np
import pandas as pd
import traceback
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import logging

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
logging.basicConfig(level=logging.INFO) # Basic logging


# --- Simulation Parameters ---
DEFAULT_PARAMS = {
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

# --- Helper Functions ---
def calculate_gini(wealth_distribution):
    wealth_non_negative = np.maximum(0, np.array(wealth_distribution))
    wealth = np.sort(wealth_non_negative)
    n = len(wealth)
    if n == 0: return 0.0
    index = np.arange(1, n + 1)
    denominator = n * np.sum(wealth)
    if denominator == 0: return 0.0
    return (np.sum((2 * index - n - 1) * wealth)) / denominator

# --- Member Representation ---
class SimMember:
    def __init__(self, member_id, initial_wealth, params):
        self.id = member_id
        self.wealth_scenario_A = max(0, initial_wealth)
        self.wealth_scenario_B = max(0, initial_wealth)
        self.initial_wealth = self.wealth_scenario_B
        self.food_usd_balance = max(0, initial_wealth)
        self.grotoken_balance = 0.0
        self.weekly_food_budget = max(params["MIN_WEEKLY_BUDGET"],
                                      random.gauss(params["WEEKLY_FOOD_BUDGET_AVG"],
                                                   params["WEEKLY_FOOD_BUDGET_STDDEV"]))
        self.propensity_to_spend_internal = max(0.0, min(1.0,
                                            random.gauss(params["PERCENT_SPEND_INTERNAL_AVG"],
                                                         params["PERCENT_SPEND_INTERNAL_STDDEV"])))
        self.weekly_income = max(params["MIN_WEEKLY_INCOME"],
                                 random.gauss(params["WEEKLY_INCOME_AVG"],
                                              params["WEEKLY_INCOME_STDDEV"]))
        # Add placeholders for advanced metrics if needed at member level
        self.internal_transaction_count = 0 # Example for market efficiency
        self.last_internal_spend = 0.0
        self.last_external_spend = 0.0
        self.last_total_spend = 0.0
        self.last_effective_internal_cost = 0.0
        self.last_grotoken_reward = 0.0

# --- Economic Metrics Class ---
# (Copied exactly from flask_backend.txt - includes advanced metrics)
class EconomicMetrics:
    def __init__(self, members, params):
        self.members = members
        self.params = params
        self.previous_metrics = None
        self.current_week = 0 # Add week tracking
        self.initial_wealth_percentiles = self._compute_percentile_ranks(
            {member.id: getattr(member, 'initial_wealth', member.wealth_scenario_B) for member in members}
        )

    def _compute_percentile_ranks(self, values_by_member):
        """Return percentile ranks (0-1) for a mapping of member ids to values."""
        if not values_by_member:
            return {}
        series = pd.Series(values_by_member)
        return series.rank(method='average', pct=True).to_dict()

    def calculate_metrics(self, wealth_A_list, wealth_B_list, week):
        self.current_week = week # Update current week
        # Basic wealth distribution analysis
        wealth_quintiles_A = np.percentile(wealth_A_list, [20, 40, 60, 80]) if wealth_A_list else []
        wealth_quintiles_B = np.percentile(wealth_B_list, [20, 40, 60, 80]) if wealth_B_list else []

        metrics = {
            'Week': week,
            'Year': week // 52 + 1,
            'Quarter': (week % 52) // 13 + 1,

            # Core Wealth Metrics
            'AvgWealth_A': np.mean(wealth_A_list) if wealth_A_list else 0,
            'AvgWealth_B': np.mean(wealth_B_list) if wealth_B_list else 0,
            'MedianWealth_A': np.median(wealth_A_list) if wealth_A_list else 0,
            'MedianWealth_B': np.median(wealth_B_list) if wealth_B_list else 0,
            'TotalWealth_A': np.sum(wealth_A_list),
            'TotalWealth_B': np.sum(wealth_B_list),

            # Wealth Distribution Metrics
            'WealthQuintiles_A': wealth_quintiles_A.tolist(),
            'WealthQuintiles_B': wealth_quintiles_B.tolist(),
            'Top10Percent_A': np.percentile(wealth_A_list, 90) if wealth_A_list else 0,
            'Top10Percent_B': np.percentile(wealth_B_list, 90) if wealth_B_list else 0,
            'Bottom10Percent_A': np.percentile(wealth_A_list, 10) if wealth_A_list else 0,
            'Bottom10Percent_B': np.percentile(wealth_B_list, 10) if wealth_B_list else 0,

            # Inequality Metrics
            'Gini_A': calculate_gini(wealth_A_list),
            'Gini_B': calculate_gini(wealth_B_list),
            'WealthGap_A': self.calculate_wealth_gap(wealth_A_list),
            'WealthGap_B': self.calculate_wealth_gap(wealth_B_list),
            'Bottom20PctShare': self.calculate_bottom_20_pct_share(wealth_B_list),

            # Economic Health Indicators
            'PovertyRate_A': self.calculate_poverty_rate(wealth_A_list),
            'PovertyRate_B': self.calculate_poverty_rate(wealth_B_list),
            'WealthMobility': self.calculate_wealth_mobility(), # Placeholder
            'LocalEconomyStrength': self.calculate_local_economy_strength(),
            'CommunityResilience': self.calculate_community_resilience(), # Placeholder

            # New Advanced Metrics
            'EconomicVelocity': self.calculate_economic_velocity(), # Placeholder
            'SocialSafetyNet': self.calculate_social_safety_net(),
            'InnovationIndex': self.calculate_innovation_index(), # Placeholder
            'SustainabilityScore': self.calculate_sustainability_score(), # Placeholder
            'CommunityEngagement': self.calculate_community_engagement() # Placeholder
        }
        # Add results from calculate_advanced_metrics
        metrics.update(self.calculate_advanced_metrics())

        # Calculate trends if we have previous metrics
        if self.previous_metrics:
            metrics.update(self.calculate_trends(metrics))

        self.previous_metrics = metrics.copy()
        return metrics

    # --- Calculation methods (copied from flask_backend.txt) ---
    def calculate_poverty_rate(self, wealth_list):
        poverty_line = self.params.get("WEEKLY_FOOD_BUDGET_AVG", 75) * 4
        if not wealth_list: return 0.0
        return np.mean([1 if w < poverty_line else 0 for w in wealth_list])

    def calculate_wealth_mobility(self):
        """Average absolute shift in each member's wealth percentile relative to their initial position.

        Assumptions:
            * Scenario B wealth represents the cooperative model's wealth distribution.
            * Initial percentiles are captured at metrics initialization and treated as the baseline.
            * Percentile ranks are computed with average ranking, yielding a 0-1 scale.
        """
        if not self.members:
            return 0.0
        current_percentiles = self._compute_percentile_ranks({m.id: m.wealth_scenario_B for m in self.members})
        deltas = []
        for member in self.members:
            initial = self.initial_wealth_percentiles.get(member.id)
            current = current_percentiles.get(member.id)
            if initial is None or current is None:
                continue
            deltas.append(abs(current - initial))
        return float(np.mean(deltas)) if deltas else 0.0

    def calculate_local_economy_strength(self):
        if not self.members: return 0.0
        return np.mean([m.propensity_to_spend_internal for m in self.members])

    def calculate_community_resilience(self):
        # Placeholder: Combines safety net and maybe wealth stability
        safety_net = self.calculate_social_safety_net()
        return safety_net

    def calculate_wealth_gap(self, wealth_list):
        if len(wealth_list) < 5: return float('inf')
        try:
            top_20_idx = int(len(wealth_list) * 0.8); bottom_20_idx = int(len(wealth_list) * 0.2)
            sorted_wealth = np.sort(np.maximum(0, wealth_list))
            top_20_mean = np.mean(sorted_wealth[top_20_idx:])
            bottom_20_mean = np.mean(sorted_wealth[:bottom_20_idx])
            return top_20_mean / bottom_20_mean if bottom_20_mean > 1e-6 else float('inf')
        except: return float('inf')

    def calculate_bottom_20_pct_share(self, wealth_list):
        if len(wealth_list) < 5: return 0.0
        try:
            total_wealth = np.sum(np.maximum(0, wealth_list))
            if total_wealth <= 1e-6: return 0.0
            sorted_wealth = np.sort(np.maximum(0, wealth_list))
            bottom_20_idx = int(len(wealth_list) * 0.2)
            bottom_20_wealth = np.sum(sorted_wealth[:bottom_20_idx])
            return bottom_20_wealth / total_wealth
        except: return 0.0

    def calculate_economic_velocity(self):
        """Velocity of cooperative wealth measured as recent total spending over current wealth stock.

        Assumptions:
            * `last_total_spend` tracks the most recent week of Scenario B spending for each member.
            * Scenario B wealth approximates the circulating money supply for the cooperative economy.
            * Velocity equals total spending divided by total wealth; values above 1 imply faster turnover.
        """
        if not self.members:
            return 0.0
        total_spending = sum(getattr(m, 'last_total_spend', 0.0) for m in self.members)
        total_wealth = sum(m.wealth_scenario_B for m in self.members)
        if total_wealth <= 0:
            return 0.0
        return float(total_spending / total_wealth)

    def calculate_social_safety_net(self):
        poverty_line = self.params.get("WEEKLY_FOOD_BUDGET_AVG", 75) * 4
        if not self.members: return 0.0
        below_poverty = len([m for m in self.members if m.wealth_scenario_B < poverty_line])
        return 1.0 - (below_poverty / len(self.members))

    def calculate_innovation_index(self):
        # Placeholder
        if not self.members: return 0.0
        grotoken_adoption = np.mean([1 if m.grotoken_balance > 0 else 0 for m in self.members])
        local_prod_strength = self.calculate_local_economy_strength()
        return (grotoken_adoption + local_prod_strength) / 2

    def calculate_sustainability_score(self):
        # Placeholder
        resilience = self.calculate_community_resilience()
        return resilience

    def calculate_community_engagement(self):
        # Placeholder
        if not self.members: return 0.0
        return np.mean([m.propensity_to_spend_internal for m in self.members])

    def calculate_trends(self, current_metrics):
        trends = {}
        # Add more keys if needed
        trend_keys = ['AvgWealth_B', 'Gini_B', 'PovertyRate_B', 'LocalEconomyStrength',
                      'CommunityResilience', 'EconomicVelocity', 'SocialSafetyNet',
                      'InnovationIndex', 'SustainabilityScore', 'CommunityEngagement']
        for key in trend_keys:
            if self.previous_metrics and key in self.previous_metrics and key in current_metrics:
                prev_value = self.previous_metrics[key]
                current_value = current_metrics[key]
                try:
                    if abs(prev_value) > 1e-6: trends[f'{key}_Trend'] = (current_value - prev_value) / abs(prev_value)
                    elif current_value > prev_value: trends[f'{key}_Trend'] = 1.0
                    elif current_value < prev_value: trends[f'{key}_Trend'] = -1.0
                    else: trends[f'{key}_Trend'] = 0.0
                except: trends[f'{key}_Trend'] = 0.0
            else: trends[f'{key}_Trend'] = 0.0
        return trends

    # --- Placeholder methods for unimplemented advanced metrics ---
    def calculate_market_efficiency(self):
        """Ratio of realised internal cooperative spending to the effective internal demand.

        Assumptions:
            * `last_internal_spend` stores the most recent internal outlay in Scenario B.
            * `last_effective_internal_cost` captures the discounted internal cost members attempted to cover.
            * Efficiency is capped at 1 and reflects liquidity limitations rather than behavioural change.
        """
        if not self.members:
            return 0.0
        realised_internal = sum(getattr(m, 'last_internal_spend', 0.0) for m in self.members)
        effective_internal = sum(
            getattr(m, 'last_effective_internal_cost', m.weekly_food_budget * m.propensity_to_spend_internal)
            for m in self.members
        )
        if effective_internal <= 0:
            return 0.0
        efficiency = realised_internal / effective_internal
        return float(max(0.0, min(1.0, efficiency)))

    def calculate_innovation_adoption(self):
        """Share of cooperative wealth held in GroTokens, representing token adoption intensity.

        Assumptions:
            * GroToken balances are immediately valued using the configured USD conversion rate.
            * Members with no GroTokens contribute zero to adoption.
            * Adoption is measured at the community level (token value / total Scenario B wealth).
        """
        if not self.members:
            return 0.0
        token_value = sum(m.grotoken_balance for m in self.members) * self.params.get("GROTOKEN_USD_VALUE", 2.0)
        total_wealth = sum(m.wealth_scenario_B for m in self.members)
        if total_wealth <= 0:
            return 0.0
        return float(token_value / total_wealth)

    def calculate_wealth_mobility_score(self):
        """Average upward percentile movement relative to the initial Scenario B wealth distribution.

        Assumptions:
            * Only positive percentile changes contribute to the score; declines are treated as zero.
            * Percentiles are identical to those used in :meth:`calculate_wealth_mobility`.
            * Resulting score lies on a 0-1 scale where 0 indicates no upward mobility.
        """
        if not self.members:
            return 0.0
        current_percentiles = self._compute_percentile_ranks({m.id: m.wealth_scenario_B for m in self.members})
        upward_changes = []
        for member in self.members:
            initial = self.initial_wealth_percentiles.get(member.id)
            current = current_percentiles.get(member.id)
            if initial is None or current is None:
                continue
            delta = current - initial
            if delta > 0:
                upward_changes.append(delta)
        return float(np.mean(upward_changes)) if upward_changes else 0.0

    def calculate_economic_diversity(self):
        """Simpson diversity index (scaled 0-1) of internal vs. external cooperative spending.

        Assumptions:
            * Only the most recent week's internal and external spending are considered.
            * Diversity is calculated on the share of spending by channel, scaled so perfect balance = 1.
            * No spending defaults to zero diversity.
        """
        if not self.members:
            return 0.0
        internal_spend = sum(getattr(m, 'last_internal_spend', 0.0) for m in self.members)
        external_spend = sum(getattr(m, 'last_external_spend', 0.0) for m in self.members)
        total_spend = internal_spend + external_spend
        if total_spend <= 0:
            return 0.0
        internal_share = internal_spend / total_spend
        external_share = external_spend / total_spend
        simpson = 1.0 - (internal_share ** 2 + external_share ** 2)
        return float(max(0.0, min(1.0, simpson * 2)))

    def calculate_risk_resilience(self):
         # Placeholder: Could combine safety net and wealth stability
         safety_net = self.calculate_social_safety_net()
         wealth_B = [m.wealth_scenario_B for m in self.members]
         mean_wealth = np.mean(wealth_B) if wealth_B else 0
         std_dev = np.std(wealth_B) if wealth_B else 0
         stability = 1.0 - (std_dev / mean_wealth) if mean_wealth > 1e-6 else 0
         return (safety_net + stability) / 2.0


    def calculate_advanced_metrics(self):
        # Call the placeholder methods
        return {
            'MarketEfficiency': self.calculate_market_efficiency(),
            'InnovationAdoption': self.calculate_innovation_adoption(),
            'WealthMobilityScore': self.calculate_wealth_mobility_score(),
            'EconomicDiversity': self.calculate_economic_diversity(),
            'RiskResilience': self.calculate_risk_resilience()
        }

    # --- Placeholder methods for shock testing (copied) ---
    def run_simulation_period(self, duration):
        app.logger.warning("run_simulation_period is a placeholder.")
        return {'placeholder_metric': random.random()}

    def calculate_recovery_metrics(self):
        app.logger.warning("calculate_recovery_metrics is a placeholder.")
        return {'recovery_rate': random.random() * 0.1, 'resilience_score': random.random()}

    def simulate_economic_shock(self, shock_type, magnitude, duration):
        app.logger.warning("simulate_economic_shock is a placeholder.")
        shock_metrics = self.run_simulation_period(duration)
        recovery_metrics = self.calculate_recovery_metrics()
        return {
            'shock_impact': shock_metrics,
            'recovery_rate': recovery_metrics['recovery_rate'],
            'resilience_score': recovery_metrics['resilience_score']
        }

# --- Narrative Generation Functions ---
# (Copied exactly from flask_backend.txt)
def generate_narrative_summary(history, events):
    if not history: return {"title": "Error", "overview": "No simulation history data available."}
    first_period = history[0]; last_period = history[-1]
    mid_period_index = len(history) // 2; mid_period = history[mid_period_index] if mid_period_index < len(history) else last_period
    wealth_change = ((last_period['TotalWealth_B'] - first_period['TotalWealth_B']) / first_period['TotalWealth_B'] if first_period['TotalWealth_B'] != 0 else 0)
    inequality_change = last_period['Gini_B'] - first_period['Gini_B']
    poverty_trend = 'decreased' if last_period['PovertyRate_B'] < first_period['PovertyRate_B'] else 'increased or stayed same'
    narrative = {
        "title": "Economic System Evolution Analysis",
        "overview": f"Over {len(history)} weeks, the community's economic system under Scenario B (Cooperative) showed notable changes compared to Scenario A (Existing).",
        "key_findings": {
            "wealth_impact": {
                "summary": f"Total wealth in Scenario B {'grew' if wealth_change > 0 else 'declined'} by {abs(wealth_change)*100:.1f}% compared to its start.",
                "details": f"Average wealth in B finished at ${last_period['AvgWealth_B']:.2f}, compared to ${last_period['AvgWealth_A']:.2f} in A. The wealth distribution in B became {'more' if inequality_change > 0 else 'less'} unequal over time."
            },
            "equality_measures": {
                "summary": f"Wealth inequality in B {'decreased' if inequality_change < 0 else 'increased'} by {abs(inequality_change)*100:.1f}% (absolute Gini change).",
                "gini": f"Gini coefficient in B moved from {first_period['Gini_B']:.3f} to {last_period['Gini_B']:.3f} (vs {last_period['Gini_A']:.3f} in A).",
                "details": (f"The poorest 20% share of total wealth in B changed from {first_period.get('Bottom20PctShare', 0)*100:.1f}% to {last_period.get('Bottom20PctShare', 0)*100:.1f}%. "
                            f"The wealth gap (Top 20% / Bottom 20%) finished at {last_period.get('WealthGap_B', 'N/A'):.1f}x in B (vs {last_period.get('WealthGap_A', 'N/A'):.1f}x in A).")
            },
            "community_health": {
                "poverty": f"Poverty rate in B {poverty_trend}, finishing at {last_period['PovertyRate_B']*100:.1f}% (vs {last_period['PovertyRate_A']*100:.1f}% in A).",
                "resilience": f"Community resilience index in B finished at: {last_period.get('CommunityResilience', 'N/A'):.2f}",
                "details": f"Economic health indicators suggest Scenario B fostered {'improvement' if last_period.get('CommunityResilience', 0) > first_period.get('CommunityResilience', 0) else 'challenges'} in resilience.",
                "sustainability": f"Economic sustainability score in B: {last_period.get('SustainabilityScore', 'N/A'):.2f}"
            }
        },
        "phase_analysis": analyze_economic_phases(history),
        "key_events": [e['description'] for e in events] if events else ["No significant key events detected."],
        "conclusion": generate_conclusion(history)
    }
    return narrative

def analyze_economic_phases(history):
    if len(history) < 9: return []
    phase_length = len(history) // 3
    phases_data = [history[:phase_length], history[phase_length:2*phase_length], history[2*phase_length:]]
    phase_periods = [f"Weeks 1-{phase_length}", f"Weeks {phase_length+1}-{2*phase_length}", f"Weeks {2*phase_length+1}-{len(history)}"]
    phase_names = ["Initial Phase", "Development Phase", "Maturity Phase"]; analyzed_phases = []
    for i, phase_data in enumerate(phases_data):
        if not phase_data: continue
        start_metrics = phase_data[0]; end_metrics = phase_data[-1]
        start_total_wealth = start_metrics.get('TotalWealth_B', 0); end_total_wealth = end_metrics.get('TotalWealth_B', 0)
        wealth_growth = ((end_total_wealth - start_total_wealth) / start_total_wealth if start_total_wealth > 1e-6 else 0)
        if i == 0: phase_char = "Adaptation" if abs(wealth_growth) < 0.05 else "Rapid Growth" if wealth_growth > 0.1 else "Steady Growth"
        elif i == 1: phase_char = "Consolidation" if wealth_growth < analyzed_phases[0]['raw_growth'] else "Acceleration" if wealth_growth > analyzed_phases[0]['raw_growth'] else "Stabilization"
        else: phase_char = "Maturity" if abs(wealth_growth) < 0.03 else "Continued Growth" if wealth_growth > 0 else "Contraction"
        analyzed_phases.append({
            "period": phase_periods[i], "type": phase_names[i], "raw_growth": wealth_growth,
            "characteristics": f"{phase_char} (Wealth Change: {wealth_growth*100:+.1f}%)",
            "metrics": { "avg_wealth": f"${end_metrics.get('AvgWealth_B', 0):.2f}", "poverty_rate": f"{end_metrics.get('PovertyRate_B', 0)*100:.1f}%", "gini": f"{end_metrics.get('Gini_B', 0):.3f}" }
        })
    for phase in analyzed_phases: del phase['raw_growth']
    return analyzed_phases

def generate_conclusion(history):
    if not history: return "No simulation data to generate conclusion."
    first_period = history[0]; last_period = history[-1]
    wealth_change_B = ((last_period['TotalWealth_B'] - first_period['TotalWealth_B']) / first_period['TotalWealth_B'] if first_period['TotalWealth_B'] > 1e-6 else 0)
    inequality_change_B = last_period['Gini_B'] - first_period['Gini_B']; poverty_change_B = last_period['PovertyRate_B'] - first_period['PovertyRate_B']
    resilience_change_B = last_period.get('CommunityResilience', 0) - first_period.get('CommunityResilience', 0)
    final_wealth_diff = last_period['TotalWealth_B'] - last_period['TotalWealth_A']; final_gini_diff = last_period['Gini_B'] - last_period['Gini_A']
    economic_success = "successful" if wealth_change_B > 0.1 and poverty_change_B < 0 else "moderately successful" if wealth_change_B >= 0 and poverty_change_B <= 0 else "challenging"
    equity_outcome = "more equitable" if inequality_change_B < -0.02 else "slightly more equitable" if inequality_change_B < 0 else "less equitable" if inequality_change_B > 0.02 else "equity neutral"
    resilience_outcome = "more resilient" if resilience_change_B > 0.05 else "less resilient" if resilience_change_B < -0.05 else "resilience neutral"
    conclusion = (f"The simulation suggests a {economic_success} outcome for the Cooperative Model (Scenario B) over {len(history)} weeks. "
                  f"Compared to its starting point, the community became {equity_outcome} and potentially {resilience_outcome}. ")
    if final_wealth_diff > 0: conclusion += f"Crucially, Scenario B ended with ${final_wealth_diff:,.2f} more total wealth than Scenario A (Existing System). "
    else: conclusion += f"However, Scenario B ended with ${abs(final_wealth_diff):,.2f} less total wealth than Scenario A. "
    if final_gini_diff < -0.01: conclusion += f"Scenario B also demonstrated lower final inequality (Gini diff: {final_gini_diff:.3f}). "
    elif final_gini_diff > 0.01: conclusion += f"However, Scenario B showed higher final inequality (Gini diff: {final_gini_diff:.3f}). "
    else: conclusion += "Final inequality levels were similar between scenarios. "
    conclusion += "These results highlight the potential benefits (or drawbacks) of the cooperative model under the simulated parameters, particularly regarding wealth retention and distribution."
    return conclusion


# --- Core Simulation Function (Modified to return summary/events) ---
def run_simulation(params):
    """ Runs the economic comparison simulation with given parameters. """
    app.logger.info(f"--- Running Simulation with params: {params.get('description', 'Custom Params')} ---")
    sim_params = DEFAULT_PARAMS.copy()
    sim_params.update(params)

    try:
        initial_wealths = np.random.lognormal(mean=sim_params["INITIAL_WEALTH_MEAN_LOG"], sigma=sim_params["INITIAL_WEALTH_SIGMA_LOG"], size=int(sim_params["NUM_MEMBERS"]))
        members = [SimMember(f"M_{i}", wealth, sim_params) for i, wealth in enumerate(initial_wealths)]
        metrics_calculator = EconomicMetrics(members, sim_params) # Use the metrics class
        simulation_history = []
        key_events = []
        app.logger.info(f"Initialized {len(members)} members.")
    except Exception as e:
        app.logger.error(f"Error during simulation setup: {e}", exc_info=True)
        raise ValueError(f"Error during simulation setup: {e}")

    # --- Simulation Loop ---
    for week in range(int(sim_params["SIMULATION_WEEKS"])):
        current_wealth_A_list = []
        current_wealth_B_list = []
        # --- Member processing loop (Copied from flask_backend.txt) ---
        for member in members:
            try:
                member.wealth_scenario_A += member.weekly_income
                member.food_usd_balance += member.weekly_income
                actual_spending_A = min(member.weekly_food_budget, member.wealth_scenario_A)
                member.wealth_scenario_A = max(0, member.wealth_scenario_A - actual_spending_A)
                budget_to_spend = member.weekly_food_budget
                intended_spend_internal = budget_to_spend * member.propensity_to_spend_internal
                intended_spend_external = budget_to_spend * (1.0 - member.propensity_to_spend_internal)
                avg_internal_savings_rate = (sim_params["GROUP_BUY_SAVINGS_PERCENT"] + sim_params["LOCAL_PRODUCTION_SAVINGS_PERCENT"]) / 2
                effective_cost_internal = intended_spend_internal * (1.0 - avg_internal_savings_rate)
                effective_cost_external = intended_spend_external
                total_effective_cost = effective_cost_internal + effective_cost_external
                actual_total_spending_B = min(total_effective_cost, member.food_usd_balance)
                spend_ratio = (actual_total_spending_B / total_effective_cost) if total_effective_cost > 1e-6 else 0.0
                actual_internal_spend = effective_cost_internal * spend_ratio
                actual_external_spend = effective_cost_external * spend_ratio
                member.food_usd_balance = max(0, member.food_usd_balance - actual_total_spending_B)
                actual_coop_fee = min(sim_params["WEEKLY_COOP_FEE_B"], member.food_usd_balance)
                member.food_usd_balance = max(0, member.food_usd_balance - actual_coop_fee)
                member.last_internal_spend = actual_internal_spend
                member.last_external_spend = actual_external_spend
                member.last_effective_internal_cost = effective_cost_internal
                member.last_total_spend = actual_total_spending_B + actual_coop_fee
                if actual_internal_spend > 0:
                    member.internal_transaction_count += 1
                reward = max(0, random.gauss(sim_params["GROTOKEN_REWARD_PER_WEEK_AVG"], sim_params["GROTOKEN_REWARD_STDDEV"]))
                member.last_grotoken_reward = reward
                member.grotoken_balance += reward
                current_wealth_B = member.food_usd_balance + (member.grotoken_balance * sim_params["GROTOKEN_USD_VALUE"])
                member.wealth_scenario_B = current_wealth_B
                current_wealth_A_list.append(member.wealth_scenario_A)
                current_wealth_B_list.append(current_wealth_B)
            except Exception as e:
                 app.logger.error(f"Error processing member {member.id} in week {week+1}: {e}", exc_info=True)
                 current_wealth_A_list.append(member.wealth_scenario_A)
                 current_wealth_B_list.append(member.wealth_scenario_B)

        # --- Record Weekly Metrics ---
        try:
            weekly_metrics = metrics_calculator.calculate_metrics(current_wealth_A_list, current_wealth_B_list, week + 1)
            simulation_history.append(weekly_metrics)
            # --- Event Tracking (Example) ---
            if week > 0:
                prev_metrics = simulation_history[-2]
                if weekly_metrics.get('Gini_B', 1) < prev_metrics.get('Gini_B', 1) * 0.95:
                    key_events.append({'week': week + 1, 'type': 'equality_improvement', 'description': f"Significant reduction in wealth inequality (Gini B < {prev_metrics.get('Gini_B', 1) * 0.95:.3f})"})
                if weekly_metrics.get('PovertyRate_B', 1) < prev_metrics.get('PovertyRate_B', 1) * 0.9:
                     key_events.append({'week': week + 1, 'type': 'poverty_reduction', 'description': f"Significant poverty reduction (Rate B < {prev_metrics.get('PovertyRate_B', 1) * 0.9:.1%})"})
        except Exception as e:
            app.logger.error(f"Error calculating metrics for week {week+1}: {e}", exc_info=True)

    app.logger.info("--- Simulation Loop Finished ---")

    # --- Prepare Results ---
    try:
        final_member_data = [{'ID': m.id, 'Income': m.weekly_income, 'Budget': m.weekly_food_budget, 'Wealth_A': m.wealth_scenario_A, 'Wealth_B': m.wealth_scenario_B, 'FoodUSD_B': m.food_usd_balance, 'GroToken_B': m.grotoken_balance} for m in members]
        final_members_df = pd.DataFrame(final_member_data)
        summary_narrative = generate_narrative_summary(simulation_history, key_events) # Generate summary
        results = {
            "history": simulation_history,
            "final_members": final_members_df.to_dict(orient='records'),
            "key_events": key_events, # Include events
            "summary": summary_narrative # Include summary
            # "advanced_metrics": metrics_calculator.calculate_advanced_metrics() # Optionally include latest advanced metrics separately
        }
        return results
    except Exception as e:
        app.logger.error(f"Error preparing results: {e}", exc_info=True)
        raise ValueError(f"Error preparing results: {e}")


# --- API Endpoint ---
@app.route('/run_simulation', methods=['POST'])
def handle_simulation():
    if not request.is_json: return jsonify({"error": "Request must be JSON"}), 400
    params = request.get_json()
    app.logger.info(f"Received request with params: {params}")
    try:
        simulation_results = run_simulation(params)
        return jsonify(simulation_results)
    except ValueError as ve:
         app.logger.error(f"Simulation Value Error: {ve}", exc_info=True)
         return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error during simulation: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred during simulation."}), 500

# --- Placeholder endpoints (Copied) ---
@app.route('/get_current_metrics')
def get_current_metrics():
    try:
        # Placeholder implementation
        return jsonify({
            'health_score': 0.75 + random.random() * 0.1 - 0.05, 'market_efficiency': 0.68 + random.random() * 0.1 - 0.05, 'resilience_score': 0.82 + random.random() * 0.1 - 0.05,
            'detailed_metrics': { 'velocity': 0.45 + random.random() * 0.1 - 0.05, 'inequality': 0.32 + random.random() * 0.1 - 0.05, 'growth_rate': 0.03 + random.random() * 0.02 - 0.01, 'innovation_score': 0.65 + random.random() * 0.1 - 0.05 },
            'trends': { 'health_trend': (random.random() - 0.5) * 0.05, 'efficiency_trend': (random.random() - 0.5) * 0.05, 'resilience_trend': (random.random() - 0.5) * 0.05 },
            'warnings': ['Moderate inequality detected'] if random.random() > 0.5 else [], 'recommendations': ['Consider increasing internal spending'] if random.random() > 0.3 else ['Monitor GroToken value']
        })
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/run_scenario', methods=['POST'])
def run_scenario():
    scenario_data = request.json or {}; app.logger.info(f"Running scenario: {scenario_data.get('name', 'Custom')}")
    try: # Placeholder
        results = run_simulation(DEFAULT_PARAMS) # Rerun default for demo
        scenario_results = {
            'scenario_name': scenario_data.get('name', 'Custom Scenario'), 'outcome': results.get('summary', {}).get('conclusion', 'Simulation completed.'),
            'metrics': { 'final_wealth': results.get('history', [{}])[-1].get('AvgWealth_B', 'N/A'), 'gini': results.get('history', [{}])[-1].get('Gini_B', 'N/A'), 'poverty_rate': results.get('history', [{}])[-1].get('PovertyRate_B', 'N/A') }
        }
        return jsonify({ 'scenario_results': scenario_results, 'comparative_analysis': 'Scenario performed similarly to baseline in this mock run.', 'recommendations': ['Adjust savings parameters for different outcomes.'] })
    except Exception as e: app.logger.error(f"Error running scenario: {e}", exc_info=True); return jsonify({'error': str(e)}), 500

@app.route('/test_shock', methods=['POST'])
def test_shock():
    shock_params = request.json or {}; app.logger.info(f"Testing shock: {shock_params}")
    try: # Placeholder
        results = {
            'shock_type': shock_params.get('type', 'income_reduction'), 'magnitude': shock_params.get('magnitude', 0.2), 'duration': shock_params.get('duration', 4),
            'impact': { 'wealth_reduction': 0.15 + random.random() * 0.1, 'poverty_increase': 0.08 + random.random() * 0.05, 'recovery_time': random.randint(8, 20) }
        }
        return jsonify({ 'shock_results': results, 'recovery_metrics': { 'recovery_rate': 0.05 + random.random() * 0.03, 'resilience_score': 0.72 + random.random() * 0.1 - 0.05 }, 'recommendations': ['Build emergency reserves', 'Diversify income sources'] })
    except Exception as e: app.logger.error(f"Error testing shock: {e}", exc_info=True); return jsonify({'error': str(e)}), 500

# --- Basic HTML serving ---
@app.route('/')
def index():
    # Serve the index.html template
    return render_template('index.html')

# --- Main Execution ---
if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true' # Default to True for dev
    # Use 0.0.0.0 to be accessible externally if needed, 127.0.0.1 for local only
    host_ip = '127.0.0.1'
    app.run(debug=debug_mode, host=host_ip, port=5000)

