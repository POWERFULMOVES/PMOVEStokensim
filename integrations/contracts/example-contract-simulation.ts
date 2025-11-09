/**
 * Example Contract Simulation
 * Demonstrates all PMOVES contracts working together
 */

import { ContractCoordinator } from './contract-coordinator';

async function runContractSimulation() {
  console.log('=== PMOVES Contract Simulation Example ===\n');

  // 1. Initialize Contract Coordinator
  console.log('1. Initializing Contract Coordinator...\n');

  const coordinator = new ContractCoordinator({
    groToken: {
      distributionMean: 0.5,
      distributionStd: 0.2,
      tokenValue: 2.0,
      participationRate: 0.20,
    },
    foodUSD: {
      pegValue: 1.0,
      foodCategories: ['groceries', 'prepared_food', 'dining'],
    },
    groupPurchase: {
      savingsRate: 0.15, // 15% savings
      minimumParticipants: 5,
    },
    groVault: {
      baseInterestRate: 0.02, // 2% APR
      lockBonusMultiplier: 0.5,
    },
    governance: {
      votingPeriodWeeks: 2,
      proposalThreshold: 100,
    },
  });

  // 2. Initialize population
  console.log('2. Initializing population...\n');

  const addresses: string[] = [];

  for (let i = 0; i < 100; i++) {
    addresses.push(`0xMEMBER${i.toString().padStart(3, '0')}`);
  }

  const initialWealth = addresses.map(() => Math.random() * 10000 + 5000);

  coordinator.initialize({
    addresses,
    initialWealth,
  });

  // 3. Run 52-week simulation (1 year)
  console.log('3. Running 52-week simulation...\n');

  for (let week = 1; week <= 52; week++) {
    // Create household budgets
    const householdBudgets = new Map<
      string,
      { foodBudget: number; totalIncome: number }
    >();

    for (let i = 0; i < addresses.length; i++) {
      const income = 600 + Math.random() * 400; // $600-$1000/week
      const foodBudget = income * 0.15; // 15% on food

      householdBudgets.set(addresses[i], {
        foodBudget,
        totalIncome: income,
      });
    }

    // Process the week
    await coordinator.processWeek(week, householdBudgets);

    // Some members participate in group buying (every 4 weeks)
    if (week % 4 === 0) {
      // Create group order
      const creator = addresses[Math.floor(Math.random() * addresses.length)];
      const orderId = coordinator.createGroupOrder(
        week,
        creator,
        'groceries',
        500 // $500 target
      );

      console.log(`\n  Week ${week}: Group order ${orderId} created`);

      // Random members contribute
      const contributors = addresses
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      for (const contributor of contributors) {
        try {
          coordinator.contributeToOrder(
            week,
            orderId,
            contributor,
            Math.random() * 100 + 50 // $50-$150
          );
        } catch (error) {
          // Some may fail due to insufficient balance
        }
      }
    }

    // Some members stake tokens (every 8 weeks)
    if (week % 8 === 0) {
      const stakers = addresses.sort(() => Math.random() - 0.5).slice(0, 5);

      for (const staker of stakers) {
        const models = coordinator.getModels();
        const balance = models.groToken.balanceOf(staker);

        if (balance > 1.0) {
          // Stake half of tokens
          const stakeAmount = balance * 0.5;
          const duration = Math.floor(Math.random() * 3) + 1; // 1-4 years

          try {
            coordinator.stakeTokens(week, staker, stakeAmount, duration);
            console.log(
              `\n  Week ${week}: ${staker} staked ${stakeAmount.toFixed(
                2
              )} GRO for ${duration} years`
            );
          } catch (error) {
            // May fail if already has lock
          }
        }
      }
    }

    // Governance proposals (every 12 weeks)
    if (week % 12 === 0) {
      const proposer = addresses[Math.floor(Math.random() * addresses.length)];
      const proposalId = coordinator.createProposal(
        week,
        proposer,
        `Proposal for week ${week}: Increase food budget allocation`,
        'budget'
      );

      console.log(`\n  Week ${week}: Proposal ${proposalId} created`);

      // Members with staked tokens vote
      const models = coordinator.getModels();
      const activeLocks = models.groVault.getActiveLocks();

      for (const lock of activeLocks.slice(0, 15)) {
        const votingPower = models.groVault.getVotingPower(lock.address);

        if (votingPower > 0) {
          const support = Math.random() > 0.5;
          const votes = Math.floor(Math.random() * Math.sqrt(votingPower)) + 1;

          try {
            coordinator.vote(
              week,
              proposalId,
              lock.address,
              votes,
              support
            );
          } catch (error) {
            // May fail if insufficient voting power
          }
        }
      }

      // Execute proposal after voting period
      if (week >= 2) {
        try {
          const result = models.governance.executeProposal(
            week + 2,
            proposalId
          );
          console.log(
            `\n  Week ${week + 2}: Proposal ${proposalId} ${
              result.passed ? 'PASSED' : 'FAILED'
            }`
          );
        } catch (error) {
          // May fail if not ready
        }
      }
    }

    // Log progress every 13 weeks (quarter)
    if (week % 13 === 0) {
      console.log(`\n--- Quarter ${week / 13} Summary ---`);

      const stats = coordinator.getComprehensiveStats();

      console.log(`  GroToken:`);
      console.log(`    Total distributed: ${stats.groToken.totalDistributed.toFixed(2)} GRO`);
      console.log(`    Total value: $${stats.groToken.totalValue.toFixed(2)}`);

      console.log(`\n  FoodUSD:`);
      console.log(`    Total spent: $${stats.foodUSD.totalSpent.toFixed(2)}`);
      console.log(`    Transactions: ${stats.foodUSD.transactions}`);

      console.log(`\n  Group Buying:`);
      console.log(`    Total saved: $${stats.groupPurchase.totalSaved.toFixed(2)}`);
      console.log(`    Orders executed: ${stats.groupPurchase.executedOrders}`);

      console.log(`\n  Staking:`);
      console.log(`    Total locked: ${stats.staking.totalLocked.toFixed(2)} GRO`);
      console.log(`    Interest accrued: ${stats.staking.totalInterestAccrued.toFixed(4)} GRO`);

      console.log(`\n  Governance:`);
      console.log(`    Total proposals: ${stats.governance.totalProposals}`);
      console.log(`    Passed: ${stats.governance.passedProposals}`);
      console.log(
        `    Participation rate: ${(
          stats.governance.averageParticipationRate * 100
        ).toFixed(1)}%`
      );

      console.log(`\n  Overall:`);
      console.log(`    Total value locked: $${stats.summary.totalValueLocked.toFixed(2)}`);
      console.log(`    Total savings: $${stats.summary.totalSavingsGenerated.toFixed(2)}`);
      console.log(
        `    Participation rate: ${(
          stats.summary.participationRate * 100
        ).toFixed(1)}%`
      );
      console.log('\n');
    }
  }

  // 4. Final Analysis
  console.log('\n4. Final Analysis (52 weeks)...\n');

  const finalStats = coordinator.getComprehensiveStats();

  console.log('=== GroToken Distribution ===');
  console.log(`  Total supply: ${finalStats.groToken.totalSupply.toFixed(2)} GRO`);
  console.log(`  Total distributed: ${finalStats.groToken.totalDistributed.toFixed(2)} GRO`);
  console.log(`  Active participants: ${finalStats.groToken.activeParticipants}`);
  console.log(`  Total value: $${finalStats.groToken.totalValue.toFixed(2)}`);
  console.log(`  Average balance: ${finalStats.groToken.averageBalance.toFixed(4)} GRO`);

  console.log('\n=== FoodUSD Spending ===');
  console.log(`  Total spent: $${finalStats.foodUSD.totalSpent.toFixed(2)}`);
  console.log(`  Total transactions: ${finalStats.foodUSD.transactions}`);
  console.log(
    `  Average per holder: $${finalStats.foodUSD.averageSpendingPerHolder.toFixed(2)}`
  );

  console.log('\n=== Group Buying ===');
  console.log(`  Total orders: ${finalStats.groupPurchase.totalOrders}`);
  console.log(`  Executed: ${finalStats.groupPurchase.executedOrders}`);
  console.log(`  Total saved: $${finalStats.groupPurchase.totalSaved.toFixed(2)}`);
  console.log(
    `  Savings rate: ${(finalStats.groupPurchase.averageSavingsRate * 100).toFixed(1)}%`
  );

  const savingsValidation = coordinator
    .getModels()
    .groupPurchase.validateSavingsAssumption();

  console.log(`\n  Savings Assumption Validation:`);
  console.log(`    Assumed rate: ${(savingsValidation.assumedRate * 100).toFixed(1)}%`);
  console.log(`    Actual rate: ${(savingsValidation.actualRate * 100).toFixed(1)}%`);
  console.log(
    `    Within tolerance: ${savingsValidation.withinTolerance ? 'YES' : 'NO'}`
  );

  console.log('\n=== Staking (GroVault) ===');
  console.log(`  Total locked: ${finalStats.staking.totalLocked.toFixed(2)} GRO`);
  console.log(`  Active positions: ${finalStats.staking.activePositions}`);
  console.log(
    `  Total interest accrued: ${finalStats.staking.totalInterestAccrued.toFixed(4)} GRO`
  );
  console.log(
    `  Average lock duration: ${finalStats.staking.averageLockDuration.toFixed(1)} years`
  );
  console.log(`  Total voting power: ${finalStats.staking.totalVotingPower.toFixed(2)}`);
  console.log(`  Average APR: ${(finalStats.staking.averageAPR * 100).toFixed(2)}%`);

  console.log('\n=== Governance ===');
  console.log(`  Total proposals: ${finalStats.governance.totalProposals}`);
  console.log(`  Passed: ${finalStats.governance.passedProposals}`);
  console.log(`  Failed: ${finalStats.governance.failedProposals}`);
  console.log(`  Total votes cast: ${finalStats.governance.totalVotes}`);
  console.log(`  Unique voters: ${finalStats.governance.uniqueVoters}`);
  console.log(
    `  Average participation: ${(
      finalStats.governance.averageParticipationRate * 100
    ).toFixed(1)}%`
  );

  const engagement = coordinator
    .getModels()
    .governance.analyzeDemocraticEngagement();

  console.log(`\n  Democratic Engagement:`);
  console.log(`    Voter turnout: ${(engagement.voterTurnout * 100).toFixed(1)}%`);
  console.log(
    `    Concentration of power: ${(engagement.concentrationOfPower * 100).toFixed(1)}%`
  );

  // 5. Wealth Impact Analysis
  console.log('\n5. Wealth Impact Analysis...\n');

  // Sample a few members
  const sampleMembers = addresses.slice(0, 5);

  for (const member of sampleMembers) {
    const impact = coordinator.calculateWealthImpact(member);

    console.log(`${member}:`);
    console.log(`  GroToken value: $${impact.groTokenValue.toFixed(2)}`);
    console.log(`  Staking value: $${impact.stakingValue.toFixed(2)}`);
    console.log(`  Group buying savings: $${impact.groupBuyingSavings.toFixed(2)}`);
    console.log(`  Total impact: $${impact.totalImpact.toFixed(2)}`);
    console.log('');
  }

  // 6. Economy Comparison
  console.log('6. Traditional vs Token Economy...\n');

  const traditionalSpending = {
    groceries: 400 * 52,
    prepared_food: 150 * 52,
    dining: 100 * 52,
  };

  const comparison = coordinator.compareEconomies(traditionalSpending);

  console.log('Traditional Economy:');
  console.log(`  Total spending: $${comparison.traditional.totalSpending.toFixed(2)}`);

  console.log('\nToken Economy:');
  console.log(`  Total spending: $${comparison.tokenEconomy.totalSpending.toFixed(2)}`);
  console.log(`  Token value: $${comparison.tokenEconomy.tokenValue.toFixed(2)}`);
  console.log(`  Staking value: $${comparison.tokenEconomy.stakingValue.toFixed(2)}`);
  console.log(`  Group savings: $${comparison.tokenEconomy.groupSavings.toFixed(2)}`);
  console.log(`  Total benefit: $${comparison.tokenEconomy.totalBenefit.toFixed(2)}`);

  console.log('\nDifference:');
  console.log(`  Absolute: $${comparison.difference.absolute.toFixed(2)}`);
  console.log(`  Percentage: ${comparison.difference.percentage.toFixed(2)}%`);

  console.log('\n=== Simulation Complete ===');
}

// Run simulation
if (require.main === module) {
  runContractSimulation()
    .then(() => {
      console.log('\nSimulation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nSimulation failed:', error);
      process.exit(1);
    });
}

export default runContractSimulation;
