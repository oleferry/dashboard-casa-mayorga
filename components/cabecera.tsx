import { HardHat, MapPin, RefreshCw } from "lucide-react";
import { Navegacion } from "./navegacion";
import { proyecto } from "@/lib/proyecto";
import { fechaHora } from "@/lib/formato";

function diasDeObra() {
  const inicio = new Date(`${proyecto.inicioObra}T00:00:00`);
  const dias = Math.floor((Date.now() - inicio.getTime()) / 86_400_000) + 1;
  return dias > 0 ? dias : null;
}

export function Cabecera({ enVivo, leidoEn }: { enVivo: boolean; leidoEn: string }) {
  const dia = diasDeObra();

  return (
    <>
      <header
        className="relative overflow-hidden border-b"
        style={{
          background:
            "radial-gradient(120% 140% at 0% 0%, var(--marca-fondo) 0%, transparent 55%), var(--panel)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-7 sm:pt-12 sm:pb-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-marca uppercase">
                Control de obra
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Casa en Mayorga
              </h1>
              <p className="tenue mt-2 flex items-center gap-1.5 text-sm">
                <MapPin size={14} className="shrink-0" />
                {proyecto.direccion}
              </p>
              <p className="suave mt-0.5 pl-5 text-sm">{proyecto.promotores.join(" y ")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
              {dia && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
                  <HardHat size={13} className="text-aviso" />
                  Obra en curso · día {dia}
                </span>
              )}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: enVivo ? "var(--marca-fondo)" : "var(--aviso-fondo)",
                  color: enVivo ? "var(--marca)" : "var(--aviso)",
                }}
              >
                <span className="relative flex size-2">
                  {enVivo && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-marca opacity-60" />
                  )}
                  <span
                    className="relative inline-flex size-2 rounded-full"
                    style={{ background: enVivo ? "var(--marca)" : "var(--aviso)" }}
                  />
                </span>
                {enVivo ? "Datos en vivo desde la hoja" : "Último dato guardado"}
              </span>
              <span className="suave cifra inline-flex items-center gap-1.5 text-xs">
                <RefreshCw size={11} />
                {fechaHora(new Date(leidoEn))}
              </span>
            </div>
          </div>
        </div>
      </header>

      <Navegacion />
    </>
  );
}
