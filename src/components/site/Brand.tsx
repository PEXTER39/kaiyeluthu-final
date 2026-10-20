import { Link } from "@tanstack/react-router";
export const wordmarkUrl = "/images/wordmark.png";
export const iconUrl = "/images/icon-round.png";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <Link to="/" aria-label="Kaiyeluthu's Crash Course home" className="flex items-center gap-3">
      <img src={wordmarkUrl} alt="கையெழுத்து Kaiyeluthu" className={`${className} w-auto rounded-md border border-border`} width={604} height={206} />
    </Link>
  );
}

export function Pencil({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden>
      <polygon points="0,12 14,6 14,18" fill="#E9C99A" />
      <polygon points="0,12 5,10 5,14" fill="#1F3A93" />
      <rect x="14" y="6" width="88" height="12" fill="#E8A817" />
      <rect x="14" y="11" width="88" height="2" fill="#D19612" />
      <rect x="102" y="6" width="16" height="12" rx="2" fill="#F4A3B4" />
    </svg>
  );
}
