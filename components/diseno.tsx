import { Lightbulb } from "lucide-react";
import { Etiqueta, Panel, Seccion, Td, Th } from "./ui";
import { fechaCorta } from "@/lib/formato";
import { hojaCostes } from "@/lib/documentos";
import { COLUMNAS_IDEAS, PESTANA_IDEAS, type DatosIdeas, type EstadoIdea } from "@/lib/ideas";
import { FUENTES, definiciones, porElegir, referenciasDiseno, type Fuente } from "@/lib/diseno";

const TONO_FUENTE: Record<Fuente, "marca" | "aviso" | "neutro"> = {
  proyecto: "marca",
  normativa: "neutro",
  ayuntamiento: "aviso",
};

const TONO_ESTADO: Record<EstadoIdea, "marca" | "aviso" | "neutro" | "critico"> = {
  decidido: "marca",
  pendiente: "aviso",
  idea: "neutro",
  descartado: "neutro",
};

const TEXTO_ESTADO: Record<EstadoIdea, string> = {
  decidido: "decidido",
  pendiente: "por decidir",
  idea: "idea",
  descartado: "descartado",
};

const EJEMPLOS: { campo: keyof typeof COLUMNAS_IDEAS; etiqueta: string; ejemplo: string }[] = [
  { campo: "area", etiqueta: "Área", ejemplo: "Fachada" },
  { campo: "idea", etiqueta: "Idea", ejemplo: "Monocapa en blanco roto" },
  { campo: "estado", etiqueta: "Estado", ejemplo: "Decidido" },
  { campo: "detalle", etiqueta: "Detalle", ejemplo: "Con zócalo de piedra caliza" },
  { campo: "enlace", etiqueta: "Enlace", ejemplo: "https://… (Drive, Pinterest, web)" },
  { campo: "fecha", etiqueta: "Fecha", ejemplo: "10/09/2026" },
];

export function SeccionDiseno({ ideas }: { ideas: DatosIdeas }) {
  return (
    <Seccion
      id="diseno"
      icono={Lightbulb}
      titulo="Diseño e ideas"
      descripcion="Lo que ya fijan el proyecto visado y la normativa de Mayorga, lo que queda a vuestra elección, y las ideas y decisiones que vayáis tomando."
      acciones={
        <a
          href={hojaCostes}
          target="_blank"
          rel="noopener noreferrer"
          className="no-imprimir panel px-3 py-1.5 text-sm transition-colors hover:bg-[var(--panel-2)]"
        >
          Abrir la hoja ↗
        </a>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Lo ya definido */}
        <Panel className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold">Lo que ya está definido</h3>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(FUENTES) as Fuente[]).map((f) => (
                <a key={f} href={FUENTES[f].url} target="_blank" rel="noopener noreferrer">
                  <Etiqueta tono={TONO_FUENTE[f]}>{FUENTES[f].etiqueta} ↗</Etiqueta>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {definiciones.map((grupo) => (
              <div key={grupo.area}>
                <p className="suave mb-2 text-[0.7rem] font-medium tracking-[0.06em] uppercase">
                  {grupo.area}
                </p>
                <ul className="space-y-2.5">
                  {grupo.items.map((d) => (
                    <li key={d.titulo} className="flex gap-2.5">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full"
                        style={{
                          background:
                            d.fuente === "proyecto"
                              ? "var(--marca)"
                              : d.fuente === "ayuntamiento"
                                ? "var(--aviso)"
                                : "var(--suave)",
                        }}
                        title={FUENTES[d.fuente].etiqueta}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug">{d.titulo}</span>
                        {d.detalle && (
                          <span className="tenue mt-0.5 block text-xs leading-relaxed">
                            {d.detalle}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        {/* Por elegir y referencias */}
        <div className="flex flex-col gap-4">
          <Panel>
            <h3 className="mb-1 text-sm font-semibold">Queda a vuestra elección</h3>
            <p className="suave mb-3 text-xs leading-relaxed">
              El proyecto lo deja expresamente abierto.
            </p>
            <ul className="divide-y" style={{ borderColor: "var(--raya)" }}>
              {porElegir.map((p) => (
                <li key={p.titulo} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="text-sm leading-snug">{p.titulo}</p>
                  <p className="tenue mt-0.5 text-xs leading-relaxed">{p.detalle}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <h3 className="mb-3 text-sm font-semibold">Dónde se ve el diseño</h3>
            <ul className="space-y-1">
              {referenciasDiseno.map((r) => (
                <li key={r.titulo}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--panel-2)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug font-medium">{r.titulo}</span>
                      <span className="tenue mt-0.5 block text-xs">{r.detalle}</span>
                    </span>
                    <span className="suave text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* Ideas propias, en vivo desde la hoja */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold">Vuestras ideas y decisiones</h3>
          {ideas.total > 0 && (
            <p className="tenue text-xs">
              {ideas.total} {ideas.total === 1 ? "idea" : "ideas"} · {ideas.decididas}{" "}
              {ideas.decididas === 1 ? "decidida" : "decididas"}
            </p>
          )}
        </div>

        {ideas.total > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.grupos.map((g) => (
              <Panel key={g.area}>
                <p className="suave mb-3 text-[0.7rem] font-medium tracking-[0.06em] uppercase">
                  {g.area}
                </p>
                <ul className="divide-y" style={{ borderColor: "var(--raya)" }}>
                  {g.ideas.map((i, n) => (
                    <li
                      key={`${i.titulo}-${n}`}
                      className="py-3 first:pt-0 last:pb-0"
                      style={i.estado === "descartado" ? { opacity: 0.55 } : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className="text-sm leading-snug font-medium"
                          style={i.estado === "descartado" ? { textDecoration: "line-through" } : undefined}
                        >
                          {i.enlace ? (
                            <a
                              href={i.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-dotted underline-offset-2"
                            >
                              {i.titulo} ↗
                            </a>
                          ) : (
                            i.titulo
                          )}
                        </p>
                        <Etiqueta tono={TONO_ESTADO[i.estado]}>{TEXTO_ESTADO[i.estado]}</Etiqueta>
                      </div>
                      {i.detalle && (
                        <p className="tenue mt-1 text-xs leading-relaxed">{i.detalle}</p>
                      )}
                      {i.fecha && (
                        <p className="suave cifra mt-1 text-xs">{fechaCorta(i.fecha)}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        ) : (
          <Panel>
            <p className="text-sm leading-relaxed">
              {ideas.hayPestana ? (
                <>
                  La pestaña{" "}
                  <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--raya)" }}>
                    {PESTANA_IDEAS}
                  </code>{" "}
                  ya existe. Cada fila que añadáis aparecerá aquí agrupada por área, como mucho 5
                  minutos después.
                </>
              ) : (
                <>
                  Para ir apuntando ideas, cread en la hoja de costes una pestaña llamada{" "}
                  <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--raya)" }}>
                    {PESTANA_IDEAS}
                  </code>{" "}
                  con estas columnas. Sólo «Idea» es imprescindible; el orden da igual.
                </>
              )}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[26rem] border-collapse text-sm">
                <thead>
                  <tr>
                    <Th ancho="7rem">Columna</Th>
                    <Th>Ejemplo</Th>
                  </tr>
                </thead>
                <tbody>
                  {EJEMPLOS.map((e) => (
                    <tr key={e.campo}>
                      <Td fuerte>{e.etiqueta}</Td>
                      <Td className="suave text-xs">{e.ejemplo}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="tenue mt-3 text-xs leading-relaxed">
              Estados reconocidos: idea, por decidir, decidido y descartado. En «Enlace» vale cualquier
              URL: una foto en Drive, un tablero de Pinterest o la web de un fabricante.
            </p>
            {ideas.error && (
              <p className="mt-3 text-xs" style={{ color: "var(--aviso)" }}>
                No se ha podido leer la hoja: {ideas.error}
              </p>
            )}
          </Panel>
        )}
      </div>
    </Seccion>
  );
}
