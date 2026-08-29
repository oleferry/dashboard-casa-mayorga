/**
 * Registro de certificaciones de obra, leído de la pestaña «Certificaciones»
 * de la misma hoja de Google Sheets.
 *
 * Cuidado: si la pestaña no existe, el endpoint gviz devuelve la PRIMERA
 * pestaña con código 200 en lugar de dar error. Por eso no basta con que la
 * petición funcione: hay que comprobar que las cabeceras son las de una tabla
 * de certificaciones antes de interpretar nada.
 */

import { HOJA_ID, aNumero, parseCSV } from "./hoja";

export const PESTANA = "Certificaciones";

const CSV_URL = `https://docs.google.com/spreadsheets/d/${HOJA_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
  PESTANA,
)}`;

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

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

/** Localiza la fila de cabecera y mapea cada campo a su índice de columna. */
export function mapearCabeceras(filas: string[][]) {
  for (let i = 0; i < Math.min(filas.length, 20); i++) {
    const celdas = filas[i].map(normalizar);
    const indices = {} as Record<Campo, number>;

    for (const campo of Object.keys(COLUMNAS) as Campo[]) {
      const alias = COLUMNAS[campo] as readonly string[];
      let idx = celdas.findIndex((c) => c !== "" && alias.includes(c));
      if (idx < 0) {
        idx = celdas.findIndex((c) => c !== "" && alias.some((a) => c.startsWith(a)));
      }
      indices[campo] = idx;
    }

    // Sin fecha y sin ningún importe no es una tabla de certificaciones.
    // Este es el filtro que descarta la pestaña de costes que Google
    // devuelve cuando la pestaña pedida no existe.
    const tieneImporte = indices.base >= 0 || indices.total >= 0;
    if (indices.fecha >= 0 && tieneImporte) return { fila: i, indices };
  }

  return null;
}

/** Convierte "15/10/2026", "2026-10-15" o "15-10-2026" a ISO. */
export function aFechaIso(valor: string | undefined): string | undefined {
  if (!valor) return undefined;
  const v = valor.trim();
  if (!v) return undefined;

  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmy = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) {
    const [, d, m, a] = dmy;
    return `${a}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // gviz devuelve a veces Date(2026,9,15) con el mes empezando en cero.
  const gviz = v.match(/^Date\((\d+),(\d+),(\d+)/);
  if (gviz) {
    const [, a, m, d] = gviz;
    return `${a}-${String(Number(m) + 1).padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return undefined;
}

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
  const cabecera = mapearCabeceras(filas);

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
    const respuesta = await fetch(CSV_URL, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "dashboard-casa-mayorga" },
    });

    if (!respuesta.ok) throw new Error(`La hoja respondió ${respuesta.status}`);

    const texto = await respuesta.text();
    if (texto.trimStart().startsWith("<")) {
      throw new Error("La hoja no es pública; Google devolvió una página de acceso");
    }

    return interpretarCertificaciones(parseCSV(texto), ivaTipo);
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
