import { cn } from "@/lib/utils";

/**
 * IMAGE REPLACEMENT
 * -----------------
 * Every image on the site goes through this component.
 * To use your own picture, either:
 *   1. Set the image URL for the matching key in Admin → Site Settings / project or devlog editor, or
 *   2. Pass a `src` directly (e.g. an imported file from src/assets).
 * Until a src exists, a labelled placeholder is shown with the correct aspect ratio.
 */
export function ImagePlaceholder({
  label,
  src,
  alt,
  className,
  ratio = "16 / 9",
  rounded = "rounded-2xl",
}: {
  label: string;
  src?: string | null;
  alt?: string;
  className?: string;
  ratio?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border bg-surface",
        rounded,
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? label}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid-backdrop absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className="font-mono text-[0.65rem] tracking-[0.25em] text-primary">
            {label}
          </span>
          <span className="max-w-[80%] font-mono text-[0.6rem] leading-relaxed text-muted-foreground">
            Replace this image later
          </span>
        </div>
      )}
    </div>
  );
}
