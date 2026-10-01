import { writeFile, readFile } from "node:fs/promises";
const target = new URL("../src/data/github.json", import.meta.url);
try {
    const response = await fetch("https://github.com/users/EliasArruda/contributions", {
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "EliasArruda-Portfolio" },
    });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const html = await response.text();
    const days = [];
    for (const match of html.matchAll(
        /<td\b([^>]*data-date="[^"]+"[^>]*)>[\s\S]*?<\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/g,
    )) {
        const attrs = match[1];
        const date = attrs.match(/data-date="([^"]+)"/)?.[1];
        const level = Number(attrs.match(/data-level="(\d)"/)?.[1]);
        const count = match[2].trim().startsWith("No ")
            ? 0
            : Number(
                  match[2]
                      .trim()
                      .match(/^[\d,]+/)?.[0]
                      .replaceAll(",", ""),
              );
        if (date && Number.isFinite(level) && Number.isFinite(count))
            days.push({ date, level, count });
    }
    days.sort((a, b) => a.date.localeCompare(b.date));
    if (days.length < 350 || new Set(days.map((d) => d.date)).size !== days.length)
        throw new Error("Invalid contribution calendar");
    const total = days.reduce((sum, day) => sum + day.count, 0);
    await writeFile(
        target,
        JSON.stringify(
            {
                user: "EliasArruda",
                source: "https://github.com/EliasArruda",
                updatedAt: new Date().toISOString(),
                total,
                days,
            },
            null,
            2,
        ) + "\n",
    );
    console.log(`GitHub: ${days.length} days, ${total} contributions.`);
} catch (error) {
    const cached = JSON.parse(await readFile(target, "utf8"));
    if (!cached.days?.length) throw error;
    console.warn(`Using saved GitHub data (${cached.updatedAt}): ${error.message}`);
}
