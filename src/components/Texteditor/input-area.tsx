"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import Editor from "@monaco-editor/react";
import { EditorRef } from "@/types/editor";

const InputArea = forwardRef<EditorRef>((props, ref) => {
    const [code, setCode] = useState<string>("");

    useImperativeHandle(ref, () => ({
        getCode: (): string => code,
        setCode: (newCode: string): void => setCode(newCode)
    }));

    const handleEditorChange = (value: string | undefined): void => {
        setCode(value ?? "");
    };

    return (
        <div className="w-full h-screen overflow-x-hidden">
            <Editor
                height="100%"
                defaultLanguage="text"
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
                    wordWrap: "on",
                    renderLineHighlight: "all",
                    lineNumbers: "off",
                    contextmenu: true,
                    folding: true,
                    mouseWheelZoom: true,
                }}
            />
        </div>
    );
});

InputArea.displayName = "InputArea";
export default InputArea;
