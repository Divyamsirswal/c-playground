declare module 'cpp.js' {
    export function compile(code: string): Promise<any>;
    export function run(compiled: any, input?: string): Promise<{
        stdout?: string;
        stderr?: string;
        exitCode: number;
    }>;
}
