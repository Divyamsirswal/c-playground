export interface EditorRef {
    getCode: () => string;
    setCode: (code: string) => void;
}

export interface CodeExecutionResponse {
    wasCached: boolean;
    executionTime: number;
    output: string;
    error: boolean;
    status?: string;
}
