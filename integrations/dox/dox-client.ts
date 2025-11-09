/**
 * PMOVES-DoX API Client
 * Handles document intelligence, analysis, and insights generation
 */

import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

export interface DoXConfig {
  baseUrl: string;
  timeout: number;
  retryCount: number;
}

export interface UploadResponse {
  id: string;
  filename: string;
  type: string;
  status: string;
}

export interface QAResponse {
  question: string;
  answer: string;
  sources: Array<{
    page?: number;
    location?: string;
    confidence: number;
  }>;
  confidence: number;
}

export interface FinancialAnalysis {
  documentId: string;
  financialStatements: Array<{
    type: string; // 'income_statement' | 'balance_sheet' | 'cash_flow'
    data: Record<string, number>;
    confidence: number;
  }>;
  metrics: Record<string, number>;
  insights: string[];
}

export interface CHRResult {
  clusterId: string;
  clusters: Array<{
    id: number;
    documents: string[];
    centroid: number[];
    size: number;
  }>;
  metrics: {
    silhouette: number;
    inertia: number;
  };
}

export interface DashboardInfo {
  id: string;
  url: string;
  title: string;
  type: string;
  createdAt: string;
}

export class DoXClient {
  private client: AxiosInstance;
  private config: DoXConfig;

  constructor(config: Partial<DoXConfig>) {
    this.config = {
      baseUrl: 'http://dox:8000',
      timeout: 120000, // 2 minutes for large file processing
      retryCount: 3,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });

    // Add retry interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as any;

        if (!config.retryCount) {
          config.retryCount = 0;
        }

        if (config.retryCount < this.config.retryCount) {
          config.retryCount++;
          console.log(
            `[DoXClient] Retrying request (${config.retryCount}/${this.config.retryCount})`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, config.retryCount) * 1000)
          );

          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload a file for analysis
   */
  async upload(
    file: Buffer | string,
    filename: string,
    type: 'pdf' | 'csv' | 'xlsx' | 'xml' | 'json'
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file, filename);
      formData.append('type', type);

      const response = await this.client.post('/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      console.log(`[DoXClient] Uploaded ${filename} successfully`);

      return {
        id: response.data.id,
        filename: response.data.filename,
        type: response.data.type,
        status: response.data.status,
      };
    } catch (error) {
      console.error('[DoXClient] Upload failed:', error);
      throw error;
    }
  }

  /**
   * Ask a question about uploaded documents
   */
  async ask(
    documentIds: string | string[],
    question: string
  ): Promise<QAResponse> {
    try {
      const ids = Array.isArray(documentIds) ? documentIds : [documentIds];

      const response = await this.client.post('/ask', {
        document_ids: ids,
        question,
      });

      return {
        question,
        answer: response.data.answer,
        sources: response.data.sources || [],
        confidence: response.data.confidence || 0,
      };
    } catch (error) {
      console.error('[DoXClient] Q&A failed:', error);
      throw error;
    }
  }

  /**
   * Get financial statements from a document
   */
  async getFinancialStatements(
    documentId: string
  ): Promise<FinancialAnalysis> {
    try {
      const response = await this.client.get(
        `/analysis/financials/${documentId}`
      );

      return {
        documentId,
        financialStatements: response.data.statements || [],
        metrics: response.data.metrics || {},
        insights: response.data.insights || [],
      };
    } catch (error) {
      console.error('[DoXClient] Financial analysis failed:', error);
      throw error;
    }
  }

  /**
   * Extract facts from documents
   */
  async extractFacts(documentId: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/facts/${documentId}`);
      return response.data.facts || [];
    } catch (error) {
      console.error('[DoXClient] Fact extraction failed:', error);
      throw error;
    }
  }

  /**
   * Run CHR clustering on multiple documents
   */
  async runCHR(config: {
    documentIds: string[];
    kMeans: number;
    iterations: number;
  }): Promise<CHRResult> {
    try {
      const response = await this.client.post('/structure/chr', {
        document_ids: config.documentIds,
        k: config.kMeans,
        max_iterations: config.iterations,
      });

      return {
        clusterId: response.data.id,
        clusters: response.data.clusters || [],
        metrics: response.data.metrics || {},
      };
    } catch (error) {
      console.error('[DoXClient] CHR clustering failed:', error);
      throw error;
    }
  }

  /**
   * Generate a datavzrd dashboard
   */
  async generateDashboard(config: {
    documentIds?: string[];
    clusteringResult?: CHRResult;
    title: string;
    metrics?: string[];
  }): Promise<DashboardInfo> {
    try {
      const response = await this.client.post('/viz/datavzrd', {
        document_ids: config.documentIds || [],
        clustering_id: config.clusteringResult?.clusterId,
        title: config.title,
        metrics: config.metrics || [],
      });

      const dashboardUrl = `${this.config.baseUrl}:5173/${response.data.id}`;

      return {
        id: response.data.id,
        url: dashboardUrl,
        title: config.title,
        type: 'datavzrd',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[DoXClient] Dashboard generation failed:', error);
      throw error;
    }
  }

  /**
   * Search documents using vector search
   */
  async search(
    query: string,
    filters?: {
      type?: string;
      tags?: string[];
      limit?: number;
    }
  ): Promise<any[]> {
    try {
      const response = await this.client.post('/search', {
        query,
        type_filter: filters?.type,
        tags: filters?.tags || [],
        limit: filters?.limit || 10,
      });

      return response.data.results || [];
    } catch (error) {
      console.error('[DoXClient] Search failed:', error);
      throw error;
    }
  }

  /**
   * Extract tags using LangExtract
   */
  async extractTags(documentId: string, prompt?: string): Promise<string[]> {
    try {
      const response = await this.client.post('/extract/tags', {
        document_id: documentId,
        prompt: prompt || 'Extract key topics and categories',
      });

      return response.data.tags || [];
    } catch (error) {
      console.error('[DoXClient] Tag extraction failed:', error);
      throw error;
    }
  }

  /**
   * Export to POML (Microsoft Copilot format)
   */
  async exportToPOML(documentId: string): Promise<string> {
    try {
      const response = await this.client.post(`/export/poml/${documentId}`, {
        responseType: 'text',
      });

      return response.data;
    } catch (error) {
      console.error('[DoXClient] POML export failed:', error);
      throw error;
    }
  }

  /**
   * Convert document to another format
   */
  async convertDocument(
    documentId: string,
    format: 'txt' | 'docx' | 'pdf'
  ): Promise<Buffer> {
    try {
      const response = await this.client.post(
        `/convert/${documentId}`,
        {
          format,
        },
        {
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('[DoXClient] Conversion failed:', error);
      throw error;
    }
  }

  /**
   * Test connection to DoX
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      console.log('[DoXClient] Connection successful');
      return response.status === 200;
    } catch (error) {
      console.error('[DoXClient] Connection failed:', error);
      return false;
    }
  }
}

export default DoXClient;
