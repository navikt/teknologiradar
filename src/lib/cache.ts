export class Cache<T> {
  loader: () => Promise<T>;
  onError?: (err: any) => void;
  fetchIntervalMs: number;

  lastValue?: T;
  lastLoadTime?: number;

  constructor({
    loader,
    onError,
    fetchIntervalMs,
  }: {
    loader: () => Promise<T>;
    onError?: (err: any) => void;
    fetchIntervalMs: number;
  }) {
    this.loader = loader;
    this.onError = onError;
    this.fetchIntervalMs = fetchIntervalMs;
  }

  async get(currentTime: number): Promise<T> {
    if (this.shouldRefreshCache(currentTime)) {
      await this.refreshCache(currentTime);
    }

    return this.lastValue!;
  }

  private shouldRefreshCache(currentTime: number) {
    if (!this.lastLoadTime || !this.lastValue) return true;
    return this.lastLoadTime + this.fetchIntervalMs < currentTime;
  }

  async refreshCache(currentTime: number) {
    this.lastLoadTime = currentTime;
    try {
      this.lastValue = await this.loader();
    } catch (err) {
      this.onError?.(err);
    }
  }
}
