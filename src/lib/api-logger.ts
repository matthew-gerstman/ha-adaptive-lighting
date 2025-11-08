export interface APICall {
  timestamp: string;
  method: string;
  url: string;
  data?: any;
  response?: any;
  error?: string;
}

class APILogger {
  private calls: APICall[] = [];
  private enabled: boolean = false;

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  log(call: APICall): void {
    if (this.enabled) {
      this.calls.push(call);
    }
  }

  getCalls(): APICall[] {
    return this.calls;
  }

  clear(): void {
    this.calls = [];
  }

  summary(): string {
    return this.calls.map((call, i) => {
      const status = call.error ? '❌ ERROR' : '✅ SUCCESS';
      return `${i + 1}. [${call.timestamp}] ${call.method} ${call.url} - ${status}`;
    }).join('\n');
  }

  detailed(): string {
    return this.calls.map((call, i) => {
      let result = `\n${'='.repeat(80)}\nCall ${i + 1}: ${call.method} ${call.url}\nTimestamp: ${call.timestamp}\n`;
      
      if (call.data && Object.keys(call.data).length > 0) {
        result += `\nRequest Data:\n${JSON.stringify(call.data, null, 2)}\n`;
      }
      
      if (call.response) {
        result += `\nResponse:\n${JSON.stringify(call.response, null, 2)}\n`;
      }
      
      if (call.error) {
        result += `\nError: ${call.error}\n`;
      }
      
      return result;
    }).join('\n');
  }
}

export const apiLogger = new APILogger();
