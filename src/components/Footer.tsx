import { BRAND } from "@/lib/site";

export function Footer({ discordUsername }: { discordUsername?: string }) {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-display text-lg font-semibold">{BRAND.name}</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{BRAND.tagline}</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            © {BRAND.year} {BRAND.name}
          </p>
        </div>
        <div className="font-mono text-xs">
          <p className="label-mono">Contact</p>
          <p className="mt-2 text-foreground">
            Discord: <span className="text-primary">{discordUsername ?? BRAND.discord}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
