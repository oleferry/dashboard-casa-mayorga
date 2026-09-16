import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CifraAnimada } from "./cifra-animada";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- Sección */

export function Seccion({
  id,
  titulo,
  descripcion,
  acciones,
  icono: Icono,
  children,
}: {
  id: string;
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
  icono?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icono && (
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-marca-fondo text-marca">
              <Icono size={18} strokeWidth={2.2} />
            </span>
          )}
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{titulo}</h2>
            {descripcion && (
              <p className="tenue mt-1 max-w-2xl text-sm leading-relaxed">{descripcion}</p>
            )}
          </div>
        </div>
        {acciones}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ Panel */

export function Panel({
  children,
  className = "",
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return <div className={cn("panel", padding && "p-5", className)}>{children}</div>;
}

/* -------------------------------------------------------------------- KPI */

const TONOS = {
  neutro: { color: "var(--tinta)", fondo: "var(--raya)", icono: "var(--tenue)" },
  marca: { color: "var(--marca)", fondo: "var(--marca-fondo)", icono: "var(--marca)" },
  aviso: { color: "var(--aviso)", fondo: "var(--aviso-fondo)", icono: "var(--aviso)" },
  critico: { color: "var(--critico)", fondo: "var(--critico-fondo)", icono: "var(--critico)" },
} as const;

export function Kpi({
  etiqueta,
  valor,
  numero,
  sufijo,
  nota,
  tono = "neutro",
  destacado = false,
  icono: Icono,
  className,
}: {
  etiqueta: string;
  valor: string;
  /** Si se indica, la cifra se anima contando desde cero al entrar en pantalla. */
  numero?: number;
  sufijo?: string;
  nota?: string;
  tono?: "neutro" | "marca" | "aviso" | "critico";
  destacado?: boolean;
  icono?: LucideIcon;
  className?: string;
}) {
  const t = TONOS[tono];

  return (
    <div
      className={cn(
        "panel relative flex flex-col gap-3 overflow-hidden p-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 sm:p-5",
        className,
      )}
      style={
        destacado
          ? {
              backgroundImage: "linear-gradient(135deg, var(--marca-fondo) 0%, transparent 65%)",
              borderColor: "color-mix(in srgb, var(--marca) 30%, var(--borde))",
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <p className="suave pt-1 text-[0.7rem] font-semibold tracking-[0.08em] uppercase">
          {etiqueta}
        </p>
        {Icono && (
          <span
            className="grid size-8 shrink-0 place-items-center rounded-lg"
            style={{ background: t.fondo, color: t.icono }}
          >
            <Icono size={16} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <p
        className="cifra text-[1.55rem] leading-none font-semibold tracking-tight sm:text-[1.75rem]"
        style={{ color: t.color }}
      >
        {numero !== undefined ? <CifraAnimada valor={numero} sufijo={sufijo} /> : valor}
      </p>
      {nota && <p className="tenue text-xs leading-snug">{nota}</p>}
    </div>
  );
}

/* ------------------------------------------------------------ Barra apilada */

export type Tramo = { etiqueta: string; valor: number; color: string };

export function BarraApilada({
  tramos,
  altura = 14,
  leyenda = true,
  formato,
}: {
  tramos: Tramo[];
  altura?: number;
  leyenda?: boolean;
  formato: (n: number) => string;
}) {
  const total = tramos.reduce((a, t) => a + t.valor, 0) || 1;

  return (
    <div className="space-y-3">
      <div
        className="flex w-full overflow-hidden rounded-full"
        style={{ height: altura, background: "var(--raya)" }}
      >
        {tramos.map((t) => (
          <div
            key={t.etiqueta}
            style={{ width: `${(t.valor / total) * 100}%`, background: t.color }}
            title={`${t.etiqueta}: ${formato(t.valor)}`}
          />
        ))}
      </div>
      {leyenda && (
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {tramos.map((t) => (
            <li key={t.etiqueta} className="flex items-baseline gap-2 text-sm">
              <span
                className="mt-1 inline-block size-2.5 shrink-0 rounded-full"
                style={{ background: t.color }}
              />
              <span className="tenue">{t.etiqueta}</span>
              <span className="cifra font-medium">{formato(t.valor)}</span>
              <span className="suave cifra text-xs">
                {((t.valor / total) * 100).toFixed(1).replace(".", ",")}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Barra de progreso */

export function BarraProgreso({
  valor,
  maximo,
  color = "var(--marca)",
  altura = 6,
}: {
  valor: number;
  maximo: number;
  color?: string;
  altura?: number;
}) {
  const p = maximo > 0 ? Math.min(100, Math.max(0, (valor / maximo) * 100)) : 0;
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: altura, background: "var(--raya)" }}
    >
      <div style={{ width: `${p}%`, height: "100%", background: color }} />
    </div>
  );
}

/* ---------------------------------------------------------------- Etiqueta */

export function Etiqueta({
  children,
  tono = "neutro",
}: {
  children: ReactNode;
  tono?: "neutro" | "marca" | "aviso" | "critico";
}) {
  const estilos: Record<string, { background: string; color: string }> = {
    neutro: { background: "var(--raya)", color: "var(--tenue)" },
    marca: { background: "var(--marca-fondo)", color: "var(--marca)" },
    aviso: { background: "var(--aviso-fondo)", color: "var(--aviso)" },
    critico: { background: "var(--critico-fondo)", color: "var(--critico)" },
  };

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium whitespace-nowrap"
      style={estilos[tono]}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Tabla */

export function Tabla({ children }: { children: ReactNode }) {
  return (
    <div className="panel overflow-x-auto" style={{ padding: 0 }}>
      <table className="w-full min-w-[34rem] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  numero = false,
  ancho,
}: {
  children: ReactNode;
  numero?: boolean;
  ancho?: string;
}) {
  return (
    <th
      scope="col"
      className={`suave border-b px-4 py-3 text-[0.7rem] font-medium tracking-[0.06em] uppercase ${
        numero ? "text-right" : "text-left"
      }`}
      style={{ width: ancho }}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numero = false,
  fuerte = false,
  className = "",
}: {
  children: ReactNode;
  numero?: boolean;
  fuerte?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`border-b px-4 py-2.5 align-middle ${numero ? "cifra text-right" : ""} ${
        fuerte ? "font-semibold" : ""
      } ${className}`}
      style={{ borderColor: "var(--raya)" }}
    >
      {children}
    </td>
  );
}

/* ------------------------------------------------------------ Lista clave */

export function ListaDatos({
  datos,
}: {
  datos: { clave: string; valor: ReactNode; nota?: string }[];
}) {
  return (
    <dl className="divide-y" style={{ borderColor: "var(--raya)" }}>
      {datos.map((d) => (
        <div key={d.clave} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="tenue text-sm">
            {d.clave}
            {d.nota && <span className="suave block text-xs">{d.nota}</span>}
          </dt>
          <dd className="cifra text-right text-sm font-medium">{d.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
