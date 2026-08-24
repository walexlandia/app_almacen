import { useState } from "react";
import { ScanLine, Zap, Keyboard } from "lucide-react";
import Sheet from "./Sheet";
import Button from "./Button";

// Simula la lectura de cámara (M1-01 / M2-01). La integración real con el
// lector de código de barra queda para feature/modulo2-lector-codigo;
// aquí se deja la interacción y el layout definidos para la demo de diseño.
export default function BarcodeScannerSheet({ open, onClose, onDetectado, productosDemo = [] }) {
  const [manual, setManual] = useState("");

  const simularLectura = () => {
    const opciones = productosDemo.length ? productosDemo : [{ codigoBarra: "7801234500000" }];
    const elegido = opciones[Math.floor(Math.random() * opciones.length)];
    onDetectado(elegido.codigoBarra);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Escanear código de barra">
      <div className="flex flex-col gap-4">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-ink-900">
          <div className="absolute inset-8 rounded-xl border-2 border-white/70" />
          <ScanLine size={40} className="animate-pulse text-white/70" />
          <span className="absolute bottom-3 text-xs text-white/60">Vista previa de cámara (simulada)</span>
        </div>

        <Button onClick={simularLectura} icon={Zap} className="w-full">
          Simular lectura de código
        </Button>

        <div className="flex items-center gap-2 text-xs text-ink-400">
          <div className="h-px flex-1 bg-ink-200" />
          o ingresa el código manualmente
          <div className="h-px flex-1 bg-ink-200" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manual.trim()) onDetectado(manual.trim());
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Keyboard
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            />
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Código de barra"
              inputMode="numeric"
              className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <Button type="submit" variant="secondary">
            Usar
          </Button>
        </form>
      </div>
    </Sheet>
  );
}

// prueba para git 
