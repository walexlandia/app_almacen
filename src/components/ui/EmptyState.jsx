export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 px-6 py-12 text-center">
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-[15px] font-medium text-ink-800">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
