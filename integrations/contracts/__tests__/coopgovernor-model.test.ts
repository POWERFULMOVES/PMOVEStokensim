/**
 * CoopGovernor Governance Model Tests
 */

import { CoopGovernorModel } from '../coopgovernor-model';
import { GroVaultModel } from '../grovault-model';
import { GroTokenDistribution } from '../grotoken-model';

describe('CoopGovernorModel', () => {
  let groToken: GroTokenDistribution;
  let groVault: GroVaultModel;
  let governance: CoopGovernorModel;

  beforeEach(() => {
    groToken = new GroTokenDistribution({
      distributionMean: 0.5,
      distributionStd: 0.2,
      tokenValue: 2.0,
      participationRate: 1.0,
    });

    groVault = new GroVaultModel(groToken, {
      baseInterestRate: 0.02,
      lockBonusMultiplier: 0.5,
    });

    governance = new CoopGovernorModel(groVault, {
      votingPeriodWeeks: 2,
      proposalThreshold: 100,
      quorumPercentage: 0.1, // 10%
    });

    // Initialize holders and distribute tokens
    const addresses = Array.from({ length: 20 }, (_, i) => `0xMEMBER${i}`);
    groToken.initializeHolders(addresses);

    // Distribute tokens for several weeks
    for (let week = 1; week <= 20; week++) {
      groToken.distributeWeekly(week);
    }

    // Create locks for voting power
    for (let i = 0; i < 10; i++) {
      const address = `0xMEMBER${i}`;
      const balance = groToken.balanceOf(address);

      if (balance >= 5.0) {
        groVault.createLock(1, address, 5.0, 2);
      }
    }
  });

  describe('proposal creation', () => {
    it('should create proposal successfully', () => {
      const proposalId = governance.createProposal(
        1,
        '0xMEMBER0',
        'Increase food budget allocation',
        'budget'
      );

      expect(proposalId).toBe(1);

      const proposal = governance.getProposal(proposalId);
      expect(proposal).toBeDefined();
      expect(proposal?.proposer).toBe('0xMEMBER0');
      expect(proposal?.description).toBe('Increase food budget allocation');
      expect(proposal?.category).toBe('budget');
      expect(proposal?.status).toBe('active');
    });

    it('should increment proposal IDs', () => {
      const id1 = governance.createProposal(1, '0xMEMBER0', 'Proposal 1', 'general');
      const id2 = governance.createProposal(1, '0xMEMBER1', 'Proposal 2', 'general');

      expect(id2).toBe(id1 + 1);
    });

    it('should calculate correct voting deadline', () => {
      const proposalId = governance.createProposal(1, '0xMEMBER0', 'Test proposal', 'general');

      const proposal = governance.getProposal(proposalId);

      // Voting period is 2 weeks
      expect(proposal?.votingDeadline).toBe(1 + 2);
    });

    it('should fail without sufficient voting power', () => {
      const addressWithoutLock = '0xMEMBER15';

      expect(() => {
        governance.createProposal(1, addressWithoutLock, 'Proposal', 'general');
      }).toThrow('Insufficient voting power');
    });
  });

  describe('quadratic voting', () => {
    let proposalId: number;

    beforeEach(() => {
      proposalId = governance.createProposal(1, '0xMEMBER0', 'Test proposal', 'general');
    });

    it('should cast vote successfully', () => {
      const voter = '0xMEMBER1';
      const votingPower = groVault.getVotingPower(voter);

      if (votingPower > 0) {
        // Cast 2 votes (cost = 2^2 = 4)
        const success = governance.castVote(1, proposalId, voter, 2, true);

        expect(success).toBe(true);

        const proposal = governance.getProposal(proposalId);
        expect(proposal?.votesFor).toBe(2);
        expect(proposal?.voterCount).toBe(1);
      }
    });

    it('should enforce quadratic cost', () => {
      const voter = '0xMEMBER1';
      const votingPower = groVault.getVotingPower(voter);

      if (votingPower >= 16) {
        // 4 votes costs 16 voting power
        const success = governance.castVote(1, proposalId, voter, 4, true);
        expect(success).toBe(true);
      }
    });

    it('should fail with insufficient voting power for quadratic cost', () => {
      const voter = '0xMEMBER1';
      const votingPower = groVault.getVotingPower(voter);

      // Try to cast more votes than power allows
      const impossibleVotes = Math.ceil(Math.sqrt(votingPower)) + 10;

      expect(() => {
        governance.castVote(1, proposalId, voter, impossibleVotes, true);
      }).toThrow('Insufficient voting power');
    });

    it('should allow multiple votes from same voter on same proposal', () => {
      const voter = '0xMEMBER1';
      const votingPower = groVault.getVotingPower(voter);

      if (votingPower >= 5) {
        // First vote: 2 votes (cost 4)
        governance.castVote(1, proposalId, voter, 2, true);

        // Second vote: 1 more vote (total cost 4 + 1 = 5)
        const success = governance.castVote(1, proposalId, voter, 1, true);

        expect(success).toBe(true);

        const proposal = governance.getProposal(proposalId);
        expect(proposal?.votesFor).toBe(3);
        expect(proposal?.voterCount).toBe(1); // Still same voter
      }
    });

    it('should track for and against votes separately', () => {
      const voter1 = '0xMEMBER1';
      const voter2 = '0xMEMBER2';

      governance.castVote(1, proposalId, voter1, 3, true);  // For
      governance.castVote(1, proposalId, voter2, 2, false); // Against

      const proposal = governance.getProposal(proposalId);

      expect(proposal?.votesFor).toBe(3);
      expect(proposal?.votesAgainst).toBe(2);
      expect(proposal?.voterCount).toBe(2);
    });

    it('should fail voting after deadline', () => {
      const voter = '0xMEMBER1';

      expect(() => {
        // Week 10 is after deadline (1 + 2 = week 3)
        governance.castVote(10, proposalId, voter, 2, true);
      }).toThrow('Voting period has ended');
    });

    it('should fail voting on non-existent proposal', () => {
      const voter = '0xMEMBER1';

      expect(() => {
        governance.castVote(1, 999, voter, 2, true);
      }).toThrow('Proposal not found');
    });
  });

  describe('proposal execution', () => {
    let proposalId: number;

    beforeEach(() => {
      proposalId = governance.createProposal(1, '0xMEMBER0', 'Test proposal', 'general');
    });

    it('should execute proposal that passes with quorum', () => {
      // Get multiple voters to reach quorum
      for (let i = 1; i <= 8; i++) {
        const voter = `0xMEMBER${i}`;
        const power = groVault.getVotingPower(voter);

        if (power >= 4) {
          governance.castVote(2, proposalId, voter, 2, true);
        }
      }

      // Execute after voting period (week 1 + 2 = week 3)
      const result = governance.executeProposal(4, proposalId);

      expect(result.executed).toBe(true);
      expect(result.passed).toBe(true);

      const proposal = governance.getProposal(proposalId);
      expect(proposal?.status).toBe('executed');
    });

    it('should fail proposal without quorum', () => {
      // Only one voter
      governance.castVote(2, proposalId, '0xMEMBER1', 2, true);

      const result = governance.executeProposal(4, proposalId);

      expect(result.executed).toBe(true);
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('quorum');
    });

    it('should fail proposal with more against than for votes', () => {
      // More votes against
      governance.castVote(2, proposalId, '0xMEMBER1', 5, false);
      governance.castVote(2, proposalId, '0xMEMBER2', 5, false);
      governance.castVote(2, proposalId, '0xMEMBER3', 3, true);

      const result = governance.executeProposal(4, proposalId);

      expect(result.executed).toBe(true);
      expect(result.passed).toBe(false);
    });

    it('should fail execution before voting period ends', () => {
      expect(() => {
        // Try to execute at week 2 (voting ends at week 3)
        governance.executeProposal(2, proposalId);
      }).toThrow('Voting period not ended');
    });

    it('should fail execution of already executed proposal', () => {
      // Get votes and execute
      for (let i = 1; i <= 8; i++) {
        const voter = `0xMEMBER${i}`;
        governance.castVote(2, proposalId, voter, 2, true);
      }

      governance.executeProposal(4, proposalId);

      // Try to execute again
      expect(() => {
        governance.executeProposal(5, proposalId);
      }).toThrow('Proposal already executed');
    });
  });

  describe('democratic engagement analysis', () => {
    beforeEach(() => {
      // Create multiple proposals
      for (let i = 0; i < 5; i++) {
        const proposalId = governance.createProposal(
          1,
          '0xMEMBER0',
          `Proposal ${i}`,
          'general'
        );

        // Different voting patterns
        for (let j = 1; j <= 5 + i; j++) {
          const voter = `0xMEMBER${j}`;
          governance.castVote(2, proposalId, voter, 2, Math.random() > 0.5);
        }

        // Execute proposals
        governance.executeProposal(4, proposalId);
      }
    });

    it('should analyze voter turnout', () => {
      const engagement = governance.analyzeDemocraticEngagement();

      expect(engagement.voterTurnout).toBeGreaterThan(0);
      expect(engagement.voterTurnout).toBeLessThanOrEqual(1);
    });

    it('should analyze concentration of power', () => {
      const engagement = governance.analyzeDemocraticEngagement();

      expect(engagement.concentrationOfPower).toBeGreaterThanOrEqual(0);
      expect(engagement.concentrationOfPower).toBeLessThanOrEqual(1);
    });
  });

  describe('statistics', () => {
    beforeEach(() => {
      // Create and execute multiple proposals
      for (let i = 0; i < 10; i++) {
        const proposalId = governance.createProposal(
          1,
          '0xMEMBER0',
          `Proposal ${i}`,
          i % 2 === 0 ? 'budget' : 'general'
        );

        // Vote on some proposals
        if (i < 7) {
          for (let j = 1; j <= 8; j++) {
            const voter = `0xMEMBER${j}`;
            governance.castVote(2, proposalId, voter, 2, i % 3 !== 0);
          }

          governance.executeProposal(4, proposalId);
        }
      }
    });

    it('should calculate correct statistics', () => {
      const stats = governance.getStatistics();

      expect(stats.totalProposals).toBe(10);
      expect(stats.activeProposals).toBe(3); // 3 not executed
      expect(stats.executedProposals).toBe(7);
      expect(stats.passedProposals).toBeGreaterThan(0);
      expect(stats.failedProposals).toBeGreaterThanOrEqual(0);
      expect(stats.totalVotes).toBeGreaterThan(0);
      expect(stats.uniqueVoters).toBeGreaterThan(0);
      expect(stats.averageParticipationRate).toBeGreaterThan(0);
    });

    it('should track proposals by category', () => {
      const stats = governance.getStatistics();

      expect(stats.proposalsByCategory.budget).toBe(5);
      expect(stats.proposalsByCategory.general).toBe(5);
    });
  });

  describe('data export', () => {
    beforeEach(() => {
      const proposalId = governance.createProposal(1, '0xMEMBER0', 'Test', 'general');

      for (let i = 1; i <= 5; i++) {
        governance.castVote(2, proposalId, `0xMEMBER${i}`, 2, true);
      }

      governance.executeProposal(4, proposalId);
    });

    it('should export complete data', () => {
      const data = governance.exportData();

      expect(data.totalProposals).toBe(1);
      expect(data.proposals).toBeInstanceOf(Array);

      const proposal = data.proposals[0];
      expect(proposal.proposer).toBe('0xMEMBER0');
      expect(proposal.status).toBe('executed');
      expect(proposal.votesFor).toBeGreaterThan(0);
      expect(proposal.voterCount).toBe(5);
    });
  });
});
