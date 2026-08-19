export default function Field({ label, hint, error, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function inputClass(hasError) {
  return `h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
    hasError ? "border-red-300" : "border-ink-200"
  }`;
}
