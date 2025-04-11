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

## Conclusion

The mathematical model provides a reasonable approximation of the benefits of cooperative economic models across a range of scenarios. While it has limitations, particularly for economic downturn scenarios and extreme community sizes, it provides valuable qualitative insights that can help users understand the potential benefits of cooperative economic models.
