import { useState } from "react";
import { ventas, calcularTotalVenta, formatoCLP } from "../../../data/mockData";

const hoyISO = () => new Date().toISOString().slice(0, 10);

export default function VentasDelDiaPage() {
  const [fecha, setFecha] = useState(hoyISO());

  const ventasDelDia = ventas.filter((v) => v.fecha.slice(0, 10) === fecha);
  const completadas = ventasDelDia.filter((v) => v.estado === "completada");
  const anuladas = ventasDelDia.filter((v) => v.estado === "anulada");
  const totalDia = completadas.reduce((acc, v) => acc + calcularTotalVenta(v), 0);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-semibold text-ink-900">Ventas del día</h1>

      <label className="mt-3 block text-sm text-ink-600">
        Fecha
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-ink-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-ink-200 bg-white px-3 py-3 text-center">
          <p className="text-lg font-semibold text-ink-900">{completadas.length}</p>
          <p className="text-xs text-ink-500">Completadas</p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white px-3 py-3 text-center">
          <p className="text-lg font-semibold text-red-500">{anuladas.length}</p>
          <p className="text-xs text-ink-500">Anuladas</p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white px-3 py-3 text-center">
          <p className="text-lg font-semibold text-emerald-600">{formatoCLP(totalDia)}</p>
          <p className="text-xs text-ink-500">Total vendido</p>
        </div>
      </div>

      {ventasDelDia.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-400">
          No hay ventas registradas para esta fecha.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-ink-200 rounded-lg border border-ink-200 bg-white">
          {ventasDelDia.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-ink-900">
                  #{v.id} · {v.vendedor}
                </p>
                <p className="text-xs text-ink-500">
                  {v.metodoPago} ·{" "}
                  {new Date(v.fecha).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-semibold ${
                    v.estado === "anulada" ? "text-red-500 line-through" : "text-ink-900"
                  }`}
                >
                  {formatoCLP(calcularTotalVenta(v))}
                </p>
                <p className="text-xs text-ink-400 capitalize">{v.estado}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
