import { FileText } from "lucide-react";
import { Etiqueta, Panel, Seccion, Tabla, Td, Th } from "./ui";
import { fecha, fechaCorta } from "@/lib/formato";
import {
  condicionesFein,
  dudasUnicaja,
  incoherencias,
  notaria,
  pendientesHipoteca,
  segurosHipoteca,
} from "@/lib/condiciones";

export function SeccionCondiciones() {
  const { cita } = notaria;

  return (
    <Seccion
      id="condiciones"
      icono={FileText}
      titulo="Hipoteca: condiciones y trámites"
      descripcion="Lo que fija la FEIN de Unicaja, los seguros, las incoherencias detectadas en la documentación y lo que falta para firmar."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Notaría</h3>
            <Etiqueta tono="aviso">Cita</Etiqueta>
          </div>
          <p className="text-sm font-medium">
            {fecha(cita.fecha)}, a las {cita.hora}
          </p>
          <p className="tenue mt-1 text-xs leading-relaxed">{cita.tipo}</p>
          <p className="suave mt-1 text-xs">Notaría: {cita.notario ?? "falta anotar cuál"}</p>
          <ul className="tenue mt-3 list-disc space-y-1.5 border-t pt-3 pl-5 text-xs leading-relaxed">
            {notaria.notas.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">
              Dudas enviadas a Unicaja · {fechaCorta(dudasUnicaja.fecha)}
            </h3>
            <a
              href={dudasUnicaja.hilo}
              target="_blank"
              rel="noopener noreferrer"
              className="suave text-xs hover:underline"
            >
              Ver correo ↗
            </a>
          </div>
          <p className="suave mb-2 text-xs">
            {dudasUnicaja.destinatario} · respuesta pedida antes del{" "}
            {fechaCorta(dudasUnicaja.respuestaAntesDe)}
          </p>
          <ol className="tenue list-decimal space-y-1 pl-5 text-xs leading-relaxed sm:columns-2 sm:gap-8">
            {dudasUnicaja.preguntas.map((p) => (
              <li key={p} className="break-inside-avoid">
                {p}
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Tabla>
          <thead>
            <tr>
              <Th ancho="11rem">Condiciones de la FEIN</Th>
              <Th>Valor</Th>
            </tr>
          </thead>
          <tbody>
            {condicionesFein.map((c) => (
              <tr key={c.concepto}>
                <Td className="text-sm">{c.concepto}</Td>
                <Td className="text-sm leading-snug">{c.valor}</Td>
              </tr>
            ))}
          </tbody>
        </Tabla>

        <div className="space-y-4">
          <Tabla>
            <thead>
              <tr>
                <Th ancho="11rem">Seguros</Th>
                <Th>Situación</Th>
              </tr>
            </thead>
            <tbody>
              {segurosHipoteca.map((s) => (
                <tr key={s.seguro}>
                  <Td className="text-sm">{s.seguro}</Td>
                  <Td className="text-sm leading-snug">
                    {s.situacion}
                    {s.decision && (
                      <span className="mt-1 block text-xs font-medium" style={{ color: "var(--marca)" }}>
                        {s.decision}
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Tabla>

          <Panel>
            <h3 className="mb-2 text-sm font-semibold">Falta para firmar</h3>
            <ul className="tenue list-disc space-y-1 pl-5 text-xs leading-relaxed">
              {pendientesHipoteca.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel className="mt-4">
        <h3 className="mb-3 text-sm font-semibold">Incoherencias en la documentación</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {incoherencias.map((i) => (
            <li key={i.titulo} className="text-xs leading-relaxed">
              <span className="block text-sm font-medium">{i.titulo}</span>
              <span className="tenue">{i.detalle}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Seccion>
  );
}
