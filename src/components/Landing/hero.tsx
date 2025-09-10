import { Button } from "../ui/button";
import Link from "next/link";
import { Github } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative w-full h-[calc(100vh-56px)]">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="container mx-auto flex h-full max-w-screen-lg flex-col items-center justify-center text-center">

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    The Modern C++ Playground
                </h1>

                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    Compile and run C++ code instantly in your browser. No setup required. A fast, clean, and powerful online editor for your coding needs.
                </p>

                <div className="mt-8 flex gap-4">
                    <Button size="lg" asChild>
                        <Link href="/code">Start Coding Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="https://github.com/your-repo" target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                        </Link>
                    </Button>
                </div>

                <div className="relative mt-12 w-full max-w-3xl rounded-xl shadow-2xl">
                    <div className="w-full h-11 rounded-t-lg bg-zinc-900 flex justify-start items-center space-x-1.5 px-4">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="bg-[#0d1117] border-t-0 w-full p-4 rounded-b-lg text-left font-mono text-sm">
                        <pre><code>
                            <span className="text-blue-400">#include</span> <span className="text-green-400">&lt;iostream&gt;</span>
                            {"\n"}
                            <span className="text-blue-400">int</span> <span className="text-yellow-300">main</span><span className="text-white">(){"{"}</span>
                            {"\n"}
                            {'  '} <span className="text-white">std::</span><span className="text-yellow-300">cout &lt;&lt;</span> <span className="text-green-400">"Hello, Professional World!"</span> <span className="text-yellow-300">&lt;&lt;</span> <span className="text-white">std::</span><span className="text-yellow-300">endl;</span>
                            {"\n"}
                            {'   '}<span className="text-purple-400">return</span> <span className="text-white">0;</span>
                            {"\n"}
                            <span className="text-white">{"}"}</span>
                        </code></pre>
                    </div>
                </div>
            </div>
        </section>
    );
}