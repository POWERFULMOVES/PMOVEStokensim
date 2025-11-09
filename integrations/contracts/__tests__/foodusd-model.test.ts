/**
 * FoodUSD Model Tests
 */

import { FoodUSDModel } from '../foodusd-model';

describe('FoodUSDModel', () => {
  let foodUSD: FoodUSDModel;

  beforeEach(() => {
    foodUSD = new FoodUSDModel({
      pegValue: 1.0,
      foodCategories: ['groceries', 'prepared_food', 'dining'],
    });
  });

  describe('initialization', () => {
    it('should initialize holders correctly', () => {
      const addresses = ['0xALICE', '0xBOB', '0xCHARLIE'];
      foodUSD.initializeHolders(addresses);

      for (const address of addresses) {
        const balance = foodUSD.balanceOf(address);
        expect(balance).toBe(0);
      }
    });
  });

  describe('minting and burning', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE']);
    });

    it('should mint tokens correctly', () => {
      foodUSD.mint('0xALICE', 100);

      expect(foodUSD.balanceOf('0xALICE')).toBe(100);
      expect(foodUSD.totalSupply()).toBe(100);
    });

    it('should burn tokens correctly', () => {
      foodUSD.mint('0xALICE', 100);
      foodUSD.burn('0xALICE', 40);

      expect(foodUSD.balanceOf('0xALICE')).toBe(60);
      expect(foodUSD.totalSupply()).toBe(60);
    });

    it('should fail to burn more than balance', () => {
      foodUSD.mint('0xALICE', 100);

      expect(() => {
        foodUSD.burn('0xALICE', 150);
      }).toThrow('Insufficient balance');
    });
  });

  describe('transfers', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE', '0xBOB']);
      foodUSD.mint('0xALICE', 100);
    });

    it('should transfer tokens between holders', () => {
      const success = foodUSD.transfer('0xALICE', '0xBOB', 60);

      expect(success).toBe(true);
      expect(foodUSD.balanceOf('0xALICE')).toBe(40);
      expect(foodUSD.balanceOf('0xBOB')).toBe(60);
    });

    it('should fail transfer with insufficient balance', () => {
      expect(() => {
        foodUSD.transfer('0xALICE', '0xBOB', 150);
      }).toThrow('Insufficient balance');
    });
  });

  describe('spending tracking', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE']);
      foodUSD.mint('0xALICE', 500);
    });

    it('should record spending by category', () => {
      foodUSD.recordSpending(1, '0xALICE', 'groceries', 50);
      foodUSD.recordSpending(1, '0xALICE', 'dining', 30);

      const stats = foodUSD.getStatistics();

      expect(stats.totalSpent).toBe(80);
      expect(stats.spendingByCategory.groceries).toBe(50);
      expect(stats.spendingByCategory.dining).toBe(30);
    });

    it('should process weekly spending across categories', () => {
      const spending = {
        groceries: 100,
        prepared_food: 50,
        dining: 30,
      };

      foodUSD.processWeeklySpending(1, '0xALICE', spending);

      const stats = foodUSD.getStatistics();

      expect(stats.totalSpent).toBe(180);
      expect(stats.spendingByCategory.groceries).toBe(100);
      expect(stats.spendingByCategory.prepared_food).toBe(50);
      expect(stats.spendingByCategory.dining).toBe(30);
    });

    it('should track spending by holder', () => {
      foodUSD.recordSpending(1, '0xALICE', 'groceries', 50);

      const holderSpending = foodUSD.getHolderSpending('0xALICE');

      expect(holderSpending.total).toBe(50);
      expect(holderSpending.byCategory.groceries).toBe(50);
    });

    it('should fail spending more than balance', () => {
      expect(() => {
        foodUSD.recordSpending(1, '0xALICE', 'groceries', 600);
      }).toThrow('Insufficient balance');
    });
  });

  describe('account funding', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE']);
    });

    it('should fund account correctly', () => {
      foodUSD.fundAccount('0xALICE', 150);

      expect(foodUSD.balanceOf('0xALICE')).toBe(150);
    });

    it('should fund multiple times', () => {
      foodUSD.fundAccount('0xALICE', 100);
      foodUSD.fundAccount('0xALICE', 50);

      expect(foodUSD.balanceOf('0xALICE')).toBe(150);
    });
  });

  describe('statistics', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE', '0xBOB', '0xCHARLIE']);

      // Fund and spend
      foodUSD.fundAccount('0xALICE', 200);
      foodUSD.fundAccount('0xBOB', 300);
      foodUSD.fundAccount('0xCHARLIE', 250);

      foodUSD.recordSpending(1, '0xALICE', 'groceries', 100);
      foodUSD.recordSpending(1, '0xBOB', 'dining', 50);
      foodUSD.recordSpending(1, '0xCHARLIE', 'prepared_food', 75);
    });

    it('should calculate correct statistics', () => {
      const stats = foodUSD.getStatistics();

      expect(stats.totalSupply).toBe(525); // 750 funded - 225 spent
      expect(stats.totalSpent).toBe(225);
      expect(stats.totalHolders).toBe(3);
      expect(stats.transactions).toBe(3);
      expect(stats.averageSpendingPerHolder).toBe(75); // 225 / 3
    });

    it('should track spending by category', () => {
      const stats = foodUSD.getStatistics();

      expect(stats.spendingByCategory.groceries).toBe(100);
      expect(stats.spendingByCategory.dining).toBe(50);
      expect(stats.spendingByCategory.prepared_food).toBe(75);
    });
  });

  describe('data export', () => {
    beforeEach(() => {
      foodUSD.initializeHolders(['0xALICE']);
      foodUSD.fundAccount('0xALICE', 200);
      foodUSD.recordSpending(1, '0xALICE', 'groceries', 50);
    });

    it('should export complete data', () => {
      const data = foodUSD.exportData();

      expect(data.totalSupply).toBe(150);
      expect(data.holders).toBeInstanceOf(Array);

      const alice = data.holders.find(h => h.address === '0xALICE');
      expect(alice).toBeDefined();
      expect(alice?.balance).toBe(150);
      expect(alice?.totalSpent).toBe(50);
    });
  });

  describe('peg stability', () => {
    it('should maintain 1:1 USD peg', () => {
      foodUSD.initializeHolders(['0xALICE']);
      foodUSD.mint('0xALICE', 100);

      const stats = foodUSD.getStatistics();

      expect(stats.totalSupply).toBe(100);
      // 1 FoodUSD = 1 USD
      expect(stats.totalSupply * 1.0).toBe(100);
    });
  });
});
