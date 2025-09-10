"use client";

import { useRef, useState } from "react";
import { CodeXml, Terminal, Play, Bot, Zap, Loader2 } from "lucide-react";

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

export default function Code() {
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
        <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">

            <main className=" p-2">
                <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
                    <ResizablePanel defaultSize={65}>
                        <div className="flex flex-col">
                            {/* Panel Header for Code Editor */}
                            <div className="flex items-center justify-between p-2 border-b">
                                <div className="flex items-center gap-2">
                                    <CodeXml className="h-5 w-5" />
                                    <span className="font-semibold">main.cpp</span>
                                </div>
                                <Button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    size="sm"
                                >
                                    {isRunning ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Play className="mr-2 h-4 w-4" />
                                    )}
                                    Run
                                </Button>
                            </div>
                            <div className="flex-grow">
                                <CodingArea ref={codingAreaRef} />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={40}>
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 p-2 border-b">
                                        <Terminal className="h-5 w-5" />
                                        <span className="font-semibold">Input (stdin)</span>
                                    </div>
                                    <div className="flex-grow">
                                        <InputArea ref={inputAreaRef} />
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={60}>
                                <div className="flex flex-col h-full">
                                    {/* Panel Header for Output */}
                                    <div className="flex items-center justify-between p-2 border-b">
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-5 w-5" />
                                            <span className="font-semibold">Output</span>
                                        </div>
                                        {/* Display execution metadata here */}
                                        {executionTime !== null && (
                                            <Badge variant={isCached ? "secondary" : "default"}>
                                                <Zap className="mr-1 h-3 w-3" />
                                                {executionTime}ms {isCached ? '(Cached)' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex-grow">
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