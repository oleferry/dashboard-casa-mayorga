import { ClipboardCheck } from "lucide-react";
import { BarraProgreso, Etiqueta, Kpi, Panel, Seccion, Td, Th } from "./ui";
import { euros, fecha, fechaCorta, pct } from "@/lib/formato";
import { COLUMNAS, PESTANA, type DatosCertificaciones } from "@/lib/certificaciones";
import { hojaCostes } from "@/lib/documentos";
import { hipoteca, proyecto } from "@/lib/proyecto";

const TONO_ESTADO = {
  pendiente: "neutro",
  aprobada: "aviso",
  facturada: "aviso",
  pagada: "marca",
} as const;

/** Columnas sugeridas para montar la pestaña, en el orden en que se usan. */
const SUGERIDAS: { campo: keyof typeof COLUMNAS; ejemplo: string }[] = [
  { campo: "numero", ejemplo: "1" },
  { campo: "fecha", ejemplo: "15/10/2026" },
  { campo: "concepto", ejemplo: "Cimentación y estructura" },
  { campo: "base", ejemplo: "24.500,00" },
  { campo: "iva", ejemplo: "2.450,00" },
  { campo: "total", ejemplo: "26.950,00" },
  { campo: "estado", ejemplo: "Pagada" },
  { campo: "dispuesto", ejemplo: "24.500,00" },
  { campo: "ahorros", ejemplo: "2.450,00" },
  { campo: "documento", ejemplo: "https://drive.google.com/…" },
  { campo: "observaciones", ejemplo: "Conforme dirección facultativa" },
];

const ETIQUETA_COLUMNA: Record<keyof typeof COLUMNAS, string> = {
  numero: "Nº",
  fecha: "Fecha",
  concepto: "Concepto",
  base: "Base imponible",
  iva: "IVA",
  total: "Total",
  estado: "Estado",
  dispuesto: "Dispuesto",
  ahorros: "Ahorros",
  documento: "Documento",
  observaciones: "Observaciones",
};

export function SeccionCertificaciones({
  datos,
  obraBase,
}: {
  datos: DatosCertificaciones;
  obraBase: number;
}) {
  const porCertificar = Math.max(0, obraBase - datos.base);
  const desviacion = datos.base - obraBase;
  const avance = obraBase > 0 ? datos.base / obraBase : 0;

  return (
    <Seccion
      id="certificaciones"
      icono={ClipboardCheck}
      titulo="Certificaciones de obra"
      descripcion="Registro de la obra ejecutada y reconocida por la dirección facultativa. Es la medida real del avance y lo que el banco libera en cada disposición."
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
      {datos.lineas.length === 0 ? (
        <SinCertificaciones datos={datos} />
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              etiqueta="Certificado a fecha"
              valor={euros(datos.base)}
              nota={`${pct(avance)} de los ${euros(obraBase)} de obra contratada · obra iniciada el ${fechaCorta(proyecto.inicioObra)}`}
              destacado
            />
            <Kpi
              etiqueta="Por certificar"
              valor={euros(porCertificar)}
              nota={`${datos.lineas.length} ${datos.lineas.length === 1 ? "certificación emitida" : "certificaciones emitidas"}`}
              tono="aviso"
            />
            <Kpi
              etiqueta="Dispuesto de hipoteca"
              valor={euros(datos.dispuesto)}
              nota={`${pct(datos.dispuesto / hipoteca.disposicionPrevista)} de los ${euros(hipoteca.disposicionPrevista)} previstos`}
              tono="marca"
            />
            <Kpi
              etiqueta="Pagado con ahorros"
              valor={euros(datos.ahorros)}
              nota="IVA y lo que la hipoteca no libera"
              tono="critico"
            />
          </div>

          <Panel className="mb-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-sm font-semibold">Avance de la obra certificada</p>
              <p className="cifra text-sm">
                {euros(datos.base)} <span className="suave">de {euros(obraBase)}</span>
              </p>
            </div>
            <BarraProgreso
              valor={datos.base}
              maximo={obraBase}
              altura={10}
              color={desviacion > 0 ? "var(--critico)" : "var(--marca)"}
            />
            {desviacion > 0 && (
              <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--critico)" }}>
                Lo certificado supera en {euros(desviacion)} la obra contratada. Toda desviación
                debe registrarse y aprobarse antes de ejecutarse.
              </p>
            )}
          </Panel>

          <div className="panel overflow-x-auto" style={{ padding: 0 }}>
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <thead>
                <tr>
                  <Th ancho="3rem">Nº</Th>
                  <Th>Concepto</Th>
                  <Th numero ancho="7rem">Base</Th>
                  <Th numero ancho="6rem">IVA</Th>
                  <Th numero ancho="7rem">Total</Th>
                  <Th numero ancho="7rem">Hipoteca</Th>
                  <Th numero ancho="7rem">Ahorros</Th>
                  <Th ancho="6rem">Estado</Th>
                </tr>
              </thead>
              <tbody>
                {datos.lineas.map((c) => (
                  <tr key={`${c.numero}-${c.concepto}`}>
                    <Td className="suave text-xs">{c.numero}</Td>
                    <Td>
                      <p className="leading-snug">
                        {c.documento ? (
                          <a
                            href={c.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-dotted underline-offset-2"
                          >
                            {c.concepto} ↗
                          </a>
                        ) : (
                          c.concepto
                        )}
                      </p>
                      {c.fecha && (
                        <p className="suave cifra mt-0.5 text-xs">{fechaCorta(c.fecha)}</p>
                      )}
                      {c.observaciones && (
                        <p className="suave mt-0.5 text-xs leading-snug">{c.observaciones}</p>
                      )}
                    </Td>
                    <Td numero>{euros(c.base)}</Td>
                    <Td numero className="tenue">
                      {euros(c.iva)}
                    </Td>
                    <Td numero fuerte>
                      {euros(c.total)}
                    </Td>
                    <Td numero>
                      <span style={{ color: c.dispuesto > 0 ? "var(--marca)" : "var(--suave)" }}>
                        {euros(c.dispuesto)}
                      </span>
                    </Td>
                    <Td numero>
                      <span style={{ color: c.ahorros > 0 ? "var(--critico)" : "var(--suave)" }}>
                        {euros(c.ahorros)}
                      </span>
                    </Td>
                    <Td>
                      <Etiqueta tono={TONO_ESTADO[c.estado]}>{c.estado}</Etiqueta>
                    </Td>
                  </tr>
                ))}
                <tr style={{ background: "var(--panel-2)" }}>
                  <Td> </Td>
                  <Td fuerte>Total certificado</Td>
                  <Td numero fuerte>
                    {euros(datos.base)}
                  </Td>
                  <Td numero fuerte>
                    {euros(datos.iva)}
                  </Td>
                  <Td numero fuerte>
                    {euros(datos.total)}
                  </Td>
                  <Td numero fuerte>
                    {euros(datos.dispuesto)}
                  </Td>
                  <Td numero fuerte>
                    {euros(datos.ahorros)}
                  </Td>
                  <Td> </Td>
                </tr>
              </tbody>
            </table>
          </div>

          {datos.total - datos.pagado > 0.005 && (
            <p className="suave mt-3 text-xs leading-relaxed">
              Quedan {euros(datos.total - datos.pagado)} certificados sin repartir entre hipoteca y
              ahorros. Completa las columnas «Dispuesto» y «Ahorros» de cada certificación para que
              el reparto cuadre.
            </p>
          )}
        </>
      )}
    </Seccion>
  );
}

/* ------------------------------------------------------------ Estado vacío */

function SinCertificaciones({ datos }: { datos: DatosCertificaciones }) {
  const lista = datos.hayPestana;

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            {lista ? "La hoja está lista, aún sin certificaciones" : "Todavía no hay certificaciones"}
          </h3>
          <p className="tenue mt-1 text-sm leading-relaxed">
            La obra arrancó el {fecha(proyecto.inicioObra)} y la primera factura está prevista para
            el {fecha(proyecto.primeraFacturaPrevista)}.
          </p>
        </div>
        <Etiqueta tono={lista ? "marca" : "neutro"}>
          {lista ? "pestaña lista" : "a la espera"}
        </Etiqueta>
      </div>

      <div className="mt-5 border-t pt-4">
        <p className="text-sm leading-relaxed">
          {lista ? (
            <>
              La pestaña{" "}
              <code
                className="cifra rounded px-1.5 py-0.5 text-xs"
                style={{ background: "var(--raya)" }}
              >
                {PESTANA}
              </code>{" "}
              ya existe en la hoja de costes. En cuanto añadas la primera fila aparecerá aquí, como
              mucho 5 minutos después. Este es el significado de cada columna:
            </>
          ) : (
            <>
              Para empezar a registrarlas, crea en la hoja de costes una pestaña llamada{" "}
              <code
                className="cifra rounded px-1.5 py-0.5 text-xs"
                style={{ background: "var(--raya)" }}
              >
                {PESTANA}
              </code>{" "}
              con estas columnas en la primera fila. El panel la detectará sola en los siguientes 5
              minutos.
            </>
          )}
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr>
                <Th ancho="11rem">Columna</Th>
                <Th>Ejemplo</Th>
              </tr>
            </thead>
            <tbody>
              {SUGERIDAS.map((s) => (
                <tr key={s.campo}>
                  <Td fuerte>{ETIQUETA_COLUMNA[s.campo]}</Td>
                  <Td className="suave text-xs">{s.ejemplo}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="tenue mt-4 space-y-1.5 text-xs leading-relaxed">
          <li>
            · El orden de las columnas da igual: se localizan por su nombre. Basta con que existan
            «Fecha» y una de «Base imponible» o «Total».
          </li>
          <li>
            · «Dispuesto» es lo que libera el banco contra esa certificación y «Ahorros» lo que
            ponéis vosotros. Su suma debería ser el total.
          </li>
          <li>· Estados reconocidos: pendiente, aprobada, facturada y pagada.</li>
          <li>· En «Documento», el enlace de Drive a la certificación o la factura.</li>
        </ul>

        {datos.error && (
          <p className="mt-4 border-t pt-3 text-xs leading-relaxed" style={{ color: "var(--aviso)" }}>
            No se ha podido leer la hoja: {datos.error}
          </p>
        )}
      </div>
    </Panel>
  );
}
