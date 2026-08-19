const tonos = {
  ok: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  neutral: "bg-ink-100 text-ink-600",
  brand: "bg-brand-50 text-brand-700",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tonos[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
