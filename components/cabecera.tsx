import { Etiqueta } from "./ui";
import { proyecto } from "@/lib/proyecto";
import { fechaHora } from "@/lib/formato";

const enlaces = [
  { href: "#resumen", texto: "Resumen" },
  { href: "#costes", texto: "Costes" },
  { href: "#obra", texto: "Obra" },
  { href: "#certificaciones", texto: "Certificaciones" },
  { href: "#capitulos", texto: "Capítulos" },
  { href: "#hipoteca", texto: "Hipoteca" },
  { href: "#cronologia", texto: "Cronología" },
  { href: "#documentos", texto: "Documentos" },
  { href: "#alertas", texto: "Alertas" },
];

export function Cabecera({ enVivo, leidoEn }: { enVivo: boolean; leidoEn: string }) {
  return (
    <header>
      <div
        className="border-b"
        style={{ background: "var(--panel)", borderColor: "var(--borde)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="suave text-[0.7rem] font-medium tracking-[0.14em] uppercase">
                Control de obra
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Casa en Mayorga
              </h1>
              <p className="tenue mt-1.5 text-sm">{proyecto.direccion}</p>
              <p className="suave mt-0.5 text-sm">{proyecto.promotores.join(" y ")}</p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <Etiqueta tono={enVivo ? "marca" : "aviso"}>
                {enVivo ? "Datos en vivo desde la hoja" : "Último dato guardado"}
              </Etiqueta>
              <p className="suave cifra text-xs">
                Actualizado el {fechaHora(new Date(leidoEn))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav
        className="no-imprimir sticky top-0 z-20 border-b backdrop-blur"
        style={{ background: "color-mix(in srgb, var(--panel) 88%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl px-5">
          <ul className="flex gap-1 overflow-x-auto py-2 text-sm">
            {enlaces.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  className="tenue block rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors hover:bg-[var(--raya)] hover:text-[var(--tinta)]"
                >
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
