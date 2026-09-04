import { useEffect, useRef, useState } from "react";
import { TerminalSquare, X } from "lucide-react";
import { BRAND } from "@/lib/site";

const HELP = [
  ["about", "About me"],
  ["projects", "My projects"],
  ["mods", "Minecraft mods"],
  ["skills", "Skills"],
  ["logs", "Development logs"],
  ["contact", "Contact"],
];

const RESPONSES: Record<string, string[]> = {
  about: ["Yuqii — Minecraft Developer • Builder • Technical Specialist.", "Java, Gradle, Git."],
  projects: ["Scroll to #projects, or run: open projects"],
  mods: ["Minecraft mod development with Java and Gradle."],
  skills: ["Java · Minecraft Modding · Gradle · Git · Crash/Log Analysis · PC Troubleshooting"],
  logs: ["Devlog posts live at #devlog."],
  contact: [`Discord: ${BRAND.discord}`],
  clear: [],
};

/** Optional Easter egg. Normal navigation never depends on it. */
export function Terminal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<string[]>([
    "visitor@yuqii:~$ help",
    ...HELP.map(([cmd = "", desc = ""]) => `  ${cmd.padEnd(12)}${desc}`),
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "`" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, open]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const output =
      cmd === "help"
        ? HELP.map(([c = "", d = ""]) => `  ${c.padEnd(12)}${d}`)
        : (RESPONSES[cmd] ?? [`command not found: ${cmd} — type 'help'`]);
    setLines((prev) => [...prev, `visitor@yuqii:~$ ${cmd}`, ...output]);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open terminal"
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-all hover:border-primary/50 hover:text-primary"
      >
        <TerminalSquare className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-[min(92vw,26rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="label-mono">visitor@yuqii</span>
            <button onClick={() => setOpen(false)} aria-label="Close terminal">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-muted-foreground">
            {lines.map((line, index) => (
              <pre key={index} className="whitespace-pre-wrap text-foreground/85">
                {line}
              </pre>
            ))}
            <div ref={endRef} />
          </div>
          <form
            className="flex items-center gap-2 border-t border-border px-4 py-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              run(value);
              setValue("");
            }}
          >
            <span className="font-mono text-xs text-primary">$</span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-label="Terminal command"
              placeholder="help"
              className="w-full bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>
      )}
    </>
  );
}
