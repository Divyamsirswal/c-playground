import Link from "next/link";
import { Button } from "../ui/button";

export default function CallToAction() {
    return (
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                        Ready to Start Coding?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Jump right into the editor and experience the fastest online C++ compiler. No sign-up required.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <Button size="lg" asChild>
                        <Link href="/code">Go to Playground</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}