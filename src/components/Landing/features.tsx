import { Zap, CodeXml, Share2 } from "lucide-react";

const features = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Instant Compilation",
        description: "Go from code to output in milliseconds. Our backend is optimized for speed, so you never have to wait.",
    },
    {
        icon: <CodeXml className="h-8 w-8 text-primary" />,
        title: "Modern C++ Support",
        description: "Utilize the latest features of C++ with support for C++17 and C++20 standards, right out of the box.",
    },
    {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        title: "Shareable Snippets",
        description: "Easily share your code with others. Generate a unique link for your snippet to collaborate or ask for help.",
    },
]

export default function Features() {
    return (
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Everything You Need to Code
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            A fully-featured C++ environment designed for performance, learning, and collaboration.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="grid gap-4 text-center">
                            <div className="mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}