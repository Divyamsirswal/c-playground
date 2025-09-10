import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t px-10">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by ❤️
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} cppcode</p>
                    <Link href="https://github.com/your-repo" target="_blank" rel="noreferrer">
                        <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}