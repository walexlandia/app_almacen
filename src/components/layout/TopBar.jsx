import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, subtitle, onBack, right }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b border-ink-200 bg-white/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="flex h-14 w-full items-center gap-2">
        {onBack !== null && (
          <button
            onClick={onBack ?? (() => navigate(-1))}
            aria-label="Volver"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-600 active:bg-ink-100"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-semibold leading-tight text-ink-900">{title}</h1>
          {subtitle && <p className="truncate text-xs text-ink-400">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
