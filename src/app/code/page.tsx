"use client";

import { useRef, useState } from "react";
import { CodeXml, Terminal, Play, Bot, Zap, Loader2, CornerUpLeft } from "lucide-react";

import CodingArea from "@/components/Texteditor/coding-area";
import InputArea from "@/components/Texteditor/input-area";
import OutputArea from "@/components/Texteditor/output-area";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EditorRef, CodeExecutionResponse } from "@/types/editor";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function Code() {
    const router = useRouter();
    const codingAreaRef = useRef<EditorRef>(null);
    const inputAreaRef = useRef<EditorRef>(null);
    const outputAreaRef = useRef<EditorRef>(null);

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [isCached, setIsCached] = useState<boolean>(false);

    const handleRun = async (): Promise<void> => {
        try {
            const code = codingAreaRef.current?.getCode() || "";
            const input = inputAreaRef.current?.getCode() || "";

            if (!code.trim()) {
                outputAreaRef.current?.setCode("Error: Please enter some C++ code to run.");
                return;
            }

            setIsRunning(true);
            setExecutionTime(null);
            setIsCached(false);
            outputAreaRef.current?.setCode("Executing...");

            const response = await fetch('/api/run-cpp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, input })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const result: CodeExecutionResponse = await response.json();

            const serverTime = result.executionTime || 0;
            const wasCached = result.wasCached || false;

            setExecutionTime(serverTime);
            setIsCached(wasCached);

            let formattedOutput = "";
            if (result.error) {
                formattedOutput = `--- COMPILATION / RUNTIME ERROR ---\n\n${result.output}`;
            } else {
                formattedOutput = `--- OUTPUT ---\n\n${result.output || "(No output from program)"}`;
            }
            outputAreaRef.current?.setCode(formattedOutput);

        } catch (error) {
            outputAreaRef.current?.setCode(
                `--- CLIENT / NETWORK ERROR ---\n\n${error instanceof Error ? error.message : 'An unknown error occurred.'}`
            );
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-gray-100 font-sans">
            <main className="p-3">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full rounded-lg border border-gray-700 shadow-md"
                >
                    <ResizablePanel defaultSize={65}>
                        <div className="flex flex-col h-full">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 select-none">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2 hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition"
                                        aria-label="Back to Home"
                                        onClick={() => router.push("/")}
                                    >
                                        <CornerUpLeft className="h-5 w-5 text-gray-300" />
                                    </Button>
                                    <CodeXml className="h-5 w-5 text-blue-400" />
                                    <span className="font-semibold text-lg select-text">main.cpp</span>
                                </div>
                                <Button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 transition"
                                >
                                    {isRunning ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <Play className="mr-2 h-4 w-4" />
                                    )}
                                    Run
                                </Button>
                            </div>

                            <div className="flex-grow bg-gray-900 border border-gray-700 rounded-b-md overflow-hidden">
                                <CodingArea ref={codingAreaRef} />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="bg-gray-700" />

                    <ResizablePanel defaultSize={35}>
                        <ResizablePanelGroup direction="vertical" className="h-full">
                            <ResizablePanel defaultSize={40}>
                                <div className="flex flex-col h-full bg-gray-800 rounded-t-md border-b border-gray-700">
                                    <div className="flex items-center gap-2 p-3 border-b border-gray-700 select-none text-gray-300 font-semibold">
                                        <Terminal className="h-5 w-5 text-yellow-400" />
                                        <span>Input (stdin)</span>
                                    </div>
                                    <div className="flex-grow overflow-auto">
                                        <InputArea ref={inputAreaRef} />
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle className="bg-gray-700" />

                            <ResizablePanel defaultSize={60}>
                                <div className="flex flex-col h-full bg-gray-800 rounded-b-md border border-t-0 border-gray-700">
                                    <div className="flex items-center justify-between p-3 border-b border-gray-700 select-none">
                                        <div className="flex items-center gap-2 text-green-400 font-semibold">
                                            <Bot className="h-5 w-5" />
                                            <span>Output</span>
                                        </div>

                                        {executionTime !== null && (
                                            <Badge
                                                variant={isCached ? "secondary" : "default"}
                                                className="bg-gray-700 text-gray-200 flex items-center gap-1 px-3 py-1"
                                            >
                                                <Zap className="h-3 w-3 text-yellow-400" />
                                                {executionTime}ms {isCached ? "(Cached)" : ""}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex-grow overflow-auto font-mono p-3 text-gray-100 whitespace-pre-wrap bg-gray-900 rounded-b-md">
                                        <OutputArea ref={outputAreaRef} />
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}