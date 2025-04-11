// Tooltip content for simulation metrics and parameters

export const metricTooltips = {
  // Wealth metrics
  totalWealth: "The total wealth of all community members in dollars. Higher values indicate a more prosperous community.",
  avgWealth: "The average (mean) wealth per community member in dollars. Higher values indicate greater prosperity per person.",
  medianWealth: "The middle value of wealth when all community members are ranked by wealth. Less affected by extreme values than average wealth.",
  wealthDifference: "The difference in total wealth between Scenario B (cooperative) and Scenario A (traditional). Shows the overall economic benefit of the cooperative model.",
  wealthDifferencePercent: "The percentage difference in total wealth between scenarios. Provides a normalized measure of the benefit.",
  
  // Inequality metrics
  gini: "A measure of wealth inequality ranging from 0 (perfect equality) to 1 (perfect inequality). Lower values indicate more equal wealth distribution.",
  giniDifference: "The difference in Gini coefficient between scenarios. Shows how much the cooperative model reduces inequality.",
  wealthGap: "The ratio between the wealth of the top 10% and bottom 10% of the community. Lower values indicate more equal wealth distribution.",
  povertyRate: "The percentage of community members with wealth below a poverty threshold. Lower values indicate fewer people in economic distress.",
  
  // Community metrics
  localEconomyStrength: "A measure of how much economic activity occurs within the community (0-1). Higher values indicate more internal economic activity and less wealth leakage.",
  wealthMobility: "A measure of how much wealth changes hands within the community. Higher values indicate more economic activity and opportunities.",
  communityResilience: "A composite metric measuring the community's ability to withstand economic shocks. Higher values indicate greater resilience.",
  
  // Validation metrics
  directionalCorrectness: "Whether the cooperative model outperforms the traditional model as expected. The most fundamental validation check.",
  inequalityReduction: "Whether the cooperative model reduces inequality as expected. Validates that the cooperative model promotes greater equality.",
  reasonableMagnitude: "Whether the benefit per member is within a reasonable range. Validates that the cooperative model provides meaningful but plausible benefits.",
  economicTheoryConsistency: "Whether the results align with economic theory, particularly during economic stress. Validates that the model captures key economic principles.",
  validationScore: "A composite score (0-100) based on multiple validation metrics. Provides an overall assessment of the reliability of the simulation results.",
  mathematicalConsistency: "Whether the actual wealth difference matches the mathematically expected difference within a scenario-specific threshold.",
  
  // Parameters
  numMembers: "The number of people in the community. Affects economies of scale and network effects.",
  simulationWeeks: "The duration of the simulation in weeks. Longer simulations show compounding effects over time.",
  weeklyIncomeAvg: "The average weekly income per community member in dollars. Higher values indicate a more affluent community.",
  weeklyFoodBudgetAvg: "The average weekly food budget per community member in dollars. A key spending category affected by cooperative mechanisms.",
  percentSpendInternalAvg: "The percentage of spending that occurs within the community. Higher values indicate more internal economic activity.",
  groupBuySavingsPercent: "The percentage savings from group buying activities. Higher values indicate more efficient group purchasing.",
  localProductionSavingsPercent: "The percentage savings from local production. Higher values indicate more efficient local production.",
  grotokenRewardPerWeekAvg: "The average number of GroTokens earned per member per week. Higher values indicate stronger community currency system.",
  grotokenUsdValue: "The value of one GroToken in US dollars. Higher values indicate a stronger community currency.",
  initialWealthSigmaLog: "A measure of initial wealth inequality. Higher values indicate greater initial inequality.",
  weeklyCoop: "The weekly fee paid by members in Scenario B to support cooperative infrastructure. Represents the cost of cooperation."
};

export const scenarioTooltips = {
  baselineComparison: "A standard comparison with moderate parameters. Good starting point for understanding the basic differences between models.",
  highInitialInequality: "Demonstrates how cooperative models can reduce inequality in communities with high initial wealth disparities.",
  economicDownturn: "Shows how cooperative models provide resilience during moderate economic downturns.",
  severeEconomicDownturn: "Demonstrates the substantial resilience benefits of cooperative models during severe economic crises.",
  smallRuralCommunity: "Shows how cooperative models can benefit small rural communities with moderate internal spending.",
  tinyRuralCommunity: "Demonstrates the benefits and limitations of cooperative models in very small communities.",
  urbanNeighborhood: "Shows how cooperative models can work in urban settings with lower internal spending.",
  largeUrbanCommunity: "Demonstrates the scale effects of cooperative models in large urban communities.",
  strongCooperation: "Shows the benefits of high levels of cooperation and strong local production.",
  minimalCooperation: "Demonstrates the limited benefits of minimal cooperation and weak local production.",
  strongCommunity: "Shows the substantial benefits of a strong community currency system.",
  longTermProjection: "Demonstrates the long-term effects of cooperative economics over a 5-year period.",
  extremeWealthInequality: "Shows how cooperative models can address extreme wealth inequality.",
  mixedEconomicConditions: "Combines high inequality with strong cooperation to demonstrate how these factors interact."
};
