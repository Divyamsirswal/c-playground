import { NextRequest, NextResponse } from 'next/server';

interface CodeExecutionRequest {
    code: string;
    input?: string;
}

interface Judge0Response {
    token?: string;
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    status?: {
        id: number;
        description: string;
    };
    message?: string;
}

interface ExecutionCacheData {
    output: string;
    error: boolean;
    status: string;
    executionTime: number;
}


const executionCache = new Map<string, ExecutionCacheData>();

export async function POST(request: NextRequest) {
    try {
        const { code, input }: CodeExecutionRequest = await request.json();

        const cacheKey = `${code.trim()}_${input || ''}`;
        if (executionCache.has(cacheKey)) {
            return NextResponse.json(executionCache.get(cacheKey));
        }

        console.log('🚀 Ultra-fast Judge0 execution starting...');
        const startTime = Date.now();

        const submitResponse = await fetch('https://ce.judge0.com/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
            body: JSON.stringify({
                source_code: code,
                language_id: 54,
                stdin: input || "",
                cpu_time_limit: 2,
                memory_limit: 128000,
                wall_time_limit: 5,
                enable_per_process_and_thread_time_limit: true,
                enable_per_process_and_thread_memory_limit: true
            })
        });

        if (!submitResponse.ok) {
            throw new Error(`Submit failed: ${submitResponse.status}`);
        }

        const submitResult: Judge0Response = await submitResponse.json();

        if (!submitResult.token) {
            throw new Error('No token received');
        }
        let attempts = 0;

        const smartDelays = [100, 150, 200, 300, 500, 800, 1000];
        const maxAttempts = 15;

        while (attempts < maxAttempts) {
            const delay = smartDelays[attempts] || 1000;

            if (attempts > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }


            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const resultResponse = await fetch(
                    `https://ce.judge0.com/submissions/${submitResult.token}`,
                    {
                        headers: {
                            'Connection': 'keep-alive',
                        },
                        signal: controller.signal
                    }
                );

                clearTimeout(timeoutId);


                if (!resultResponse.ok) {
                    throw new Error(`Poll failed: ${resultResponse.status}`);
                }

                const result: Judge0Response = await resultResponse.json();

                if (result.status && result.status.id !== 1 && result.status.id !== 2) {
                    const totalTime = Date.now() - startTime;

                    let output = "";
                    let isError = false;
                    const status = result.status.description || "Unknown";

                    switch (result.status.id) {
                        case 3:
                            output = result.stdout || "No output";
                            isError = false;
                            break;
                        case 6:
                            output = result.compile_output || "Compilation failed";
                            isError = true;
                            break;
                        case 5:
                            output = result.stderr || "Time limit exceeded";
                            isError = true;
                            break;
                        case 4:
                            output = result.stdout || result.stderr || "Wrong answer";
                            isError = true;
                            break;
                        default:
                            output = result.stdout || result.stderr || result.compile_output || "Unknown execution result";
                            isError = result.status.id !== 3;
                    }

                    const responseData = {
                        output,
                        error: isError,
                        status,
                        executionTime: totalTime
                    };

                    if (!isError || result.status.id === 6) {
                        executionCache.set(cacheKey, responseData);

                        if (executionCache.size > 100) {
                            const firstKey = executionCache.keys().next().value;
                            executionCache.delete(firstKey ?? "");
                        }
                    }

                    return NextResponse.json(responseData);
                }

                attempts++;

            } catch (fetchError) {
                attempts++;
                if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                    continue;
                }
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }

        const totalTime = Date.now() - startTime;

        return NextResponse.json({
            error: true,
            output: `Execution timeout - code took longer than ${maxAttempts} attempts (${totalTime}ms)`,
            status: "Timeout",
            executionTime: totalTime
        });

    } catch (error) {
        return NextResponse.json({
            error: true,
            output: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: "Server Error"
        });
    }
}
