/**
 * Ideas y decisiones de diseño de los promotores, leídas de la pestaña «Ideas»
 * de la hoja. Las columnas se localizan por su nombre; basta con que exista
 * «Idea».
 */

import { aFechaIso, descargarPestana, mapearCabeceras, normalizar } from "./pestanas";

export const PESTANA_IDEAS = "Ideas";

export type EstadoIdea = "idea" | "pendiente" | "decidido" | "descartado";

export type Idea = {
  area: string;
  titulo: string;
  estado: EstadoIdea;
  detalle?: string;
  enlace?: string;
  fecha?: string;
};

export type GrupoIdeas = { area: string; ideas: Idea[] };

export type DatosIdeas = {
  grupos: GrupoIdeas[];
  total: number;
  decididas: number;
  hayPestana: boolean;
  error?: string;
};

/** Cabeceras que reconoce el lector. La primera de cada lista es la sugerida. */
export const COLUMNAS_IDEAS = {
  area: ["area", "zona", "estancia", "elemento", "categoria"],
  idea: ["idea", "titulo", "propuesta", "decision"],
  estado: ["estado"],
  detalle: ["detalle", "descripcion", "notas", "observaciones"],
  enlace: ["enlace", "url", "link", "referencia", "imagen", "foto"],
  fecha: ["fecha"],
} as const;

type Campo = keyof typeof COLUMNAS_IDEAS;

export function aEstadoIdea(valor: string | undefined): EstadoIdea {
  const v = normalizar(valor ?? "");
  if (/^(decidid|definid|aprobad|elegid|confirmad|hecho)/.test(v)) return "decidido";
  if (/^(descartad|rechazad|no )/.test(v)) return "descartado";
  if (/^(pendient|por decidir|duda|dudos)/.test(v)) return "pendiente";
  return "idea";
}

const vacio = { grupos: [], total: 0, decididas: 0, hayPestana: false };

export function interpretarIdeas(filas: string[][]): Omit<DatosIdeas, "error"> {
  // Sin columna «Idea» no es la pestaña de ideas: descarta la hoja de costes
  // (y la de certificaciones) cuando Google devuelve otra en su lugar.
  const cabecera = mapearCabeceras(filas, COLUMNAS_IDEAS, (i) => i.idea >= 0);
  if (!cabecera) return vacio;

  const { fila, indices } = cabecera;
  const celda = (f: string[], campo: Campo) =>
    indices[campo] >= 0 ? (f[indices[campo]] ?? "").trim() : "";

  const grupos: GrupoIdeas[] = [];

  for (const f of filas.slice(fila + 1)) {
    const titulo = celda(f, "idea");
    if (!titulo) continue;

    const area = celda(f, "area") || "General";
    const enlace = celda(f, "enlace");

    const idea: Idea = {
      area,
      titulo,
      estado: aEstadoIdea(celda(f, "estado")),
      detalle: celda(f, "detalle") || undefined,
      enlace: /^https?:\/\//.test(enlace) ? enlace : undefined,
      fecha: aFechaIso(celda(f, "fecha")),
    };

    let grupo = grupos.find((g) => normalizar(g.area) === normalizar(area));
    if (!grupo) {
      grupo = { area, ideas: [] };
      grupos.push(grupo);
    }
    grupo.ideas.push(idea);
  }

  const todas = grupos.flatMap((g) => g.ideas);

  return {
    grupos,
    total: todas.length,
    decididas: todas.filter((i) => i.estado === "decidido").length,
    hayPestana: true,
  };
}

export async function leerIdeas(): Promise<DatosIdeas> {
  try {
    return interpretarIdeas(await descargarPestana(PESTANA_IDEAS));
  } catch (e) {
    return { ...vacio, error: e instanceof Error ? e.message : "Error desconocido" };
  }
}
