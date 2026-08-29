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
import { alertas, financiacion, hipoteca, hitos, proyecto } from "@/lib/proyecto";
import { gruposDocumentales } from "@/lib/documentos";

/* ------------------------------------------------------- Capítulos de obra */

export function SeccionCapitulos() {
  const { totalTecnico, filas } = calcularCapitulos();
  const mayor = filas[0]?.importe ?? 1;

  return (
    <Seccion
      id="capitulos"
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
              { clave: "Disposición prevista", valor: euros(hipoteca.disposicionPrevista) },
              { clave: "Plazo", valor: `${h.anios} años` },
              { clave: "Carencia", valor: hipoteca.carencia ? "Sí" : "No" },
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
              { clave: "Cuota hipotecaria", valor: `${euros(hipoteca.cuotaMensual)}/mes` },
              { clave: "Seguro de hogar prorrateado", valor: `${euros(h.seguroMensual)}/mes` },
              {
                clave: "Coste bancario recurrente",
                valor: (
                  <span style={{ color: "var(--marca)" }}>{euros(h.costeMensual)}/mes</span>
                ),
              },
              {
                clave: "Cuota si no se bonificara",
                nota: `Al ${pct(hipoteca.tinBase, 2)}`,
                valor: `${euros(h.cuotaSinBonificar)}/mes`,
              },
              {
                clave: "Ahorro por bonificaciones",
                valor: `${euros(h.cuotaSinBonificar - hipoteca.cuotaMensual)}/mes`,
              },
              { clave: "Total devuelto en 30 años", valor: euros(h.totalDevuelto) },
              { clave: "Intereses totales", valor: euros(h.totalIntereses) },
              { clave: "Tasación terminada", valor: euros(hipoteca.tasacion) },
            ]}
          />
          <p className="tenue mt-4 border-t pt-3 text-xs leading-relaxed">
            La cuota corresponde al préstamo totalmente dispuesto. Durante la obra hay que
            registrar el capital entregado en cada certificación y lo que el banco cobre
            realmente.
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

/* ----------------------------------------------------------------- Alertas */

export function SeccionAlertas() {
  const orden = { alta: 0, media: 1, baja: 2 } as const;
  const lista = [...alertas].sort((a, b) => orden[a.nivel] - orden[b.nivel]);

  return (
    <Seccion
      id="alertas"
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
