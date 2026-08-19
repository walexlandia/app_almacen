// Envoltorio que simula el viewport de un celular cuando se ve en un
// navegador de escritorio (para presentar el diseño). En un teléfono real,
// o ya empaquetada como APK con Capacitor, ocupa el 100% de la pantalla.
export default function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-ink-200 sm:flex sm:items-center sm:justify-center sm:py-6">
      <div className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col overflow-hidden bg-ink-50 sm:min-h-[880px] sm:rounded-[2.5rem] sm:border-8 sm:border-ink-900 sm:shadow-2xl">
        {children}
      </div>
    </div>
  );
}
