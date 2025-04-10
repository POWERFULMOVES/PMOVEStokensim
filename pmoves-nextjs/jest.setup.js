// This file is run before each test file
// It's useful for setting up global test environment

// Increase timeout for simulation tests
jest.setTimeout(30000);

// Mock localStorage for browser compatibility
if (typeof window === 'undefined') {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// Suppress console output during tests unless in verbose mode
if (!process.env.VERBOSE) {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    // Keep warnings and errors for debugging
    warn: console.warn,
    error: console.error,
  };
}
