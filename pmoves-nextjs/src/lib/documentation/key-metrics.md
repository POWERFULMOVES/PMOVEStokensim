# Key Metrics Documentation

## Overview

The PMOVES Token Simulator tracks numerous metrics to evaluate the performance of traditional (Scenario A) and cooperative (Scenario B) economic models. This document explains the key metrics and how to interpret them.

## Wealth Metrics

### Total Wealth

The total wealth in the community, measured in dollars.

**Interpretation:**
- Higher total wealth indicates a more prosperous community.
- The difference in total wealth between Scenario A and B shows the overall economic benefit of the cooperative model.
- The percentage difference (e.g., "Wealth Difference: $100,000 (10%)") provides a normalized measure of the benefit.

### Average Wealth

The average (mean) wealth per community member, measured in dollars.

**Interpretation:**
- Higher average wealth indicates greater prosperity per person.
- The difference between Scenario A and B shows the average benefit per person from the cooperative model.

### Median Wealth

The middle value of wealth when all community members are ranked by wealth, measured in dollars.

**Interpretation:**
- Median wealth is less affected by extreme values than average wealth.
- A median wealth closer to the average wealth indicates a more equal distribution.
- The difference between Scenario A and B shows the typical benefit for a "middle-class" community member.

## Inequality Metrics

### Gini Coefficient

A measure of wealth inequality ranging from 0 (perfect equality) to 1 (perfect inequality).

**Interpretation:**
- Lower Gini coefficients indicate more equal wealth distribution.
- The difference between Scenario A and B shows how much the cooperative model reduces inequality.
- Typical values:
  - Below 0.2: Very low inequality
  - 0.2-0.3: Low inequality
  - 0.3-0.4: Moderate inequality
  - 0.4-0.5: High inequality
  - Above 0.5: Very high inequality

### Wealth Gap

The ratio between the wealth of the top 10% and bottom 10% of the community.

**Interpretation:**
- Lower wealth gap indicates more equal wealth distribution.
- The difference between Scenario A and B shows how much the cooperative model reduces the gap between rich and poor.

### Poverty Rate

The percentage of community members with wealth below a poverty threshold (defined as less than 4 weeks of food budget).

**Interpretation:**
- Lower poverty rates indicate fewer people in economic distress.
- The difference between Scenario A and B shows how much the cooperative model reduces poverty.

## Community Metrics

### Local Economy Strength

A measure of how much economic activity occurs within the community, ranging from 0 to 1.

**Interpretation:**
- Higher values indicate more internal economic activity and less wealth leakage.
- Values typically correlate with the internal spending percentage but are also affected by other factors.

### Wealth Mobility

A measure of how much wealth changes hands within the community, indicating economic dynamism.

**Interpretation:**
- Higher values indicate more economic activity and opportunities.
- The cooperative model typically shows higher wealth mobility due to increased internal transactions.

### Community Resilience

A composite metric measuring the community's ability to withstand economic shocks.

**Interpretation:**
- Higher values indicate greater resilience to economic downturns.
- The cooperative model typically shows higher resilience, especially during economic stress.

## Trend Metrics

Several metrics include trend indicators (e.g., AvgWealth_B_Trend) that show the direction and magnitude of change in the final weeks of the simulation.

**Interpretation:**
- Positive values indicate improving conditions.
- Negative values indicate deteriorating conditions.
- Values near zero indicate stable conditions.
- These trends help predict future performance beyond the simulation period.

## Validation Metrics

The simulation includes several validation metrics to assess the reliability of the results:

### Directional Correctness

Whether the cooperative model outperforms the traditional model as expected.

**Interpretation:**
- "✅" indicates the cooperative model shows higher total wealth as expected.
- This is the most fundamental validation check.

### Inequality Reduction

Whether the cooperative model reduces inequality as expected.

**Interpretation:**
- "✅" indicates the cooperative model shows lower Gini coefficient as expected.
- This validates that the cooperative model promotes greater equality.

### Reasonable Magnitude

Whether the benefit per member is within a reasonable range.

**Interpretation:**
- "✅" indicates the benefit per member is above a minimum threshold and not unrealistically high.
- This validates that the cooperative model provides meaningful but plausible benefits.

### Economic Theory Consistency

Whether the results align with economic theory, particularly during economic stress.

**Interpretation:**
- "✅" indicates the results show expected patterns, such as greater benefits during economic downturns.
- This validates that the model captures key economic principles.

### Validation Score

A composite score (0-100) based on the above metrics and mathematical consistency.

**Interpretation:**
- 90-100: GOOD - High confidence in the results
- 70-89: ACCEPTABLE - Reasonable confidence in the results
- Below 70: POOR - Limited confidence in the results
- This provides an overall assessment of the reliability of the simulation results.

## Mathematical Consistency

Whether the actual wealth difference matches the mathematically expected difference within a scenario-specific threshold.

**Interpretation:**
- "✅ PASS" indicates the results are within the expected range.
- "❌ FAIL" indicates the results differ from expectations more than the threshold allows.
- The error percentage shows how much the actual result differs from expectations.
- The threshold varies by scenario type, with higher thresholds for more complex scenarios like economic downturns.

**Note:** Even scenarios that fail mathematical consistency checks may still provide valuable qualitative insights. The mathematical model has known limitations, particularly for economic downturn scenarios and extreme community sizes.
