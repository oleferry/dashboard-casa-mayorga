/**
 * Utilidades comunes para leer pestañas adicionales de la hoja de costes
 * (Certificaciones, Ideas…) por su nombre de columna.
 *
 * Cuidado: si se pide a gviz una pestaña que no existe, Google devuelve la
 * PRIMERA pestaña con código 200 en lugar de un error. Por eso cada lector
 * tiene que validar que las cabeceras son las suyas antes de interpretar nada;
 * `mapearCabeceras` exige ese criterio de validez de forma explícita.
 */

import { HOJA_ID, parseCSV } from "./hoja";

export const urlPestana = (nombre: string) =>
  `https://docs.google.com/spreadsheets/d/${HOJA_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    nombre,
  )}`;

/** Minúsculas, sin acentos ni signos: «Nº» → «n», «Área» → «area». */
export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

type Columnas = Record<string, readonly string[]>;

/**
 * Localiza la fila de cabecera y mapea cada campo a su índice de columna
 * (−1 si no está). `esValida` decide si esas cabeceras corresponden de verdad
 * a la tabla buscada: es el filtro que descarta la pestaña de costes.
 */
export function mapearCabeceras<C extends Columnas>(
  filas: string[][],
  columnas: C,
  esValida: (indices: Record<keyof C, number>) => boolean,
) {
  for (let i = 0; i < Math.min(filas.length, 20); i++) {
    const celdas = filas[i].map(normalizar);
    const indices = {} as Record<keyof C, number>;

    for (const campo of Object.keys(columnas) as (keyof C)[]) {
      const alias = columnas[campo];
      let idx = celdas.findIndex((c) => c !== "" && alias.includes(c));
      if (idx < 0) {
        idx = celdas.findIndex((c) => c !== "" && alias.some((a) => c.startsWith(a)));
      }
      indices[campo] = idx;
    }

    if (esValida(indices)) return { fila: i, indices };
  }

  return null;
}

/** Convierte "15/10/2026", "2026-10-15", "15-10-2026" o "Date(2026,9,15)" a ISO. */
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

/** Descarga una pestaña como filas CSV. Lanza error si la hoja no es pública. */
export async function descargarPestana(nombre: string): Promise<string[][]> {
  const respuesta = await fetch(urlPestana(nombre), {
    next: { revalidate: 300 },
    headers: { "User-Agent": "dashboard-casa-mayorga" },
  });

  if (!respuesta.ok) throw new Error(`La hoja respondió ${respuesta.status}`);

  const texto = await respuesta.text();
  if (texto.trimStart().startsWith("<")) {
    throw new Error("La hoja no es pública; Google devolvió una página de acceso");
  }

  return parseCSV(texto);
}
