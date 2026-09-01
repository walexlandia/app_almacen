import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { Keyboard, AlertTriangle, FlashlightOff, Flashlight, RefreshCcw } from "lucide-react";
import Sheet from "./Sheet";
import Button from "./Button";

// Lectura real de código de barra con la cámara del dispositivo (M2-01).
// Usa ZXing (getUserMedia) para que funcione tanto en el navegador (dev)
// como dentro del WebView de Capacitor una vez empaquetada la app.
// Si la cámara no está disponible o el usuario lo prefiere, siempre puede
// ingresar el código de forma manual.
export default function BarcodeScannerSheet({ open, onClose, onDetectado }) {
  const [manual, setManual] = useState("");
  const [modo, setModo] = useState("camara"); // "camara" | "manual"
  const [estado, setEstado] = useState("iniciando"); // iniciando | activo | error
  const [errorMsg, setErrorMsg] = useState("");
  const [linterna, setLinterna] = useState(false);
  const [linternaDisponible, setLinternaDisponible] = useState(false);

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);
  const controlsRef = useRef(null);
  const detectadoRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    // Reset de estado cada vez que se abre la hoja.
    detectadoRef.current = false;
    setModo("camara");
    setEstado("iniciando");
    setErrorMsg("");
    setManual("");
    setLinterna(false);

    let cancelado = false;
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    const iniciar = async () => {
      try {
        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: { ideal: "environment" } },
          },
          videoRef.current,
          (resultado, error) => {
            if (cancelado || detectadoRef.current) return;
            if (resultado) {
              detectadoRef.current = true;
              const texto = resultado.getText();
              if (navigator.vibrate) navigator.vibrate(80);
              controlsRef.current?.stop();
              onDetectado(texto);
            } else if (error && !(error instanceof NotFoundException)) {
              // Errores de decodificación frame a frame se ignoran; solo
              // interesan fallas reales de cámara (manejadas en el catch).
            }
          }
        );

        if (cancelado) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        streamRef.current = videoRef.current?.srcObject ?? null;
        setEstado("activo");

        const track = streamRef.current?.getVideoTracks?.()[0];
        const capacidades = track?.getCapabilities?.();
        setLinternaDisponible(Boolean(capacidades && "torch" in capacidades));
      } catch (err) {
        if (cancelado) return;
        setEstado("error");
        if (err?.name === "NotAllowedError") {
          setErrorMsg("Permiso de cámara denegado. Actívalo en los ajustes del dispositivo o ingresa el código manualmente.");
        } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
          setErrorMsg("No se encontró una cámara disponible en este dispositivo.");
        } else {
          setErrorMsg("No se pudo iniciar la cámara. Puedes ingresar el código manualmente.");
        }
        setModo("manual");
      }
    };

    iniciar();

    return () => {
      cancelado = true;
      try {
        controlsRef.current?.stop();
      } catch {
        // el stream puede ya estar detenido
      }
      streamRef.current?.getTracks?.().forEach((t) => t.stop());
      controlsRef.current = null;
      streamRef.current = null;
    };
  }, [open, onDetectado]);

  const alternarLinterna = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (!track) return;
    try {
      const nuevoValor = !linterna;
      await track.applyConstraints({ advanced: [{ torch: nuevoValor }] });
      setLinterna(nuevoValor);
    } catch {
      // Algunos dispositivos/navegadores no soportan controlar la linterna.
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manual.trim()) onDetectado(manual.trim());
  };

  return (
    <Sheet open={open} onClose={onClose} title="Escanear código de barra">
      <div className="flex flex-col gap-4">
        <div className="flex rounded-xl bg-ink-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setModo("camara")}
            className={`flex-1 rounded-lg py-2 transition-colors ${
              modo === "camara" ? "bg-white text-ink-900 shadow-sm" : "text-ink-400"
            }`}
          >
            Cámara
          </button>
          <button
            type="button"
            onClick={() => setModo("manual")}
            className={`flex-1 rounded-lg py-2 transition-colors ${
              modo === "manual" ? "bg-white text-ink-900 shadow-sm" : "text-ink-400"
            }`}
          >
            Ingresar código
          </button>
        </div>

        {modo === "camara" && (
          <div className="flex flex-col gap-3">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-ink-900">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
                playsInline
                autoPlay
              />
              {estado !== "error" && (
                <>
                  <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-white/70" />
                  <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-brand-400/90" />
                </>
              )}
              {estado === "iniciando" && (
                <span className="absolute bottom-3 text-xs text-white/70">Activando cámara…</span>
              )}
              {estado === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/95 px-6 text-center">
                  <AlertTriangle size={28} className="text-amber-400" />
                  <p className="text-xs text-white/80">{errorMsg}</p>
                </div>
              )}
              {estado === "activo" && linternaDisponible && (
                <button
                  type="button"
                  onClick={alternarLinterna}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/40 text-white active:bg-black/60"
                  aria-label="Linterna"
                >
                  {linterna ? <Flashlight size={18} /> : <FlashlightOff size={18} />}
                </button>
              )}
            </div>
            <p className="text-center text-xs text-ink-400">
              {estado === "activo"
                ? "Apunta la cámara al código de barra del producto"
                : estado === "iniciando"
                  ? "Solicitando acceso a la cámara…"
                  : "No se pudo usar la cámara"}
            </p>
            {estado === "error" && (
              <Button variant="secondary" icon={RefreshCcw} onClick={() => setModo("camara")} className="w-full">
                Reintentar
              </Button>
            )}
          </div>
        )}

        {modo === "manual" && (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            {errorMsg && estado === "error" && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="relative">
              <Keyboard
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
              />
              <input
                autoFocus
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Ej: 7801234567890"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!manual.trim()}>
              Usar este código
            </Button>
          </form>
        )}
      </div>
    </Sheet>
  );
}

// prueba para git 
