import Link from "next/link";
import { Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Outlined 404 number with soft green bg circle */}
      <div className="relative mb-10">
        <div
          className="w-44 h-44 rounded-full flex items-center justify-center select-none"
          style={{ background: "var(--green-tint)" }}
          aria-hidden="true"
        >
          <span
            className="text-[clamp(72px,12vw,120px)] font-bold leading-none tracking-tight"
            style={{
              color: "var(--green-tint)",
              WebkitTextStroke: "2px var(--green)",
            }}
          >
            404
          </span>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold mb-3" style={{ color: "var(--fg-0)" }}>
        Page not found
      </h1>
      <p className="mb-10 max-w-sm text-base" style={{ color: "var(--fg-2)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
          <Home size={15} />
          Go home
        </Link>
        <Link href="/tools" className="tb-v2-btn">
          <Wrench size={15} />
          Browse tools
        </Link>
      </div>
    </div>
  );
}
