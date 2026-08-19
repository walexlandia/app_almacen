const variantes = {
  primary: "bg-brand-500 text-white active:bg-brand-600 disabled:bg-ink-200 disabled:text-ink-400",
  secondary: "bg-white text-ink-800 border border-ink-200 active:bg-ink-50",
  danger: "bg-red-50 text-red-600 border border-red-200 active:bg-red-100",
  ghost: "text-ink-600 active:bg-ink-100",
};

const tamanos = {
  md: "h-11 px-4 text-[15px]",
  lg: "h-13 px-5 text-base",
  sm: "h-9 px-3 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variantes[variant]} ${tamanos[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
