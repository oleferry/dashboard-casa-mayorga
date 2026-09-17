/**
 * Registro de certificaciones de obra, leído de la pestaña «Certificaciones»
 * de la misma hoja de Google Sheets. La lectura común y la protección frente
 * a pestañas inexistentes viven en `pestanas.ts`.
 */

import { aNumero } from "./hoja";
import { aFechaIso, descargarPestana, mapearCabeceras, normalizar } from "./pestanas";

export { aFechaIso };

export const PESTANA = "Certificaciones";

export type EstadoCertificacion = "pendiente" | "aprobada" | "facturada" | "pagada";

export type Certificacion = {
  numero: string;
  fecha?: string;
  concepto: string;
  base: number;
  iva: number;
  total: number;
  estado: EstadoCertificacion;
  dispuesto: number;
  ahorros: number;
  documento?: string;
  observaciones?: string;
};

export type DatosCertificaciones = {
  lineas: Certificacion[];
  base: number;
  iva: number;
  total: number;
  dispuesto: number;
  ahorros: number;
  pagado: number;
  /** false cuando la pestaña todavía no existe o no tiene las cabeceras. */
  hayPestana: boolean;
  error?: string;
};

/** Cabeceras que reconoce el lector. La primera de cada lista es la sugerida. */
export const COLUMNAS = {
  numero: ["nº", "n", "num", "numero", "certificacion", "cert"],
  fecha: ["fecha"],
  concepto: ["concepto", "descripcion", "periodo", "capitulo"],
  base: ["base imponible", "base", "importe base", "ejecucion"],
  iva: ["iva", "impuestos"],
  total: ["total", "importe total"],
  estado: ["estado"],
  dispuesto: ["dispuesto", "hipoteca", "dispuesto de hipoteca", "banco"],
  ahorros: ["ahorros", "pagado con ahorros", "fondos propios", "aportacion propia"],
  documento: ["documento", "enlace", "url", "factura"],
  observaciones: ["observaciones", "notas", "comentarios"],
} as const;

type Campo = keyof typeof COLUMNAS;

export function aEstado(valor: string | undefined): EstadoCertificacion {
  const v = normalizar(valor ?? "");
  if (v.startsWith("pagad") || v.startsWith("cobrad")) return "pagada";
  if (v.startsWith("factur")) return "facturada";
  if (v.startsWith("aprobad") || v.startsWith("conform")) return "aprobada";
  return "pendiente";
}

export function interpretarCertificaciones(
  filas: string[][],
  ivaTipo: number,
): Omit<DatosCertificaciones, "error"> {
  // Sin fecha y sin ningún importe no es una tabla de certificaciones: es el
  // filtro que descarta la pestaña de costes cuando esta no existe.
  const cabecera = mapearCabeceras(
    filas,
    COLUMNAS,
    (i) => i.fecha >= 0 && (i.base >= 0 || i.total >= 0),
  );

  const vacio = {
    lineas: [],
    base: 0,
    iva: 0,
    total: 0,
    dispuesto: 0,
    ahorros: 0,
    pagado: 0,
    hayPestana: false,
  };

  if (!cabecera) return vacio;

  const { fila, indices } = cabecera;
  const celda = (f: string[], campo: Campo) =>
    indices[campo] >= 0 ? (f[indices[campo]] ?? "").trim() : "";

  const lineas: Certificacion[] = [];

  for (const f of filas.slice(fila + 1)) {
    const base = aNumero(celda(f, "base"));
    const totalLeido = aNumero(celda(f, "total"));
    const concepto = celda(f, "concepto");
    const numero = celda(f, "numero");

    // Fila vacía o de relleno.
    if (base === 0 && totalLeido === 0 && !concepto && !numero) continue;

    const ivaLeido = aNumero(celda(f, "iva"));
    const baseFinal = base || (totalLeido ? totalLeido / (1 + ivaTipo) : 0);
    const iva = ivaLeido || baseFinal * ivaTipo;
    const total = totalLeido || baseFinal + iva;

    if (total === 0) continue;

    const documento = celda(f, "documento");

    lineas.push({
      numero: numero || String(lineas.length + 1),
      fecha: aFechaIso(celda(f, "fecha")),
      concepto: concepto || "Certificación de obra",
      base: baseFinal,
      iva,
      total,
      estado: aEstado(celda(f, "estado")),
      dispuesto: aNumero(celda(f, "dispuesto")),
      ahorros: aNumero(celda(f, "ahorros")),
      documento: documento.startsWith("http") ? documento : undefined,
      observaciones: celda(f, "observaciones") || undefined,
    });
  }

  const suma = (f: (c: Certificacion) => number) => lineas.reduce((a, c) => a + f(c), 0);
  const dispuesto = suma((c) => c.dispuesto);
  const ahorros = suma((c) => c.ahorros);

  return {
    lineas,
    base: suma((c) => c.base),
    iva: suma((c) => c.iva),
    total: suma((c) => c.total),
    dispuesto,
    ahorros,
    pagado: dispuesto + ahorros,
    hayPestana: true,
  };
}

export async function leerCertificaciones(ivaTipo: number): Promise<DatosCertificaciones> {
  try {
    return interpretarCertificaciones(await descargarPestana(PESTANA), ivaTipo);
  } catch (e) {
    return {
      lineas: [],
      base: 0,
      iva: 0,
      total: 0,
      dispuesto: 0,
      ahorros: 0,
      pagado: 0,
      hayPestana: false,
      error: e instanceof Error ? e.message : "Error desconocido",
    };
  }
}
