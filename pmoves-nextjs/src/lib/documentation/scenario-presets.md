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

## Choosing a Preset

When choosing a preset, consider what aspect of cooperative economics you want to explore:

- For basic understanding: Baseline Comparison
- For inequality effects: High Initial Inequality or Extreme Wealth Inequality
- For economic resilience: Economic Downturn or Severe Economic Downturn
- For community size effects: Tiny Rural Community, Small Rural Community, Urban Neighborhood, or Large Urban Community
- For cooperation level effects: Minimal Cooperation, Baseline Comparison, or Strong Cooperation
- For community currency effects: Strong Community Currency
- For long-term effects: Long-Term Projection
- For combined effects: Mixed Economic Conditions

## Customizing Presets

All presets can be customized by adjusting the parameters after selecting the preset. This allows you to explore variations on the preset scenarios and understand how different parameters affect the outcomes.
