/**
 * Smart Contract Event Listeners
 * Listens to events from PMOVES smart contracts and publishes to event bus
 */

import { ethers, Contract, EventFilter } from 'ethers';
import { EventBus } from '../event-bus/event-bus';

export interface ContractConfig {
  name: string;
  address: string;
  abi: any[];
  events: string[];
}

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  pollingInterval?: number;
  startBlock?: number;
}

export class ContractEventListener {
  private provider: ethers.Provider;
  private contracts: Map<string, Contract> = new Map();
  private eventBus: EventBus;
  private networkConfig: NetworkConfig;
  private listeners: Map<string, () => void> = new Map();

  constructor(eventBus: EventBus, networkConfig: NetworkConfig) {
    this.eventBus = eventBus;
    this.networkConfig = networkConfig;

    // Create provider
    this.provider = new ethers.JsonRpcProvider(
      networkConfig.rpcUrl,
      undefined,
      {
        polling: true,
        pollingInterval: networkConfig.pollingInterval || 5000,
      }
    );

    console.log(
      `[ContractListener] Connected to ${networkConfig.name} at ${networkConfig.rpcUrl}`
    );
  }

  /**
   * Add a contract to listen to
   */
  addContract(config: ContractConfig): void {
    const contract = new Contract(config.address, config.abi, this.provider);

    this.contracts.set(config.name, contract);

    console.log(
      `[ContractListener] Added contract ${config.name} at ${config.address}`
    );

    // Set up listeners for specified events
    config.events.forEach((eventName) => {
      this.setupEventListener(config.name, eventName, contract);
    });
  }

  /**
   * Set up listener for a specific event
   */
  private setupEventListener(
    contractName: string,
    eventName: string,
    contract: Contract
  ): void {
    const listenerKey = `${contractName}.${eventName}`;

    try {
      // Create event listener
      const listener = (...args: any[]) => {
        // Last argument is the event object
        const event = args[args.length - 1];

        // Parse event data
        const eventData = this.parseEventData(eventName, args.slice(0, -1), event);

        // Publish to event bus
        this.publishContractEvent(contractName, eventName, eventData, event);
      };

      contract.on(eventName, listener);

      // Store listener for cleanup
      this.listeners.set(listenerKey, () => {
        contract.off(eventName, listener);
      });

      console.log(
        `[ContractListener] Listening to ${contractName}.${eventName}`
      );
    } catch (error) {
      console.error(
        `[ContractListener] Failed to set up listener for ${contractName}.${eventName}:`,
        error
      );
    }
  }

  /**
   * Parse event data based on event name
   */
  private parseEventData(
    eventName: string,
    args: any[],
    event: any
  ): Record<string, any> {
    const data: Record<string, any> = {
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      logIndex: event.logIndex,
    };

    // Map event-specific data
    // This is a simplified version - in production, parse based on ABI
    switch (eventName) {
      case 'ContributionReceived':
        data.orderId = args[0]?.toString();
        data.contributor = args[1];
        data.amount = args[2]?.toString();
        data.newTotal = args[3]?.toString();
        break;

      case 'OrderExecuted':
        data.orderId = args[0]?.toString();
        data.supplier = args[1];
        data.totalSent = args[2]?.toString();
        break;

      case 'Transfer':
        data.from = args[0];
        data.to = args[1];
        data.value = args[2]?.toString();
        break;

      case 'OrderCreated':
        data.orderId = args[0]?.toString();
        data.creator = args[1];
        data.supplier = args[2];
        data.targetAmount = args[3]?.toString();
        data.deadline = args[4]?.toString();
        break;

      default:
        // Generic parsing
        args.forEach((arg, index) => {
          data[`arg${index}`] = arg?.toString();
        });
    }

    return data;
  }

  /**
   * Publish contract event to event bus
   */
  private async publishContractEvent(
    contractName: string,
    eventName: string,
    eventData: Record<string, any>,
    rawEvent: any
  ): Promise<void> {
    try {
      // Determine the appropriate topic based on contract and event
      const topic = this.mapEventToTopic(contractName, eventName);

      if (!topic) {
        console.warn(
          `[ContractListener] No topic mapping for ${contractName}.${eventName}`
        );
        return;
      }

      // Transform event data to match schema
      const transformedData = this.transformEventData(
        contractName,
        eventName,
        eventData
      );

      // Publish to event bus
      await this.eventBus.publish(
        topic,
        transformedData,
        `contract:${contractName}`,
        {
          contractName,
          eventName,
          blockNumber: rawEvent.blockNumber,
          transactionHash: rawEvent.transactionHash,
        }
      );

      console.log(
        `[ContractListener] Published ${contractName}.${eventName} to topic ${topic}`
      );
    } catch (error) {
      console.error(
        `[ContractListener] Failed to publish ${contractName}.${eventName}:`,
        error
      );
    }
  }

  /**
   * Map contract event to event bus topic
   */
  private mapEventToTopic(
    contractName: string,
    eventName: string
  ): string | null {
    const mapping: Record<string, string> = {
      'GroupPurchase.ContributionReceived':
        'finance.transactions.ingested.v1',
      'GroupPurchase.OrderExecuted': 'finance.transactions.ingested.v1',
      'GroupPurchase.OrderCreated': 'finance.transactions.ingested.v1',
      'GroToken.Transfer': 'finance.transactions.ingested.v1',
      'FoodUSD.Transfer': 'finance.transactions.ingested.v1',
      'GroVault.Deposit': 'finance.transactions.ingested.v1',
      'GroVault.Withdrawal': 'finance.transactions.ingested.v1',
    };

    return mapping[`${contractName}.${eventName}`] || null;
  }

  /**
   * Transform event data to match schema format
   */
  private transformEventData(
    contractName: string,
    eventName: string,
    eventData: Record<string, any>
  ): any {
    const namespace = `contract:${contractName.toLowerCase()}`;

    // Transform based on target schema
    // This is simplified - in production, map each event type properly
    const transaction = {
      id: `${eventData.transactionHash}-${eventData.logIndex}`,
      amount: parseFloat(eventData.amount || eventData.value || '0'),
      category: this.getCategoryForEvent(contractName, eventName),
      date: new Date().toISOString(),
      description: `${contractName} ${eventName}`,
      source: eventData.from || eventData.contributor || eventData.creator,
      destination: eventData.to || eventData.supplier,
    };

    return {
      namespace,
      transactions: [transaction],
      ingested_at: new Date().toISOString(),
    };
  }

  /**
   * Get category for contract event
   */
  private getCategoryForEvent(contractName: string, eventName: string): string {
    const categoryMap: Record<string, string> = {
      GroupPurchase: 'food',
      FoodUSD: 'food',
      GroToken: 'rewards',
      GroVault: 'savings',
    };

    return categoryMap[contractName] || 'other';
  }

  /**
   * Get historical events
   */
  async getHistoricalEvents(
    contractName: string,
    eventName: string,
    fromBlock: number,
    toBlock: number | 'latest'
  ): Promise<any[]> {
    const contract = this.contracts.get(contractName);

    if (!contract) {
      throw new Error(`Contract ${contractName} not found`);
    }

    try {
      const filter = contract.filters[eventName]();
      const events = await contract.queryFilter(filter, fromBlock, toBlock);

      console.log(
        `[ContractListener] Found ${events.length} historical ${contractName}.${eventName} events`
      );

      return events;
    } catch (error) {
      console.error(
        `[ContractListener] Failed to get historical events for ${contractName}.${eventName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Replay historical events
   */
  async replayHistoricalEvents(
    contractName: string,
    eventName: string,
    fromBlock: number,
    toBlock: number | 'latest'
  ): Promise<void> {
    const events = await this.getHistoricalEvents(
      contractName,
      eventName,
      fromBlock,
      toBlock
    );

    for (const event of events) {
      const contract = this.contracts.get(contractName);
      if (!contract) continue;

      // Parse event
      const parsedEvent = contract.interface.parseLog({
        topics: event.topics as string[],
        data: event.data,
      });

      if (!parsedEvent) continue;

      // Publish to event bus
      const eventData = this.parseEventData(
        eventName,
        parsedEvent.args.toArray(),
        event
      );

      await this.publishContractEvent(contractName, eventName, eventData, event);
    }

    console.log(
      `[ContractListener] Replayed ${events.length} events for ${contractName}.${eventName}`
    );
  }

  /**
   * Stop all listeners
   */
  async stop(): Promise<void> {
    console.log('[ContractListener] Stopping all listeners...');

    // Remove all event listeners
    for (const [key, removeListener] of this.listeners) {
      removeListener();
      console.log(`[ContractListener] Removed listener ${key}`);
    }

    this.listeners.clear();
    this.contracts.clear();

    console.log('[ContractListener] All listeners stopped');
  }
}

export default ContractEventListener;
