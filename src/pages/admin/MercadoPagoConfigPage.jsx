import { useState } from "react";
import { CreditCard, Check } from "lucide-react";
import TopBar from "../../components/layout/TopBar";
import Field, { inputClass } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function MercadoPagoConfigPage() {
  const [conectado, setConectado] = useState(true);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Mercado Pago" subtitle="Medio de pago del negocio (M1-08)" />

      <div className="flex flex-col gap-4 px-5 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <CreditCard size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-900">Cuenta Mercado Pago</p>
            <p className="text-xs text-ink-400">Checkout Pro / Point</p>
          </div>
          <Badge tone={conectado ? "ok" : "neutral"}>{conectado ? "Conectada" : "Sin conectar"}</Badge>
        </div>

        <Field label="Access Token" hint="Se obtiene desde el panel de desarrolladores de Mercado Pago.">
          <input type="password" defaultValue="APP_USR-••••••••••••••••" className={inputClass(false)} />
        </Field>

        <Field label="Public Key">
          <input defaultValue="APP_USR-2f1c-demo-key" className={inputClass(false)} />
        </Field>

        <Button icon={Check} onClick={() => setConectado(true)}>
          {conectado ? "Actualizar credenciales" : "Conectar cuenta"}
        </Button>

        <p className="text-xs text-ink-400">
          Con la cuenta conectada, el checkout de una venta (Módulo 2) queda disponible como método de pago
          junto a efectivo. La integración real se implementa en{" "}
          <code className="rounded bg-ink-100 px-1 py-0.5">feature/modulo1-mercadopago</code>.
        </p>
      </div>
    </div>
  );
}
