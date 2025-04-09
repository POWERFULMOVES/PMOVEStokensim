import os
import sys
import random
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
import logging

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# --- Flask App Setup ---
app = Flask(__name__,
            static_folder=resource_path('static'),
            template_folder=resource_path('templates'))
logging.basicConfig(level=logging.INFO) # Basic logging

# --- Simulation Parameters (Copied from previous Python script) ---
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

# --- Helper Functions (Copied) ---
def calculate_gini(wealth_distribution):
    wealth_non_negative = np.maximum(0, np.array(wealth_distribution))
    wealth = np.sort(wealth_non_negative)
    n = len(wealth)
    if n == 0: return 0.0
    index = np.arange(1, n + 1)
    denominator = n * np.sum(wealth)
    if denominator == 0: return 0.0
    return (np.sum((2 * index - n - 1) * wealth)) / denominator

# --- Member Representation (Copied) ---
class SimMember:
    def __init__(self, member_id, initial_wealth, params):
        self.id = member_id
        self.wealth_scenario_A = max(0, initial_wealth)
        self.wealth_scenario_B = max(0, initial_wealth)
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

class EconomicMetrics:
    def __init__(self, members, params):
        self.members = members
        self.params = params
        self.previous_metrics = None  # Store previous metrics for trend analysis

    def calculate_metrics(self, wealth_A_list, wealth_B_list, week):
        # Basic wealth distribution analysis
        wealth_quintiles_A = np.percentile(wealth_A_list, [20, 40, 60, 80])
        wealth_quintiles_B = np.percentile(wealth_B_list, [20, 40, 60, 80])

        metrics = {
            'Week': week,
            'Year': week // 52 + 1,
            'Quarter': (week % 52) // 13 + 1,

            # Core Wealth Metrics
            'AvgWealth_A': np.mean(wealth_A_list),
            'AvgWealth_B': np.mean(wealth_B_list),
            'MedianWealth_A': np.median(wealth_A_list),
            'MedianWealth_B': np.median(wealth_B_list),
            'TotalWealth_A': np.sum(wealth_A_list),
            'TotalWealth_B': np.sum(wealth_B_list),

            # Wealth Distribution Metrics
            'WealthQuintiles_A': wealth_quintiles_A.tolist(),
            'WealthQuintiles_B': wealth_quintiles_B.tolist(),
            'Top10Percent_A': np.percentile(wealth_A_list, 90),
            'Top10Percent_B': np.percentile(wealth_B_list, 90),
            'Bottom10Percent_A': np.percentile(wealth_A_list, 10),
            'Bottom10Percent_B': np.percentile(wealth_B_list, 10),

            # Inequality Metrics
            'Gini_A': calculate_gini(wealth_A_list),
            'Gini_B': calculate_gini(wealth_B_list),
            'WealthGap_A': self.calculate_wealth_gap(wealth_A_list),
            'WealthGap_B': self.calculate_wealth_gap(wealth_B_list),

            # Economic Health Indicators
            'PovertyRate_A': self.calculate_poverty_rate(wealth_A_list),
            'PovertyRate_B': self.calculate_poverty_rate(wealth_B_list),
            'WealthMobility': self.calculate_wealth_mobility(),
            'LocalEconomyStrength': self.calculate_local_economy_strength(),
            'CommunityResilience': self.calculate_community_resilience(),

            # New Advanced Metrics
            'EconomicVelocity': self.calculate_economic_velocity(),
            'SocialSafetyNet': self.calculate_social_safety_net(),
            'InnovationIndex': self.calculate_innovation_index(),
            'SustainabilityScore': self.calculate_sustainability_score(),
            'CommunityEngagement': self.calculate_community_engagement()
        }

        # Calculate trends if we have previous metrics
        if self.previous_metrics:
            metrics.update(self.calculate_trends(metrics))

        self.previous_metrics = metrics.copy()
        return metrics

    def calculate_poverty_rate(self, wealth_list):
        poverty_line = self.params["WEEKLY_FOOD_BUDGET_AVG"] * 4  # Monthly food budget
        return np.mean([1 if w < poverty_line else 0 for w in wealth_list])

    def calculate_wealth_mobility(self):
        # Measure how easily members can improve their economic status
        return np.mean([m.grotoken_balance * self.params["GROTOKEN_USD_VALUE"] for m in self.members])

    def calculate_local_economy_strength(self):
        # Measure internal economic activity
        return np.mean([m.propensity_to_spend_internal for m in self.members])

    def calculate_community_resilience(self):
        # Composite score of economic health
        return (self.calculate_local_economy_strength() +
                (1 - np.mean([m.weekly_food_budget / m.weekly_income for m in self.members])))

    def calculate_wealth_gap(self, wealth_list):
        """Calculate the ratio between top 20% and bottom 20% wealth"""
        top_20 = np.mean(sorted(wealth_list)[-int(len(wealth_list)*0.2):])
        bottom_20 = np.mean(sorted(wealth_list)[:int(len(wealth_list)*0.2)])
        return top_20 / bottom_20 if bottom_20 > 0 else float('inf')

    def calculate_economic_velocity(self):
        """Measure the speed of wealth circulation in the community"""
        internal_spending = np.mean([m.propensity_to_spend_internal * m.weekly_food_budget
                                   for m in self.members])
        return internal_spending / self.params["WEEKLY_FOOD_BUDGET_AVG"]

    def calculate_social_safety_net(self):
        """Measure community's ability to support struggling members"""
        below_poverty = len([m for m in self.members
                           if m.wealth_scenario_B < self.params["WEEKLY_FOOD_BUDGET_AVG"] * 4])
        return 1 - (below_poverty / len(self.members))

    def calculate_innovation_index(self):
        """Measure community's capacity for economic innovation"""
        grotoken_adoption = np.mean([1 if m.grotoken_balance > 0 else 0 for m in self.members])
        local_production = self.calculate_local_economy_strength()
        return (grotoken_adoption + local_production) / 2

    def calculate_sustainability_score(self):
        """Measure long-term economic sustainability"""
        wealth_stability = 1 - np.std([m.wealth_scenario_B for m in self.members]) / \
                          np.mean([m.wealth_scenario_B for m in self.members])
        return (wealth_stability + self.calculate_community_resilience()) / 2

    def calculate_community_engagement(self):
        """Measure level of participation in community economic activities"""
        return np.mean([m.propensity_to_spend_internal for m in self.members])

    def calculate_trends(self, current_metrics):
        """Calculate week-over-week trends for key metrics"""
        trends = {}
        for key in ['AvgWealth_B', 'Gini_B', 'PovertyRate_B', 'LocalEconomyStrength']:
            if key in self.previous_metrics:
                prev_value = self.previous_metrics[key]
                current_value = current_metrics[key]
                trends[f'{key}_Trend'] = ((current_value - prev_value) / prev_value
                                        if prev_value != 0 else 0)
        return trends

    def calculate_advanced_metrics(self):
        return {
            'MarketEfficiency': self.calculate_market_efficiency(),
            'InnovationAdoption': self.calculate_innovation_adoption(),
            'WealthMobilityScore': self.calculate_wealth_mobility_score(),
            'EconomicDiversity': self.calculate_economic_diversity(),
            'RiskResilience': self.calculate_risk_resilience()
        }

    def calculate_market_efficiency(self):
        """Measure how effectively resources are distributed"""
        internal_transactions = sum(m.internal_transaction_count for m in self.members)
        return internal_transactions / (len(self.members) * self.current_week)

    def calculate_innovation_adoption(self):
        """Track adoption of new economic mechanisms"""
        return np.mean([m.grotoken_usage_rate for m in self.members])

    def simulate_economic_shock(self, shock_type, magnitude, duration):
        """Test community resilience against economic shocks"""
        if shock_type == 'income_reduction':
            for member in self.members:
                member.weekly_income *= (1 - magnitude)
        elif shock_type == 'cost_increase':
            for member in self.members:
                member.weekly_food_budget *= (1 + magnitude)

        shock_metrics = self.run_simulation_period(duration)
        recovery_metrics = self.calculate_recovery_metrics()

        return {
            'shock_impact': shock_metrics,
            'recovery_rate': recovery_metrics['recovery_rate'],
            'resilience_score': recovery_metrics['resilience_score']
        }

# --- Core Simulation Function (Copied & Adapted) ---
def run_simulation(params):
    """ Runs the economic comparison simulation with given parameters. """
    app.logger.info(f"--- Running Simulation with params: {params.get('description', 'Custom Params')} ---")

    # Use provided params, falling back to defaults if key is missing
    sim_params = DEFAULT_PARAMS.copy()
    sim_params.update(params) # Overwrite defaults with provided params

    # --- Simulation Setup ---
    try:
        initial_wealths = np.random.lognormal(
            mean=sim_params["INITIAL_WEALTH_MEAN_LOG"],
            sigma=sim_params["INITIAL_WEALTH_SIGMA_LOG"],
            size=int(sim_params["NUM_MEMBERS"]) # Ensure integer
        )
        members = [SimMember(f"M_{i}", wealth, sim_params) for i, wealth in enumerate(initial_wealths)]
        metrics = EconomicMetrics(members, sim_params)
        simulation_history = []
        key_events = []  # Track significant economic events
        app.logger.info(f"Initialized {len(members)} members.")
    except Exception as e:
        app.logger.error(f"Error during simulation setup: {e}", exc_info=True)
        raise ValueError(f"Error during simulation setup: {e}")


    # --- Simulation Loop ---
    for week in range(int(sim_params["SIMULATION_WEEKS"])): # Ensure integer
        current_wealth_A_list = []
        current_wealth_B_list = []

        for member in members:
            try:
                # Add Income
                member.wealth_scenario_A += member.weekly_income
                member.food_usd_balance += member.weekly_income

                # Scenario A Spending
                actual_spending_A = min(member.weekly_food_budget, member.wealth_scenario_A)
                member.wealth_scenario_A = max(0, member.wealth_scenario_A - actual_spending_A)

                # Scenario B Spending Logic
                budget_to_spend = member.weekly_food_budget
                intended_spend_internal = budget_to_spend * member.propensity_to_spend_internal
                intended_spend_external = budget_to_spend * (1.0 - member.propensity_to_spend_internal)
                avg_internal_savings_rate = (sim_params["GROUP_BUY_SAVINGS_PERCENT"] + sim_params["LOCAL_PRODUCTION_SAVINGS_PERCENT"]) / 2
                effective_cost_internal = intended_spend_internal * (1.0 - avg_internal_savings_rate)
                effective_cost_external = intended_spend_external
                total_effective_cost = effective_cost_internal + effective_cost_external
                actual_total_spending_B = min(total_effective_cost, member.food_usd_balance)
                member.food_usd_balance = max(0, member.food_usd_balance - actual_total_spending_B)

                # Scenario B Co-op Fee
                actual_coop_fee = min(sim_params["WEEKLY_COOP_FEE_B"], member.food_usd_balance)
                member.food_usd_balance = max(0, member.food_usd_balance - actual_coop_fee)

                # Scenario B GroToken Rewards
                reward = max(0, random.gauss(sim_params["GROTOKEN_REWARD_PER_WEEK_AVG"],
                                             sim_params["GROTOKEN_REWARD_STDDEV"]))
                member.grotoken_balance += reward

                # Calculate current wealth snapshot for Scenario B
                current_wealth_B = member.food_usd_balance + (member.grotoken_balance * sim_params["GROTOKEN_USD_VALUE"])
                member.wealth_scenario_B = current_wealth_B

                current_wealth_A_list.append(member.wealth_scenario_A)
                current_wealth_B_list.append(current_wealth_B)
            except Exception as e:
                 app.logger.error(f"Error processing member {member.id} in week {week+1}: {e}", exc_info=True)
                 # Decide how to handle member processing error: skip member, stop sim?
                 # For now, log and continue
                 current_wealth_A_list.append(member.wealth_scenario_A) # Append last known state
                 current_wealth_B_list.append(member.wealth_scenario_B)

        # --- Record Weekly Metrics ---
        try:
            weekly_metrics = metrics.calculate_metrics(current_wealth_A_list, current_wealth_B_list, week)
            simulation_history.append(weekly_metrics)

            # Track significant events
            if week > 0:
                prev_metrics = simulation_history[-2]
                if (weekly_metrics['Gini_B'] < prev_metrics['Gini_B'] * 0.9):
                    key_events.append({
                        'week': week,
                        'type': 'equality_improvement',
                        'description': 'Significant reduction in wealth inequality'
                    })
                # Add more event detection...
        except Exception as e:
            app.logger.error(f"Error calculating metrics for week {week+1}: {e}", exc_info=True)
            # If metrics calculation fails, append NaNs or skip week?
            # For now, log and continue, potentially leading to missing data points

    app.logger.info("--- Simulation Loop Finished ---")

    # --- Prepare Results ---
    try:
        final_member_data = [{
            'ID': m.id,
            'Income': m.weekly_income,
            'Budget': m.weekly_food_budget,
            'Wealth_A': m.wealth_scenario_A,
            'Wealth_B': m.wealth_scenario_B,
            'FoodUSD_B': m.food_usd_balance,
            'GroToken_B': m.grotoken_balance
        } for m in members]
        final_members_df = pd.DataFrame(final_member_data)

        # Convert DataFrames to JSON-serializable format (list of records)
        results = {
            "history": simulation_history,
            "final_members": final_members_df.to_dict(orient='records'),
            "key_events": key_events,
            "summary": generate_narrative_summary(simulation_history, key_events)
        }
        return results
    except Exception as e:
        app.logger.error(f"Error preparing results: {e}", exc_info=True)
        raise ValueError(f"Error preparing results: {e}")

def generate_narrative_summary(history, events):
    """Generate a detailed narrative description of the simulation results"""
    first_period = history[0]
    last_period = history[-1]

    # Calculate key changes and trends
    wealth_change = (last_period['TotalWealth_B'] - first_period['TotalWealth_B']) / first_period['TotalWealth_B']
    inequality_change = last_period['Gini_B'] - first_period['Gini_B']
    poverty_trend = 'decreased' if last_period['PovertyRate_B'] < first_period['PovertyRate_B'] else 'increased'

    narrative = {
        "title": "Economic System Evolution Analysis",
        "overview": f"Over {len(history)} weeks, the community's economic system underwent significant transformation.",
        "key_findings": {
            "wealth_impact": {
                "summary": f"Total wealth {('grew' if wealth_change > 0 else 'declined')} by {abs(wealth_change)*100:.1f}%",
                "details": "Detailed wealth distribution analysis"
            },
            "equality_measures": {
                "summary": f"Wealth inequality {'decreased' if inequality_change < 0 else 'increased'} by {abs(inequality_change)*100:.1f}%",
                "gini": f"Gini coefficient moved from {first_period['Gini_B']:.2f} to {last_period['Gini_B']:.2f}"
            },
            "community_health": {
                "poverty": f"Poverty rate {poverty_trend} from {first_period['PovertyRate_B']*100:.1f}% to {last_period['PovertyRate_B']*100:.1f}%",
                "resilience": f"Community resilience index: {last_period['CommunityResilience']:.2f}",
                "sustainability": f"Economic sustainability score: {last_period['SustainabilityScore']:.2f}"
            }
        },
        "phase_analysis": analyze_economic_phases(history),
        "key_events": [e['description'] for e in events],
        "conclusion": generate_conclusion(history)
    }
    return narrative

def analyze_economic_phases(history):
    """Identify and analyze distinct economic phases during the simulation"""
    # Simplified implementation that just divides the simulation into beginning, middle, and end phases
    if len(history) < 3:
        return []

    phase_length = len(history) // 3

    phases = [
        {
            "period": f"Week 0 to {phase_length-1}",
            "type": "initial",
            "characteristics": "Initial economic adaptation phase"
        },
        {
            "period": f"Week {phase_length} to {2*phase_length-1}",
            "type": "development",
            "characteristics": "Economic development and stabilization"
        },
        {
            "period": f"Week {2*phase_length} to {len(history)-1}",
            "type": "maturity",
            "characteristics": "Economic maturity and long-term trends"
        }
    ]

    return phases

def generate_conclusion(history):
    last_period = history[-1]
    if last_period['Gini_B'] < history[0]['Gini_B']:
        return "The community's economic system has shown significant improvements in wealth equality, with a reduction in inequality and increased overall wealth."
    else:
        return "While the community's total wealth has increased, wealth inequality has persisted or worsened, indicating potential challenges in economic distribution."

# --- API Endpoint ---
@app.route('/run_simulation', methods=['POST'])
def handle_simulation():
    """ API endpoint to run the simulation with parameters from frontend. """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    params = request.get_json()
    app.logger.info(f"Received request with params: {params}")

    try:
        # Validate/sanitize params if necessary (e.g., check types, ranges)
        # For now, assume frontend sends valid numbers for keys defined in DEFAULT_PARAMS
        simulation_results = run_simulation(params)
        return jsonify(simulation_results)

    except ValueError as ve: # Catch specific errors from run_simulation
         app.logger.error(f"Simulation Value Error: {ve}", exc_info=True)
         return jsonify({"error": str(ve)}), 400 # Bad request if params cause setup/result error
    except Exception as e:
        app.logger.error(f"Unexpected error during simulation: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred during simulation."}), 500

@app.route('/get_current_metrics')
def get_current_metrics():
    """Get real-time metrics for frontend updates"""
    try:
        # This is a placeholder implementation since we don't have a current_simulation object
        # In a real implementation, you would maintain a simulation state
        return jsonify({
            'health_score': 0.75,
            'market_efficiency': 0.68,
            'resilience_score': 0.82,
            'detailed_metrics': {
                'velocity': 0.45,
                'inequality': 0.32,
                'growth_rate': 0.03,
                'innovation_score': 0.65
            },
            'trends': {
                'health_trend': 0.02,
                'efficiency_trend': 0.01,
                'resilience_trend': 0.03
            },
            'warnings': ['Moderate inequality detected'],
            'recommendations': ['Consider increasing internal spending']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/run_scenario', methods=['POST'])
def run_scenario():
    """Run a specific economic scenario"""
    scenario_data = request.json
    try:
        # This is a placeholder implementation
        # In a real implementation, you would have a ScenarioAnalysis class
        results = {
            'scenario_name': scenario_data.get('name', 'Custom Scenario'),
            'outcome': 'Simulation completed successfully',
            'metrics': {
                'final_wealth': 1250.45,
                'gini': 0.32,
                'poverty_rate': 0.15
            }
        }
        return jsonify({
            'scenario_results': results,
            'comparative_analysis': 'Scenario performed 15% better than baseline',
            'recommendations': ['Increase internal spending', 'Reduce inequality']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test_shock', methods=['POST'])
def test_shock():
    """Run economic shock test"""
    shock_params = request.json
    try:
        # This is a placeholder implementation
        # In a real implementation, you would have an EconomicShockTesting class
        results = {
            'shock_type': shock_params.get('type', 'income_reduction'),
            'magnitude': shock_params.get('magnitude', 0.2),
            'duration': shock_params.get('duration', 4),
            'impact': {
                'wealth_reduction': 0.15,
                'poverty_increase': 0.08,
                'recovery_time': 12
            }
        }
        return jsonify({
            'shock_results': results,
            'recovery_metrics': {
                'recovery_rate': 0.05,
                'resilience_score': 0.72
            },
            'recommendations': ['Build emergency reserves', 'Diversify income sources']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Basic HTML serving (for testing) ---
# In production, you'd serve the HTML file separately (e.g., via Nginx or another process)
# This allows running the backend and opening the HTML file locally for simple testing.
@app.route('/')
def serve_app():
    return send_from_directory('.', 'Cataclysm Studios Inc PMOVES Economy Simulation.HTML')

# --- Main Execution ---
if __name__ == '__main__':
    # Note: debug=True is helpful for development but should be False in production
    # Check if running in Docker
    in_docker = os.environ.get('DOCKER_CONTAINER', False)

    # Set debug mode based on environment
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    # Run the Flask app
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

