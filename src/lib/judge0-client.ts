class OptimizedJudge0Client {
    private static instance: OptimizedJudge0Client;
    private baseURL = 'https://ce.judge0.com';

    static getInstance(): OptimizedJudge0Client {
        if (!OptimizedJudge0Client.instance) {
            OptimizedJudge0Client.instance = new OptimizedJudge0Client();
        }
        return OptimizedJudge0Client.instance;
    }

    async submitCode(code: string, input: string) {
        return fetch(`${this.baseURL}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Keep-Alive': 'timeout=30, max=100'
            },
            body: JSON.stringify({
                source_code: code,
                language_id: 54,
                stdin: input,
                cpu_time_limit: 2,
                memory_limit: 128000,
                wall_time_limit: 5
            })
        });
    }

    async getResult(token: string) {
        return fetch(`${this.baseURL}/submissions/${token}`, {
            headers: {
                'Connection': 'keep-alive',
                'Keep-Alive': 'timeout=30, max=100'
            }
        });
    }
}

export const judge0Client = OptimizedJudge0Client.getInstance();
