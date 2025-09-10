interface CacheEntry {
    result: any;
    timestamp: number;
    hitCount: number;
}

class ExecutionCache {
    private cache = new Map<string, CacheEntry>();
    private maxSize = 200;
    private maxAge = 5 * 60 * 1000; 

    get(key: string): any | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.maxAge) {
            this.cache.delete(key);
            return null;
        }

        entry.hitCount++;
        if (entry.hitCount > 3) {
            entry.timestamp = Date.now(); 
        }

        return entry.result;
    }

    set(key: string, value: any): void {
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        this.cache.set(key, {
            result: value,
            timestamp: Date.now(),
            hitCount: 1
        });
    }

    private cleanup(): void {
        const now = Date.now();
        const entriesToDelete: string[] = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.maxAge) {
                entriesToDelete.push(key);
            }
        }

        if (this.cache.size - entriesToDelete.length >= this.maxSize) {
            const sortedEntries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].hitCount - b[1].hitCount)
                .slice(0, 50);

            entriesToDelete.push(...sortedEntries.map(([key]) => key));
        }

        entriesToDelete.forEach(key => this.cache.delete(key));
    }
}

export const executionCache = new ExecutionCache();
