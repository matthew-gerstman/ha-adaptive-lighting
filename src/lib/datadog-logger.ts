import axios from 'axios';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warn';
  message: string;
  service: string;
  ddsource: string;
  ddtags: string;
  [key: string]: any;
}

class DatadogLogger {
  private apiKey: string;
  private site: string;
  private enabled: boolean;
  private buffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private maxBufferSize: number = 10;

  constructor() {
    this.apiKey = process.env.SECRET_DATADOG_API_KEY || process.env.DATADOG_API_KEY || '';
    this.site = process.env.SECRET_DATADOG_SITE || process.env.DATADOG_SITE || 'datadoghq.com';
    this.enabled = !!this.apiKey && process.env.DISABLE_DATADOG_LOGGING !== 'true';

    if (this.enabled) {
      // Auto-flush every 5 seconds
      this.flushInterval = setInterval(() => this.flush(), 5000);
    }
  }

  log(level: 'info' | 'error' | 'warn', message: string, metadata: Record<string, any> = {}): void {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'ha-cli',
      ddsource: 'ha-cli',
      ddtags: `env:production,source:ha-cli,level:${level}`,
      ...metadata
    };

    this.buffer.push(entry);

    // Flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  logAPICall(method: string, url: string, data?: any, response?: any, error?: string): void {
    const metadata: Record<string, any> = {
      api_method: method,
      api_url: url,
      command: process.argv[3] || 'unknown',
    };

    if (data) {
      metadata.request_data = JSON.stringify(data);
    }

    if (response) {
      metadata.response_status = 'success';
    }

    if (error) {
      metadata.error = error;
      this.log('error', `API Call Failed: ${method} ${url}`, metadata);
    } else {
      this.log('info', `API Call: ${method} ${url}`, metadata);
    }
  }

  async flush(): Promise<void> {
    if (!this.enabled || this.buffer.length === 0) return;

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      await axios.post(
        `https://http-intake.logs.${this.site}/api/v2/logs`,
        logs,
        {
          headers: {
            'DD-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
    } catch (error) {
      // Silently fail - don't break CLI if Datadog is down
      console.error('Failed to send logs to Datadog:', (error as Error).message);
    }
  }

  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }
}

export const datadogLogger = new DatadogLogger();

// Flush on exit
process.on('exit', () => {
  datadogLogger.flush();
});

process.on('SIGINT', async () => {
  await datadogLogger.shutdown();
  process.exit(0);
});
