/**
 * JSON Schema Validator for PMOVES Event Bus
 * Validates all event payloads against their schemas from contracts/schemas/
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs/promises';
import path from 'path';

interface TopicSchema {
  schema: string;
}

interface TopicsConfig {
  v: number;
  topics: Record<string, TopicSchema>;
}

export class SchemaValidator {
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();
  private topicsConfig: TopicsConfig | null = null;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      validateFormats: true,
    });
    addFormats(this.ajv);
  }

  /**
   * Load all schemas from contracts/topics.json and contracts/schemas/
   */
  async loadSchemas(projectRoot: string): Promise<void> {
    try {
      // Load topics configuration
      const topicsPath = path.join(projectRoot, 'contracts', 'topics.json');
      const topicsContent = await fs.readFile(topicsPath, 'utf-8');
      this.topicsConfig = JSON.parse(topicsContent);

      console.log(`[SchemaValidator] Loaded topics config v${this.topicsConfig.v}`);

      // Load each schema
      for (const [topic, config] of Object.entries(this.topicsConfig.topics)) {
        const schemaPath = path.join(projectRoot, 'contracts', config.schema);

        try {
          const schemaContent = await fs.readFile(schemaPath, 'utf-8');
          const schema = JSON.parse(schemaContent);

          // Add schema to Ajv
          this.ajv.addSchema(schema, topic);
          this.schemas.set(topic, schema);

          console.log(`[SchemaValidator] Loaded schema for topic: ${topic}`);
        } catch (error) {
          console.error(`[SchemaValidator] Failed to load schema for ${topic}:`, error);
        }
      }

      console.log(`[SchemaValidator] Loaded ${this.schemas.size} schemas`);
    } catch (error) {
      console.error('[SchemaValidator] Failed to load schemas:', error);
      throw error;
    }
  }

  /**
   * Validate an event payload against its topic schema
   */
  validate(topic: string, payload: any): { valid: boolean; errors?: any[] } {
    if (!this.schemas.has(topic)) {
      return {
        valid: false,
        errors: [{ message: `Unknown topic: ${topic}` }],
      };
    }

    const validate = this.ajv.getSchema(topic);
    if (!validate) {
      return {
        valid: false,
        errors: [{ message: `Schema not compiled for topic: ${topic}` }],
      };
    }

    const valid = validate(payload);

    return {
      valid: !!valid,
      errors: validate.errors ? [...validate.errors] : undefined,
    };
  }

  /**
   * Get all available topics
   */
  getAvailableTopics(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * Get schema for a specific topic
   */
  getSchema(topic: string): any {
    return this.schemas.get(topic);
  }

  /**
   * Check if a topic exists
   */
  hasTopic(topic: string): boolean {
    return this.schemas.has(topic);
  }
}

export default SchemaValidator;
