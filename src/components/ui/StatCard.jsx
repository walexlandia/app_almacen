export default function StatCard({ label, value, hint, tone = "default", icon: Icon }) {
  const tonos = {
    default: "bg-white border-ink-200",
    brand: "bg-brand-500 border-brand-500 text-white",
  };
  const esBrand = tone === "brand";

  return (
    <div className={`rounded-2xl border p-4 ${tonos[tone]}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${esBrand ? "text-brand-50" : "text-ink-400"}`}>{label}</span>
        {Icon && <Icon size={16} className={esBrand ? "text-brand-100" : "text-ink-300"} />}
      </div>
      <p className={`mt-1.5 text-2xl font-semibold ${esBrand ? "text-white" : "text-ink-900"}`}>{value}</p>
      {hint && <p className={`mt-0.5 text-xs ${esBrand ? "text-brand-100" : "text-ink-400"}`}>{hint}</p>}
    </div>
  );
}
