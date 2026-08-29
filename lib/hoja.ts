/**
 * Lectura en vivo de la hoja de control de costes de Google Sheets.
 *
 * La hoja se publica en CSV a través del endpoint `gviz`, que sólo funciona
 * si el documento está compartido como "cualquier persona con el enlace".
 * Si la lectura falla se usa el último snapshot guardado en el repositorio,
 * de forma que el panel nunca se queda en blanco.
 */

import snapshot from "@/data/snapshot.json";

export const HOJA_ID = "11jY3NY1xd9NeC1A-ssOFolTJoUnHYJe1CbZEFKpoU0w";

const CSV_URL = `https://docs.google.com/spreadsheets/d/${HOJA_ID}/gviz/tq?tqx=out:csv`;

/** Índices de columna en la hoja (A = 0). */
const COL = {
  concepto: 1,
  desglose: 2,
  descripcion: 3,
  porcentaje: 4,
  unidades: 5,
  precioUnitario: 6,
  precio: 7,
  impuestosPct: 10,
  impuestos: 11,
  total: 12,
  pagadoA: 13,
  pagadoB: 14,
  pendiente: 15,
} as const;

export type LineaCoste = {
  grupo: string;
  concepto: string;
  descripcion: string;
  unidades: number | null;
  precio: number;
  impuestos: number;
  total: number;
  pagadoA: number;
  pagadoB: number;
  pagado: number;
  pendiente: number;
  fecha?: string;
};

export type GrupoCoste = {
  nombre: string;
  lineas: LineaCoste[];
  total: number;
  pagado: number;
  pendiente: number;
};

export type DatosHoja = {
  lineas: LineaCoste[];
  grupos: GrupoCoste[];
  total: number;
  pagado: number;
  pagadoA: number;
  pagadoB: number;
  pendiente: number;
  /** true si los datos vienen de la hoja en vivo, false si son el snapshot. */
  enVivo: boolean;
  leidoEn: string;
  error?: string;
};

/** Parser CSV mínimo con soporte de comillas dobles escapadas. */
export function parseCSV(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let entreComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (entreComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') {
      entreComillas = true;
    } else if (c === ",") {
      fila.push(campo);
      campo = "";
    } else if (c === "\n") {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = "";
    } else if (c !== "\r") {
      campo += c;
    }
  }

  if (campo !== "" || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  return filas;
}

/** Convierte "1.234,56 €" o "2,06%" en número. Devuelve 0 si no hay valor. */
export function aNumero(valor: string | undefined): number {
  if (!valor) return 0;
  const limpio = valor
    .replace(/[€\s%]/g, "")
    .replace(/ /g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? n : 0;
}

const vacio = (v: string | undefined) => !v || v.trim() === "";

/**
 * Una fila es cabecera de grupo cuando lleva concepto pero no desglose,
 * ni descripción, ni unidades. El resto de filas con importe son líneas
 * de detalle, y sólo esas suman para evitar doble contabilidad.
 */
function esGrupo(fila: string[]) {
  return (
    !vacio(fila[COL.concepto]) &&
    vacio(fila[COL.desglose]) &&
    vacio(fila[COL.descripcion]) &&
    vacio(fila[COL.unidades])
  );
}

export function interpretarFilas(
  filas: string[][],
  fechas: Record<string, string> = {},
): Omit<DatosHoja, "enVivo" | "leidoEn" | "error"> {
  const cabecera = filas.findIndex(
    (f) => f.some((c) => c.trim() === "Concepto") && f.some((c) => c.trim() === "Total"),
  );
  const cuerpo = filas.slice(cabecera >= 0 ? cabecera + 1 : 0);

  const lineas: LineaCoste[] = [];
  const grupos: GrupoCoste[] = [];
  let grupoActual = "Sin clasificar";

  for (const fila of cuerpo) {
    const concepto = (fila[COL.concepto] ?? "").trim();
    const desglose = (fila[COL.desglose] ?? "").trim();
    const descripcion = (fila[COL.descripcion] ?? "").trim();

    if (esGrupo(fila)) {
      grupoActual = concepto;
      continue;
    }

    const etiqueta = concepto || desglose;
    if (!etiqueta && !descripcion) continue;

    const total = aNumero(fila[COL.total]);
    const pagadoA = aNumero(fila[COL.pagadoA]);
    const pagadoB = aNumero(fila[COL.pagadoB]);
    const pendiente = aNumero(fila[COL.pendiente]);

    // Se descartan las filas de plantilla que siguen a cero.
    if (total === 0 && pagadoA === 0 && pagadoB === 0 && pendiente === 0) continue;

    const nombre = concepto && desglose ? `${concepto} — ${desglose}` : etiqueta;

    lineas.push({
      grupo: grupoActual,
      concepto: nombre,
      descripcion,
      unidades: vacio(fila[COL.unidades]) ? null : aNumero(fila[COL.unidades]),
      precio: aNumero(fila[COL.precio]),
      impuestos: aNumero(fila[COL.impuestos]),
      total,
      pagadoA,
      pagadoB,
      pagado: pagadoA + pagadoB,
      pendiente,
      fecha: fechas[desglose] ?? fechas[concepto] ?? fechas[nombre],
    });
  }

  for (const linea of lineas) {
    let grupo = grupos.find((g) => g.nombre === linea.grupo);
    if (!grupo) {
      grupo = { nombre: linea.grupo, lineas: [], total: 0, pagado: 0, pendiente: 0 };
      grupos.push(grupo);
    }
    grupo.lineas.push(linea);
    grupo.total += linea.total;
    grupo.pagado += linea.pagado;
    grupo.pendiente += linea.pendiente;
  }

  const suma = (f: (l: LineaCoste) => number) => lineas.reduce((a, l) => a + f(l), 0);

  return {
    lineas,
    grupos,
    total: suma((l) => l.total),
    pagado: suma((l) => l.pagado),
    pagadoA: suma((l) => l.pagadoA),
    pagadoB: suma((l) => l.pagadoB),
    pendiente: suma((l) => l.pendiente),
  };
}

export async function leerHoja(fechas: Record<string, string> = {}): Promise<DatosHoja> {
  const leidoEn = new Date().toISOString();

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

    const datos = interpretarFilas(parseCSV(texto), fechas);
    if (datos.lineas.length === 0) throw new Error("La hoja no devolvió ninguna línea de coste");

    return { ...datos, enVivo: true, leidoEn };
  } catch (e) {
    const datos = interpretarFilas(snapshot.filas as string[][], fechas);
    return {
      ...datos,
      enVivo: false,
      leidoEn: snapshot.capturadoEn,
      error: e instanceof Error ? e.message : "Error desconocido leyendo la hoja",
    };
  }
}
