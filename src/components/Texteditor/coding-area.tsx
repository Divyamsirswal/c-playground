"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Editor from "@monaco-editor/react";
import { EditorRef } from "@/types/editor";

const CodingArea = forwardRef<EditorRef>((props, ref) => {
    const [code, setCode] = useState<string>("");

    useImperativeHandle(ref, () => ({
        getCode: (): string => code,
        setCode: (newCode: string): void => setCode(newCode)
    }));

    useEffect(() => {
        async function fetchFacts(): Promise<void> {
            try {
                const res = await fetch("/api/facts");
                if (!res.ok) throw new Error("Failed to fetch fact.");
                const formatted = `#include <bits/stdc++.h>
using namespace std;

#define FAST ios::sync_with_stdio(false); cin.tie(nullptr);

int main() {
    FAST; 
    
    // Write your code here

}
`;
                setCode(formatted);
            } catch (err) {
                console.error('Fetch facts error:', err);
                setCode("//Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\" << endl;\n    return 0;\n}");
            }
        }
        fetchFacts();
    }, []);

    const handleEditorChange = (value: string | undefined): void => {
        setCode(value ?? "");
    };

    return (
        <div className="w-full h-screen overflow-x-hidden">
            <Editor
                height="100%"
                defaultLanguage="cpp"
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    fontSize: 18,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
                    wordWrap: "on",
                    renderLineHighlight: "all",
                    lineNumbers: "on",
                    contextmenu: true,
                    folding: true,
                }}
            />
        </div>
    );
});

CodingArea.displayName = "CodingArea";
export default CodingArea;
