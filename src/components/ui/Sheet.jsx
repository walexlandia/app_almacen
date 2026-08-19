import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-ink-900/40" />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[430px] flex-col rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-ink-200" />
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-2">
          <h2 className="text-[17px] font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-ink-400 active:bg-ink-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
