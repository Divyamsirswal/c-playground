import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
    return (
        // Use <header> for semantics. Add a border for separation.
        <header className="sticky px-10 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                {/* Logo / Site Name */}
                <div>
                    <Link href="/" className="font-bold text-lg">
                        cppcode
                    </Link>
                </div>

                {/* Navigation Links & Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/learn/cpp">Learn C++</Link>
                    </Button>
                    <Button variant="default" asChild>
                        {/* asChild prop makes the Button render as its child (the Link) */}
                        {/* This is better for accessibility and SEO */}
                        <Link href="/code">Start Coding</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}