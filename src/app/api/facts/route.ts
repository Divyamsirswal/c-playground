import path from "node:path"
import { promises as fs } from "node:fs";
import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const file = path.join(process.cwd(), "facts.json");
        const data = await fs.readFile(file, "utf-8");
        const facts = JSON.parse(data);
        const idx = randomInt(facts.length);
        const randFact = facts[idx];

        return NextResponse.json({ randFact });
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { error: "failed to load facts" },
            { status: 500 }
        )
    }
}