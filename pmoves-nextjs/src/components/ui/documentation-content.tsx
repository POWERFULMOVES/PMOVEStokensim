import React from 'react';

// Documentation content as React components instead of Markdown files
export const overviewContent = `
# PMOVES Token Simulator Documentation

## Overview

The PMOVES Token Simulator is a tool for comparing traditional economic models with cooperative economic models. It allows users to explore how different parameters affect economic outcomes and to understand the potential benefits of cooperative economic approaches.

## Documentation Sections

1. Mathematical Model - Explains the mathematical model used in the simulator, including its strengths and limitations.
2. Scenario Presets - Describes the pre-configured scenarios available in the simulator.
3. Key Metrics - Explains the key metrics used to evaluate the simulation results.
4. Interpretation Guide - Provides guidance on how to interpret the simulation results.

## Getting Started

To get started with the simulator, select a preset scenario from the dropdown menu or adjust the parameters manually. Click the "Run Simulation" button to see the results.

The simulator will display the results in several formats:
- Summary metrics comparing the two economic scenarios
- Charts showing the evolution of key metrics over time
- Detailed analysis of the final state of the economy

## Key Concepts

### Traditional Economy (Scenario A)

The traditional economy represents a standard economic model where individuals spend money primarily outside their community. This leads to wealth leakage and limited community resilience.

### Cooperative Economy (Scenario B)

The cooperative economy represents a model where individuals spend a portion of their money within the community, participate in group buying and local production, and use a community currency (GroTokens). This leads to wealth retention, increased resilience, and reduced inequality.

### GroTokens

GroTokens are a community currency that rewards participation in the cooperative economy. They provide additional liquidity and help keep wealth within the community.
`;

export const mathematicalModelContent = `
# Mathematical Model Documentation

## Overview

This document explains the mathematical model used in the PMOVES Token Simulator, including its strengths, limitations, and how to interpret the results.

## Core Mathematical Model

The simulator compares two economic scenarios:

1. **Scenario A (Traditional Economy)**: Standard economic model where individuals spend money primarily outside their community.
2. **Scenario B (Cooperative Economy)**: Model where individuals spend a portion of their money within the community, participate in group buying, local production, and use a community currency (GroTokens).

### Key Benefit Mechanisms

The cooperative economy (Scenario B) provides benefits through several mechanisms:

1. **Group Buying**: Community members pool resources to purchase goods at lower prices.
   - Savings = Weekly Food Budget × Internal Spending % × Group Buy Savings %

2. **Local Production**: Community produces some goods locally, reducing costs and keeping money in the community.
   - Savings = Weekly Food Budget × Internal Spending % × Local Production Savings %

3. **Community Currency (GroTokens)**: Members receive GroTokens as rewards for community participation.
   - Value = GroToken Reward Per Week × GroToken USD Value

4. **Network Effects**: As more people participate in the cooperative economy, the benefits increase non-linearly.

### Adjustment Factors

The model includes several adjustment factors to account for different scenarios:

1. **Community Size Factor**: Adjusts benefits based on community size.
   - Tiny communities (1-20 members): Limited economies of scale but high cohesion
   - Small communities (21-50 members): Growing economies of scale
   - Medium communities (51-200 members): Strong economies of scale
   - Large communities (201-500 members): Peak economies of scale
   - Very large communities (501+ members): Some diminishing returns due to coordination costs

2. **Participation Factor**: Adjusts benefits based on the level of internal spending.
   - Higher internal spending creates stronger network effects

3. **Economic Stress Factor**: Adjusts benefits based on economic conditions.
   - Moderate stress: Enhanced benefits from cooperation
   - Severe stress: Significant benefits from cooperation
   - Critical stress: Essential survival mechanisms from cooperation

4. **Inequality Factor**: Adjusts benefits based on wealth inequality.
   - Higher inequality leads to greater benefits from cooperation

## Limitations of the Mathematical Model

While the model provides valuable insights, it has several limitations:

1. **Economic Downturn Scenarios**: The model tends to underestimate the benefits of cooperation during economic downturns. In real-world scenarios, the benefits of mutual aid and resource sharing during crises may be much greater than our model predicts.

2. **Community Size Effects**: The relationship between community size and cooperative benefits is complex and non-linear. Our model provides a reasonable approximation but may not capture all nuances, especially for very small or very large communities.

3. **Emergent Properties**: Cooperative economies develop emergent properties that arise from the interactions between members. These emergent behaviors are inherently difficult to predict mathematically.

4. **Long-Term Projections**: The model becomes less accurate for very long-term projections as small errors compound over time.

## Interpreting the Results

When interpreting the simulation results, consider the following:

1. **Directional Correctness**: Focus on whether the cooperative model outperforms the traditional model, rather than the exact magnitude of the difference.

2. **Qualitative Insights**: Pay attention to qualitative insights such as inequality reduction, poverty reduction, and community resilience.

3. **Scenario-Specific Insights**: Different scenarios highlight different aspects of the cooperative model. For example:
   - Economic downturn scenarios highlight the resilience benefits
   - Inequality scenarios highlight the equity benefits
   - Community size scenarios highlight the scale effects

4. **Validation Metrics**: The simulation includes several validation metrics to help assess the reliability of the results:
   - Directional correctness: Does the cooperative model outperform the traditional model?
   - Inequality reduction: Does the cooperative model reduce inequality?
   - Reasonable magnitude: Is the benefit per member reasonable?
   - Economic theory consistency: Do the results align with economic theory?
`;

export const scenarioPresetsContent = `
# Scenario Presets Documentation

## Overview

The PMOVES Token Simulator includes several pre-configured scenarios that highlight different aspects of cooperative economics. Each preset is designed to demonstrate specific benefits and challenges of cooperative models in different contexts.

## Available Presets

### Baseline Comparison

A standard comparison between traditional and cooperative economic models with moderate parameters. This preset provides a good starting point for understanding the basic differences between the two models.

**Key Parameters:**
- Community Size: 50 members
- Simulation Duration: 156 weeks (3 years)
- Weekly Income: $150
- Weekly Food Budget: $75
- Internal Spending: 60%
- Group Buy Savings: 15%
- Local Production Savings: 25%
- GroToken Reward: 0.5 per week
- GroToken Value: $2

**Mathematical Consistency:** High (typically within 10% of expected values)

### High Initial Inequality

Demonstrates how cooperative models can reduce inequality in communities with high initial wealth disparities.

**Key Parameters:**
- Initial Wealth Inequality: High (log sigma 1.2)
- Income Inequality: High (standard deviation $100)

**Mathematical Consistency:** High (typically within 5% of expected values)

### Economic Downturn

Shows how cooperative models provide resilience during moderate economic downturns.

**Key Parameters:**
- Weekly Income: $120 (reduced)
- Weekly Food Budget: $80 (increased relative to income)

**Mathematical Consistency:** Moderate (may show larger benefits than mathematically predicted)

**Note:** The cooperative model shows particularly strong benefits during economic downturns due to mutual aid and resource sharing mechanisms that are difficult to capture in simple mathematical models.

### Severe Economic Downturn

Demonstrates the substantial resilience benefits of cooperative models during severe economic crises.

**Key Parameters:**
- Weekly Income: $100 (severely reduced)
- Weekly Food Budget: $80 (high relative to income)

**Mathematical Consistency:** Low (typically shows much larger benefits than mathematically predicted)

**Note:** During severe economic downturns, the cooperative model provides essential survival mechanisms that create non-linear benefits not fully captured by our mathematical model.

### Small Rural Community

Shows how cooperative models can benefit small rural communities with moderate internal spending.

**Key Parameters:**
- Community Size: 50 members
- Internal Spending: 40% (moderate)

**Mathematical Consistency:** High (typically within 10% of expected values)

### Tiny Rural Community

Demonstrates the benefits and limitations of cooperative models in very small communities.

**Key Parameters:**
- Community Size: 20 members
- Internal Spending: 50%

**Mathematical Consistency:** Moderate (may show different benefits than mathematically predicted)

### Urban Neighborhood

Shows how cooperative models can work in urban settings with lower internal spending.

**Key Parameters:**
- Community Size: 200 members
- Weekly Income: $250 (higher)
- Weekly Food Budget: $120 (higher)
- Internal Spending: 30% (lower)

**Mathematical Consistency:** Moderate (may show larger benefits than mathematically predicted)

### Large Urban Community

Demonstrates the scale effects of cooperative models in large urban communities.

**Key Parameters:**
- Community Size: 500 members
- Weekly Income: $250 (higher)
- Weekly Food Budget: $120 (higher)
- Internal Spending: 30% (lower)

**Mathematical Consistency:** Moderate (may show different benefits than mathematically predicted)

### Strong Cooperation

Shows the benefits of high levels of cooperation and strong local production.

**Key Parameters:**
- Internal Spending: 70% (high)
- Group Buy Savings: 25% (high)
- Local Production Savings: 30% (high)

**Mathematical Consistency:** High (typically within 10% of expected values)

### Minimal Cooperation

Demonstrates the limited benefits of minimal cooperation and weak local production.

**Key Parameters:**
- Internal Spending: 20% (low)
- Group Buy Savings: 10% (low)
- Local Production Savings: 10% (low)

**Mathematical Consistency:** High (typically within 10% of expected values)

### Strong Community Currency

Shows the substantial benefits of a strong community currency system.

**Key Parameters:**
- GroToken Reward: 15 per week (high)
- GroToken Value: $3 (high)

**Mathematical Consistency:** High (typically within 10% of expected values)

### Long-Term Projection

Demonstrates the long-term effects of cooperative economics over a 5-year period.

**Key Parameters:**
- Simulation Duration: 260 weeks (5 years)

**Mathematical Consistency:** High (typically within 15% of expected values)

### Extreme Wealth Inequality

Shows how cooperative models can address extreme wealth inequality.

**Key Parameters:**
- Initial Wealth Inequality: Very High (log sigma 1.5)
- Income Inequality: Very High (standard deviation $150)
- Community Size: 100 members

**Mathematical Consistency:** High (typically within 10% of expected values)

### Mixed Economic Conditions

Combines high inequality with strong cooperation to demonstrate how these factors interact.

**Key Parameters:**
- Initial Wealth Inequality: High (log sigma 1.2)
- Internal Spending: 70% (high)
- Group Buy Savings: 25% (high)
- Local Production Savings: 30% (high)

**Mathematical Consistency:** High (typically within 15% of expected values)
`;

export const keyMetricsContent = `
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
`;

export const interpretationGuideContent = `
# Interpretation Guide

## Overview

This guide helps you interpret the results of the PMOVES Token Simulator and draw meaningful conclusions from the data. The simulator compares traditional economic models (Scenario A) with cooperative models (Scenario B) across various metrics and scenarios.

## General Interpretation Principles

1. **Focus on Directional Insights**: Pay more attention to whether the cooperative model improves outcomes rather than the exact magnitude of improvement.

2. **Consider Multiple Metrics**: No single metric tells the whole story. Look at wealth, inequality, and community metrics together.

3. **Context Matters**: Different scenarios highlight different aspects of cooperative economics. Economic downturns highlight resilience, while inequality scenarios highlight equity benefits.

4. **Time Dimension**: Look at how metrics evolve over time, not just the final values. Some benefits compound over time.

5. **Validation Metrics**: Check the validation metrics to assess the reliability of the results. High validation scores indicate more reliable insights.

## Interpreting Specific Scenarios

### Baseline Comparison

In the baseline scenario, look for:
- Moderate wealth improvements (typically 10-15%)
- Modest inequality reduction
- Stable community metrics

This scenario provides a good reference point for understanding the basic benefits of cooperative economics.

### Economic Downturn Scenarios

In economic downturn scenarios, pay special attention to:
- Substantially higher wealth in Scenario B (often 50-200% higher)
- Much lower poverty rates in Scenario B
- Significantly lower Gini coefficient in Scenario B
- Higher community resilience in Scenario B

**Note:** The mathematical model tends to underestimate benefits during economic downturns. The actual benefits of cooperation during crises may be even greater than shown.

### Inequality Scenarios

In high inequality scenarios, focus on:
- Reduced Gini coefficient in Scenario B
- Lower wealth gap in Scenario B
- Lower poverty rates in Scenario B
- More equal distribution of benefits across wealth quintiles

### Community Size Scenarios

When comparing different community sizes:
- Tiny communities (20 members) show modest benefits but high cohesion
- Small communities (50 members) show good benefits with strong cohesion
- Medium communities (200 members) show strong benefits from economies of scale
- Large communities (500+ members) show maximum economies of scale but may face coordination challenges

### Cooperation Level Scenarios

When comparing different levels of cooperation:
- Minimal cooperation (20% internal spending) shows limited but positive benefits
- Moderate cooperation (40-60% internal spending) shows substantial benefits
- Strong cooperation (70%+ internal spending) shows maximum benefits

### Community Currency Scenarios

In strong community currency scenarios, note:
- Substantially higher wealth in Scenario B
- Much lower inequality in Scenario B
- Higher community metrics across the board

## Common Patterns to Look For

### Wealth Retention

Cooperative economies retain more wealth within the community. Look for:
- Higher total and average wealth in Scenario B
- Stronger local economy metrics in Scenario B
- Higher wealth mobility in Scenario B

### Inequality Reduction

Cooperative economies tend to reduce inequality. Look for:
- Lower Gini coefficient in Scenario B
- Smaller wealth gap in Scenario B
- Lower poverty rates in Scenario B
- More equal distribution across wealth quintiles in Scenario B

### Resilience Benefits

Cooperative economies provide greater resilience during economic stress. Look for:
- Larger wealth differences during economic downturns
- Lower poverty rates in Scenario B, especially during downturns
- More stable wealth trends in Scenario B during stress periods

### Network Effects

Cooperative economies benefit from network effects. Look for:
- Increasing benefits as internal spending increases
- Increasing benefits as community size increases (up to a point)
- Compounding benefits over time

## Addressing Common Questions

### "Where does the additional wealth come from?"

The additional wealth in Scenario B comes from:
1. **Reduced Wealth Leakage**: Money stays in the community longer, creating more local economic activity.
2. **Efficiency Gains**: Group buying and local production reduce costs.
3. **Network Effects**: As more people participate, the benefits increase non-linearly.
4. **Resilience Mechanisms**: Mutual aid and resource sharing reduce losses during economic stress.

### "Are these results realistic?"

The simulation is based on established economic principles and reasonable assumptions. However:
- Some scenarios (particularly economic downturns) may show larger benefits than our mathematical model predicts.
- Real-world implementation would face practical challenges not fully captured in the simulation.
- The simulation focuses on economic aspects and doesn't model all social and political factors.

### "How would this work in practice?"

Implementing a cooperative economic model could involve:
- Local purchasing initiatives and "buy local" campaigns
- Community-owned businesses and cooperatives
- Group purchasing programs
- Local currencies or token systems
- Time banking and skill sharing networks
- Community investment funds
`;

// Documentation component that renders the content
interface DocumentationProps {
  content: string;
}

export function Documentation({ content }: DocumentationProps) {
  return (
    <div className="prose max-w-none">
      {content.split('\n').map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index}>{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index}>{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index}>{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={index}>{line.substring(2)}</li>;
        } else if (line.startsWith('**')) {
          return <strong key={index}>{line.substring(2, line.length - 2)}</strong>;
        } else if (line === '') {
          return <br key={index} />;
        } else {
          return <p key={index}>{line}</p>;
        }
      })}
    </div>
  );
}
