/**
 * FoodUSD Stablecoin Model
 * Tracks food spending through a stablecoin (1:1 with USD)
 */

export interface FoodUSDConfig {
  // Stablecoin properties
  pegValue: number; // 1.0 for 1:1 USD peg
  treasuryAddress: string;

  // Spending categories
  foodCategories: string[];

  // Minting/Burning
  allowUserMinting: boolean;
  requireTreasuryApproval: boolean;
}

export interface FoodUSDHolder {
  address: string;
  balance: number;
  totalMinted: number;
  totalBurned: number;
  totalSpent: number;
  spendingByCategory: Record<string, number>;
}

export interface SpendingTransaction {
  week: number;
  from: string;
  to: string;
  amount: number;
  category: string;
  description: string;
  timestamp: number;
}

export class FoodUSDModel {
  private config: FoodUSDConfig;
  private holders: Map<string, FoodUSDHolder> = new Map();
  private totalSupply: number = 0;
  private transactions: SpendingTransaction[] = [];
  private currentWeek: number = 0;

  constructor(config: Partial<FoodUSDConfig> = {}) {
    this.config = {
      pegValue: 1.0,
      treasuryAddress: '0xTREASURY',
      foodCategories: [
        'groceries',
        'prepared_food',
        'dining',
        'farmers_market',
        'food_delivery',
      ],
      allowUserMinting: false,
      requireTreasuryApproval: true,
      ...config,
    };
  }

  /**
   * Initialize holders
   */
  initializeHolders(addresses: string[]): void {
    for (const address of addresses) {
      this.holders.set(address, {
        address,
        balance: 0,
        totalMinted: 0,
        totalBurned: 0,
        totalSpent: 0,
        spendingByCategory: {},
      });
    }

    // Initialize treasury
    this.holders.set(this.config.treasuryAddress, {
      address: this.config.treasuryAddress,
      balance: 0,
      totalMinted: 0,
      totalBurned: 0,
      totalSpent: 0,
      spendingByCategory: {},
    });

    console.log(`[FoodUSD] Initialized ${addresses.length + 1} holders`);
  }

  /**
   * Mint FoodUSD tokens (treasury only)
   */
  mint(to: string, amount: number): boolean {
    const holder = this.holders.get(to);

    if (!holder) {
      throw new Error('Holder not found');
    }

    // Mint tokens
    holder.balance += amount;
    holder.totalMinted += amount;
    this.totalSupply += amount;

    console.log(`[FoodUSD] Minted ${amount} FUSD to ${to}`);

    return true;
  }

  /**
   * Burn FoodUSD tokens
   */
  burn(from: string, amount: number): boolean {
    const holder = this.holders.get(from);

    if (!holder || holder.balance < amount) {
      return false;
    }

    holder.balance -= amount;
    holder.totalBurned += amount;
    this.totalSupply -= amount;

    console.log(`[FoodUSD] Burned ${amount} FUSD from ${from}`);

    return true;
  }

  /**
   * Transfer FoodUSD between holders
   */
  transfer(from: string, to: string, amount: number): boolean {
    const fromHolder = this.holders.get(from);
    const toHolder = this.holders.get(to);

    if (!fromHolder || !toHolder || fromHolder.balance < amount) {
      return false;
    }

    fromHolder.balance -= amount;
    toHolder.balance += amount;

    return true;
  }

  /**
   * Record a food spending transaction
   */
  recordSpending(
    week: number,
    from: string,
    amount: number,
    category: string,
    description: string = ''
  ): SpendingTransaction {
    this.currentWeek = week;

    // Validate category
    if (!this.config.foodCategories.includes(category)) {
      throw new Error(`Invalid food category: ${category}`);
    }

    const holder = this.holders.get(from);

    if (!holder) {
      throw new Error('Holder not found');
    }

    // Update spending stats
    holder.totalSpent += amount;

    if (!holder.spendingByCategory[category]) {
      holder.spendingByCategory[category] = 0;
    }
    holder.spendingByCategory[category] += amount;

    // Burn tokens (spending removes from circulation)
    this.burn(from, amount);

    // Record transaction
    const transaction: SpendingTransaction = {
      week,
      from,
      to: 'food_vendor',
      amount,
      category,
      description,
      timestamp: Date.now(),
    };

    this.transactions.push(transaction);

    return transaction;
  }

  /**
   * Fund a holder's account for food spending
   */
  fundAccount(address: string, weeklyFoodBudget: number): void {
    this.mint(address, weeklyFoodBudget);
  }

  /**
   * Process weekly food spending for a holder
   */
  processWeeklySpending(
    week: number,
    address: string,
    spendingByCategory: Record<string, number>
  ): SpendingTransaction[] {
    const transactions: SpendingTransaction[] = [];

    for (const [category, amount] of Object.entries(spendingByCategory)) {
      if (amount > 0 && this.config.foodCategories.includes(category)) {
        const tx = this.recordSpending(
          week,
          address,
          amount,
          category,
          `Weekly ${category} spending`
        );

        transactions.push(tx);
      }
    }

    return transactions;
  }

  /**
   * Get balance for a holder
   */
  balanceOf(address: string): number {
    return this.holders.get(address)?.balance || 0;
  }

  /**
   * Get spending statistics for a holder
   */
  getHolderStats(address: string): {
    balance: number;
    totalSpent: number;
    spendingByCategory: Record<string, number>;
    averageWeeklySpending: number;
  } | null {
    const holder = this.holders.get(address);

    if (!holder) {
      return null;
    }

    const weeklyTransactions = this.transactions.filter(
      (tx) => tx.from === address
    );

    const averageWeeklySpending =
      this.currentWeek > 0
        ? holder.totalSpent / this.currentWeek
        : holder.totalSpent;

    return {
      balance: holder.balance,
      totalSpent: holder.totalSpent,
      spendingByCategory: { ...holder.spendingByCategory },
      averageWeeklySpending,
    };
  }

  /**
   * Get overall statistics
   */
  getStatistics(): {
    totalSupply: number;
    totalMinted: number;
    totalBurned: number;
    totalSpent: number;
    holders: number;
    transactions: number;
    spendingByCategory: Record<string, number>;
    averageSpendingPerHolder: number;
  } {
    const holders = Array.from(this.holders.values()).filter(
      (h) => h.address !== this.config.treasuryAddress
    );

    const totalMinted = holders.reduce((sum, h) => sum + h.totalMinted, 0);
    const totalBurned = holders.reduce((sum, h) => sum + h.totalBurned, 0);
    const totalSpent = holders.reduce((sum, h) => sum + h.totalSpent, 0);

    // Aggregate spending by category
    const spendingByCategory: Record<string, number> = {};

    for (const holder of holders) {
      for (const [category, amount] of Object.entries(
        holder.spendingByCategory
      )) {
        if (!spendingByCategory[category]) {
          spendingByCategory[category] = 0;
        }
        spendingByCategory[category] += amount;
      }
    }

    return {
      totalSupply: this.totalSupply,
      totalMinted,
      totalBurned,
      totalSpent,
      holders: holders.length,
      transactions: this.transactions.length,
      spendingByCategory,
      averageSpendingPerHolder: totalSpent / holders.length,
    };
  }

  /**
   * Get all transactions
   */
  getTransactions(filter?: {
    week?: number;
    from?: string;
    category?: string;
  }): SpendingTransaction[] {
    let filtered = [...this.transactions];

    if (filter) {
      if (filter.week !== undefined) {
        filtered = filtered.filter((tx) => tx.week === filter.week);
      }

      if (filter.from) {
        filtered = filtered.filter((tx) => tx.from === filter.from);
      }

      if (filter.category) {
        filtered = filtered.filter((tx) => tx.category === filter.category);
      }
    }

    return filtered;
  }

  /**
   * Compare traditional spending vs FoodUSD spending
   */
  compareSpending(
    traditionalSpending: Record<string, number>
  ): {
    traditional: number;
    foodUSD: number;
    difference: number;
    percentageDifference: number;
    categoryComparison: Record<
      string,
      { traditional: number; foodUSD: number; difference: number }
    >;
  } {
    const stats = this.getStatistics();

    const traditionalTotal = Object.values(traditionalSpending).reduce(
      (sum, amount) => sum + amount,
      0
    );

    const difference = stats.totalSpent - traditionalTotal;
    const percentageDifference =
      traditionalTotal > 0 ? (difference / traditionalTotal) * 100 : 0;

    // Category-level comparison
    const categoryComparison: Record<
      string,
      { traditional: number; foodUSD: number; difference: number }
    > = {};

    for (const category of this.config.foodCategories) {
      const trad = traditionalSpending[category] || 0;
      const fusd = stats.spendingByCategory[category] || 0;

      categoryComparison[category] = {
        traditional: trad,
        foodUSD: fusd,
        difference: fusd - trad,
      };
    }

    return {
      traditional: traditionalTotal,
      foodUSD: stats.totalSpent,
      difference,
      percentageDifference,
      categoryComparison,
    };
  }

  /**
   * Export data for analysis
   */
  exportData(): {
    config: FoodUSDConfig;
    holders: FoodUSDHolder[];
    transactions: SpendingTransaction[];
    statistics: ReturnType<typeof this.getStatistics>;
  } {
    return {
      config: this.config,
      holders: Array.from(this.holders.values()),
      transactions: [...this.transactions],
      statistics: this.getStatistics(),
    };
  }
}

export default FoodUSDModel;
