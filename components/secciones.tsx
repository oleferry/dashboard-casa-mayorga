import {
  CalendarClock,
  FolderOpen,
  Landmark,
  Layers,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  BarraProgreso,
  Etiqueta,
  ListaDatos,
  Panel,
  Seccion,
  Tabla,
  Td,
  Th,
} from "./ui";
import { euros, fecha, fechaCorta, num, pct } from "@/lib/formato";
import { calcularCapitulos, calcularHipoteca } from "@/lib/calculos";
import { alertas, financiacion, hipoteca, hitos, obligaciones, proyecto } from "@/lib/proyecto";
import { gruposDocumentales } from "@/lib/documentos";

/* ------------------------------------------------------- Capítulos de obra */

export function SeccionCapitulos() {
  const { totalTecnico, filas } = calcularCapitulos();
  const mayor = filas[0]?.importe ?? 1;

  return (
    <Seccion
      id="capitulos"
      icono={Layers}
      titulo="Capítulos de obra"
      descripcion="Desglose del proyecto técnico por capítulos. La estimación operativa reparte los 265.000 € del contrato principal según el peso de cada capítulo: sirve para validar certificaciones, no es un precio contractual."
    >
      <Tabla>
        <thead>
          <tr>
            <Th ancho="5rem">Cap.</Th>
            <Th>Capítulo</Th>
            <Th numero ancho="8rem">Proyecto técnico</Th>
            <Th numero ancho="5rem">Peso</Th>
            <Th numero ancho="9rem">Estimación operativa</Th>
          </tr>
        </thead>
        <tbody>
          {filas.map((c) => (
            <tr key={c.codigo}>
              <Td className="suave text-xs whitespace-nowrap">{c.codigo}</Td>
              <Td>
                <div className="min-w-[12rem]">
                  <p className="leading-snug">{c.nombre}</p>
                  <div className="mt-1.5 max-w-[16rem]">
                    <BarraProgreso valor={c.importe} maximo={mayor} altura={4} />
                  </div>
                </div>
              </Td>
              <Td numero>{euros(c.importe)}</Td>
              <Td numero className="suave">
                {pct(c.peso)}
              </Td>
              <Td numero fuerte>
                {euros(c.estimacionOperativa)}
              </Td>
            </tr>
          ))}
          <tr style={{ background: "var(--panel-2)" }}>
            <Td> </Td>
            <Td fuerte>Total ejecución material</Td>
            <Td numero fuerte>
              {euros(totalTecnico)}
            </Td>
            <Td numero fuerte>
              100,0%
            </Td>
            <Td numero fuerte>
              {euros(265000)}
            </Td>
          </tr>
        </tbody>
      </Tabla>
    </Seccion>
  );
}

/* ---------------------------------------------------------------- Hipoteca */

export function SeccionHipoteca() {
  const h = calcularHipoteca();

  return (
    <Seccion
      id="hipoteca"
      icono={Landmark}
      titulo="Hipoteca"
      descripcion={hipoteca.estado}
      acciones={<Etiqueta tono="aviso">Pendiente de firma</Etiqueta>}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold">Condiciones de {hipoteca.entidad}</h3>
          <ListaDatos
            datos={[
              { clave: "Importe máximo ofrecido", valor: euros(hipoteca.importeMaximoOfrecido) },
              {
                clave: "Disposición prevista",
                nota: `Contrato de ${euros(hipoteca.disposicionContrato)} más un ${pct(hipoteca.desviacionPrevista, 0)} de desviación`,
                valor: (
                  <span style={{ color: "var(--marca)" }}>
                    {euros(hipoteca.disposicionPrevista)}
                  </span>
                ),
              },
              {
                clave: "Plazo total",
                nota: `${h.carenciaAnios} año de carencia + ${h.anios} de amortización`,
                valor: `${h.plazoTotalAnios} años`,
              },
              {
                clave: "Carencia",
                nota: "Sólo intereses de lo dispuesto",
                valor: (
                  <span style={{ color: "var(--marca)" }}>{h.carenciaAnios} año</span>
                ),
              },
              { clave: "Tipo fijo sin bonificar", valor: pct(hipoteca.tinBase, 2) },
              { clave: "Bonificación prevista", valor: `−${pct(hipoteca.bonificacionTotal, 2)}` },
              {
                clave: "Tipo fijo final",
                valor: <span style={{ color: "var(--marca)" }}>{pct(hipoteca.tinFinal, 2)}</span>,
              },
              { clave: "Comisión de apertura", valor: euros(hipoteca.comisionApertura) },
              {
                clave: "Amortización anticipada",
                valor: pct(hipoteca.comisionAmortizacionAnticipada, 2),
              },
            ]}
          />
        </Panel>

        <Panel className="lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold">Coste mensual y total</h3>
          <ListaDatos
            datos={[
              {
                clave: "Durante la carencia",
                nota: "Sólo intereses, con todo dispuesto",
                valor: `${euros(h.cuotaCarencia)}/mes`,
              },
              {
                clave: "Cuota tras la carencia",
                valor: `${euros(h.cuotaMensual)}/mes`,
              },
              { clave: "Seguro de hogar prorrateado", valor: `${euros(h.seguroMensual)}/mes` },
              {
                clave: "Seguro de salud prorrateado",
                nota: hipoteca.seguroSaludAnual > 0 ? undefined : "Pendiente de concretar",
                valor:
                  hipoteca.seguroSaludAnual > 0 ? `${euros(h.seguroSaludMensual)}/mes` : "—",
              },
              {
                clave: "Coste bancario recurrente",
                nota: "Cuota más seguros, tras la carencia",
                valor: (
                  <span style={{ color: "var(--marca)" }}>{euros(h.costeMensual)}/mes</span>
                ),
              },
              {
                clave: "Cuota si sólo se dispusiera el contrato",
                nota: `Sobre ${euros(hipoteca.disposicionContrato)}`,
                valor: `${euros(h.cuotaSoloContrato)}/mes`,
              },
              {
                clave: "Cuota si no se bonificara",
                nota: `Al ${pct(hipoteca.tinBase, 2)}`,
                valor: `${euros(h.cuotaSinBonificar)}/mes`,
              },
              {
                clave: "Ahorro por bonificaciones",
                valor: `${euros(h.cuotaSinBonificar - h.cuotaMensual)}/mes`,
              },
              {
                clave: `Total devuelto en ${h.anios} años`,
                nota: "Sin contar los intereses de la carencia",
                valor: euros(h.totalDevuelto),
              },
              { clave: "Intereses de la amortización", valor: euros(h.totalIntereses) },
              {
                clave: "Intereses del año de carencia",
                nota: "Estimado: el capital se dispone a plazos",
                valor: euros(h.interesesCarenciaEstimados),
              },
              { clave: "Tasación terminada", valor: euros(hipoteca.tasacion) },
            ]}
          />
          <p className="tenue mt-4 border-t pt-3 text-xs leading-relaxed">
            Durante el año de carencia sólo se pagan intereses del capital dispuesto, así que la
            cifra de carencia es el techo de esa fase: al principio de la obra será mucho menor,
            porque el capital se libera contra certificaciones. Hay que registrar en cada una lo
            que entrega el banco y lo que cobra realmente.
          </p>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--aviso)" }}>
            Unicaja ofreció {euros(h.cuotaOfertadaBanco.cuota)}/mes para{" "}
            {euros(h.cuotaOfertadaBanco.capital)}, que son exactamente 360 mensualidades. Con{" "}
            {h.plazoTotalAnios} años totales se amortiza en {hipoteca.plazoMeses} y esa misma
            disposición saldría a {euros(h.cuotaOfertadaRecalculada)}/mes. Conviene aclarar con el
            banco de qué plazo hablaba su oferta.
          </p>
        </Panel>

        <Panel className="lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold">Bonificaciones</h3>
          <ul className="space-y-3">
            {hipoteca.bonificaciones.map((b) => (
              <li key={b.vinculacion} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm leading-snug">{b.vinculacion}</p>
                  <span className="cifra shrink-0 text-sm font-medium">
                    {b.puntos > 0 ? `−${pct(b.puntos, 2)}` : "—"}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Etiqueta
                    tono={
                      b.estado === "prevista"
                        ? "marca"
                        : b.estado === "pendiente"
                          ? "aviso"
                          : "neutro"
                    }
                  >
                    {b.estado}
                  </Etiqueta>
                  <span className="suave text-xs">{b.requisito}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-3">
            <p className="suave mb-2 text-[0.7rem] font-medium tracking-[0.06em] uppercase">
              Alternativas para el 0,10%
            </p>
            {h.alternativas.map((a) => (
              <div key={a.alternativa} className="flex items-baseline justify-between gap-3 py-1">
                <span className="tenue text-xs leading-snug">{a.alternativa}</span>
                <span className="cifra shrink-0 text-xs font-medium">
                  {euros(a.salidaMensualTotal)}/mes
                </span>
              </div>
            ))}
            <p className="suave mt-2 text-xs leading-relaxed">
              La aportación al fondo o al plan no es gasto consumido: sigue siendo patrimonio.
            </p>
          </div>
        </Panel>
      </div>
    </Seccion>
  );
}

/* -------------------------------------------------------------- Cronología */

export function SeccionCronologia() {
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <Seccion
      id="cronologia"
      icono={CalendarClock}
      titulo="Cronología"
      descripcion="Hitos administrativos y económicos del proyecto."
    >
      <Panel>
        <ol className="relative space-y-0">
          {hitos.map((hito, i) => {
            const pasado = hito.fecha <= hoy && hito.estado === "hecho";
            return (
              <li key={hito.titulo} className="relative flex gap-4 pb-5 last:pb-0">
                <div className="flex shrink-0 flex-col items-center">
                  <span
                    className="mt-1.5 size-2.5 shrink-0 rounded-full"
                    style={{
                      background: pasado ? "var(--marca)" : "var(--suave)",
                      boxShadow: "0 0 0 4px var(--panel)",
                    }}
                  />
                  {i < hitos.length - 1 && (
                    <span className="mt-1 w-px grow" style={{ background: "var(--borde)" }} />
                  )}
                </div>
                <div className="-mt-0.5 min-w-0 flex-1">
                  <p className="suave cifra text-xs">{fechaCorta(hito.fecha)}</p>
                  <p className="mt-0.5 text-sm leading-snug">{hito.titulo}</p>
                </div>
                {hito.estado === "previsto" && <Etiqueta tono="aviso">Previsto</Etiqueta>}
              </li>
            );
          })}
        </ol>
      </Panel>
    </Seccion>
  );
}

/* ------------------------------------------------------------ Documentación */

export function SeccionDocumentos() {
  return (
    <Seccion
      id="documentos"
      icono={FolderOpen}
      titulo="Documentación"
      descripcion="Todo el expediente en Google Drive. Los enlaces sólo funcionan para quien tenga acceso a la carpeta."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {gruposDocumentales.map((grupo) => (
          <Panel key={grupo.id}>
            <h3 className="text-sm font-semibold">{grupo.titulo}</h3>
            <p className="suave mt-0.5 mb-3 text-xs leading-relaxed">{grupo.descripcion}</p>
            <ul className="divide-y" style={{ borderColor: "var(--raya)" }}>
              {grupo.documentos.map((d) => (
                <li key={d.url + d.titulo}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--panel-2)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm leading-snug font-medium">{d.titulo}</span>
                        {d.clave && <Etiqueta tono="marca">clave</Etiqueta>}
                      </span>
                      <span className="tenue mt-0.5 block text-xs leading-relaxed">
                        {d.descripcion}
                      </span>
                      {d.fecha && (
                        <span className="suave cifra mt-0.5 block text-xs">
                          {fechaCorta(d.fecha)}
                        </span>
                      )}
                    </span>
                    <span className="suave mt-0.5 shrink-0 text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Seccion>
  );
}

/* ------------------------------------------- Seguros y obligaciones legales */

const TONO_CARACTER = {
  obligatorio: "critico",
  verificar: "aviso",
  contractual: "aviso",
  opcional: "neutro",
  exento: "marca",
} as const;

const TEXTO_CARACTER = {
  obligatorio: "obligatorio",
  verificar: "hay que verificar",
  contractual: "contractual",
  opcional: "opcional",
  exento: "exento por ley",
} as const;

export function SeccionObligaciones() {
  const orden = { alta: 0, media: 1, baja: 2 } as const;
  const lista = [...obligaciones].sort((a, b) => orden[a.urgencia] - orden[b.urgencia]);

  return (
    <Seccion
      id="obligaciones"
      icono={ShieldCheck}
      titulo="Seguros y obligaciones legales"
      descripcion="Qué es obligatorio, qué le toca al constructor y qué conviene aunque no lo sea. Resumen orientativo de la LOE y el RD 1627/1997 para una autopromoción de vivienda unifamiliar de uso propio."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {lista.map((o) => (
          <div
            key={o.concepto}
            className="panel flex flex-col gap-2.5 p-4"
            style={{
              borderLeftWidth: 3,
              borderLeftColor:
                o.urgencia === "alta"
                  ? "var(--critico)"
                  : o.urgencia === "media"
                    ? "var(--aviso)"
                    : "var(--borde)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm leading-snug font-semibold">{o.concepto}</h3>
              <Etiqueta tono={TONO_CARACTER[o.caracter]}>{TEXTO_CARACTER[o.caracter]}</Etiqueta>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "var(--aviso)" }}>
              {o.plazo}
            </p>

            <p className="tenue text-xs leading-relaxed">{o.detalle}</p>

            <dl className="mt-auto space-y-1 border-t pt-2.5">
              <div className="flex justify-between gap-3">
                <dt className="suave text-xs">A quién le toca</dt>
                <dd className="text-xs">{o.quien}</dd>
              </div>
              {o.coste && (
                <div className="flex justify-between gap-3">
                  <dt className="suave text-xs">Coste</dt>
                  <dd className="cifra text-right text-xs">{o.coste}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="suave text-xs">Base</dt>
                <dd className="suave text-right text-xs">{o.base}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <p className="suave mt-4 text-xs leading-relaxed">
        Esto es un resumen para no perder de vista las decisiones abiertas, no asesoramiento legal.
        Conviene contrastarlo con la dirección facultativa —el aparejador es quien lleva la
        coordinación de seguridad y salud en obra— y con un corredor de seguros antes de contratar
        o descartar nada.
      </p>
    </Seccion>
  );
}

/* ----------------------------------------------------------------- Alertas */


export function SeccionAlertas() {
  const orden = { alta: 0, media: 1, baja: 2 } as const;
  const lista = [...alertas].sort((a, b) => orden[a.nivel] - orden[b.nivel]);

  return (
    <Seccion
      id="alertas"
      icono={TriangleAlert}
      titulo="Alertas y decisiones abiertas"
      descripcion="Lo que hay que resolver o vigilar antes de que la obra avance."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {lista.map((a) => (
          <div
            key={a.titulo}
            className="panel p-4"
            style={{
              borderLeftWidth: 3,
              borderLeftColor:
                a.nivel === "alta"
                  ? "var(--critico)"
                  : a.nivel === "media"
                    ? "var(--aviso)"
                    : "var(--borde)",
            }}
          >
            <div className="mb-1.5 flex items-start justify-between gap-3">
              <h3 className="text-sm leading-snug font-semibold">{a.titulo}</h3>
              <Etiqueta
                tono={a.nivel === "alta" ? "critico" : a.nivel === "media" ? "aviso" : "neutro"}
              >
                {a.nivel}
              </Etiqueta>
            </div>
            <p className="tenue text-xs leading-relaxed">{a.detalle}</p>
          </div>
        ))}
      </div>
    </Seccion>
  );
}

/* ------------------------------------------------------------ Ficha técnica */

export function FichaProyecto() {
  return (
    <Panel>
      <h3 className="mb-3 text-sm font-semibold">Ficha del proyecto</h3>
      <ListaDatos
        datos={[
          { clave: "Superficie construida", valor: `${num(proyecto.superficieConstruida)} m²` },
          {
            clave: "Parcela",
            nota: "Registro, Catastro y proyecto ya coinciden",
            valor: (
              <span style={{ color: "var(--marca)" }}>
                {num(proyecto.superficieParcela)} m²
              </span>
            ),
          },
          { clave: "Referencia catastral", valor: proyecto.referenciaCatastral },
          {
            clave: "Valor del suelo escriturado",
            nota: "Base que computa el banco",
            valor: euros(financiacion.valorSueloEscriturado),
          },
          {
            clave: "Proyecto visado",
            valor: `${proyecto.expedienteVisado} · ${fechaCorta(proyecto.fechaVisado)}`,
          },
          { clave: "Licencia de obra", valor: fecha(proyecto.fechaLicencia) },
          {
            clave: "Inicio de obra",
            valor: (
              <span style={{ color: "var(--marca)" }}>{fecha(proyecto.inicioObra)}</span>
            ),
          },
          { clave: "Constructor", valor: proyecto.constructor },
          { clave: "Arquitecto", valor: proyecto.arquitecto },
          {
            clave: "Primera factura prevista",
            valor: (
              <span style={{ color: "var(--aviso)" }}>
                {fecha(proyecto.primeraFacturaPrevista)}
              </span>
            ),
          },
        ]}
      />
    </Panel>
  );
}
